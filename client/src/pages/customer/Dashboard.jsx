import React, { useEffect, useState } from 'react';
import { LogOut, Calendar, Car, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      setToast({ show: true, message: 'Booking cancelled successfully', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to cancel', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border bg-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary mb-2">My Service History</h1>
            <p className="text-gray-500">View and manage your upcoming and past bookings.</p>
          </div>
          <button 
            onClick={() => navigate('/book')}
            className="px-6 py-3 bg-accent text-white rounded-btn font-bold shadow-md hover:bg-accent/90 transition-colors"
          >
            + New Booking
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-card p-12 text-center border border-gray-100 shadow-sm">
            <Car size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">You haven't booked any services yet. Keep your car running smooth!</p>
            <button onClick={() => navigate('/book')} className="px-8 py-3 bg-primary text-white font-bold rounded-btn hover:bg-primary/90 transition-colors">
              Book First Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-card p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-400">#{booking.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-primary mb-1">{booking.service?.name}</h3>
                  <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-600 font-medium">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-accent" /> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-accent" /> {booking.time_slot}</div>
                    <div className="flex items-center"><MapPin size={16} className="mr-2 text-accent" /> {booking.address}, {booking.city}</div>
                  </div>
                </div>

                <div className="w-full md:w-auto p-4 bg-background rounded-xl border border-gray-100 md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">Total Price</p>
                    <p className="text-2xl font-black text-primary">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button onClick={() => handleCancel(booking.id)} className="mt-3 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-btn transition-colors flex items-center space-x-1.5">
                      <XCircle size={14} /><span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
