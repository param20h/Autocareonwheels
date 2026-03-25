import React, { useEffect, useState } from 'react';
import { LogOut, Calendar, Car, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';

const CustomerDashboard = () => {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.data);
      } catch (error) {
        console.error("Failed to load booking history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const handleLogout = () => {
    logoutAction();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Topbar */}
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">{user?.name}</h2>
            <p className="text-xs text-gray-500 font-medium">AutoCare Member</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-500 hover:text-red-500 transition-colors font-semibold text-sm"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-primary mb-2">My Service History</h1>
            <p className="text-gray-500">View and manage your upcoming and past bookings.</p>
          </div>
          <button 
            onClick={() => navigate('/book')}
            className="px-6 py-3 bg-accent text-white rounded-btn font-bold shadow-md hover:bg-accent/90 transition-colors"
          >
            New Booking
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-card p-12 text-center border border-gray-100 shadow-sm">
            <Car size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No active bookings</h3>
            <p className="text-gray-500 mb-6">You haven't booked any services yet. Keep your car running smooth!</p>
            <button 
              onClick={() => navigate('/book')}
              className="px-8 py-3 bg-primary text-white font-bold justify-center rounded-btn hover:bg-primary/90 transition-colors"
            >
              Book First Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-card p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                
                {/* Left Col */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-400">ID: #{booking.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-primary mb-1">{booking.service?.name}</h3>
                  <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-600 font-medium">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-accent" /> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-accent" /> {booking.time_slot}</div>
                    <div className="flex items-center"><MapPin size={16} className="mr-2 text-accent" /> {booking.address}, {booking.city}</div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="w-full md:w-auto p-4 bg-background rounded-xl border border-gray-100 md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1 md:text-right">Total Price</p>
                    <p className="text-2xl font-black text-primary">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button className="mt-4 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-btn transition-colors">
                      Cancel
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
