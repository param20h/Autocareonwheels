import React, { useEffect, useState } from 'react';
import { LogOut, Calendar, CheckCircle, Clock, Settings, UserCircle, CarFront } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminBookings();
  }, []);

  const fetchAdminBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data.data);
    } catch (error) {
      console.error("Failed to load admin bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAction();
    navigate('/');
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert('Failed to update booking status.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border bg-opacity-70 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border bg-opacity-70 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border bg-opacity-70 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Admin Sidebar & Header Structure (Mocked as Topbar for simplicity) */}
      <nav className="bg-[#0f172a] h-16 flex items-center justify-between px-6 shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-3 text-white">
          <Settings className="text-accent" size={24} />
          <span className="font-black text-xl tracking-tight">AutoCare Admin Base</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white transition-colors font-bold text-sm bg-gray-800 px-4 py-2 rounded-btn"
        >
          <LogOut size={16} className="mr-2" /> End Shift
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-6">
        
        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Jobs', val: bookings.length, icon: Calendar },
            { label: 'Pending Action', val: bookings.filter(b=>b.status === 'PENDING').length, icon: Clock },
            { label: 'Completed', val: bookings.filter(b=>b.status === 'COMPLETED').length, icon: CheckCircle },
            { label: 'Revenue Expected', val: `₹${bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0).toLocaleString()}`, icon: CarFront }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-card border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-primary">{stat.val}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-accent">
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Global Operations Terminal (The Grid) */}
        <div className="bg-white rounded-card shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-primary flex items-center">
               Global Job Board
            </h2>
          </div>
          
          {loading ? (
             <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                    <th className="p-4 pl-6 font-semibold">Job ID</th>
                    <th className="p-4 font-semibold">Client Detail</th>
                    <th className="p-4 font-semibold">Service</th>
                    <th className="p-4 font-semibold">Schedule</th>
                    <th className="p-4 font-semibold">Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4 pl-6 text-sm font-black text-gray-400">
                        #{booking.id.toString().padStart(4, '0')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <UserCircle size={32} className="text-gray-300 mr-3" />
                          <div>
                            <p className="text-sm font-bold text-primary">{booking.user?.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{booking.user?.phone || booking.user?.email}</p>
                            <p className="text-xs text-gray-400 max-w-[200px] truncate" title={booking.address}>{booking.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-gray-700">{booking.service?.name}</p>
                        <p className="text-xs font-black text-accent mt-0.5">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{booking.time_slot}</p>
                      </td>
                      <td className="p-4">
                        <select 
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer outline-none focus:ring-2 focus:ring-accent ${getStatusColor(booking.status)}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
