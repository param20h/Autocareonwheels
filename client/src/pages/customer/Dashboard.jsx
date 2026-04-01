import React, { useEffect, useState } from 'react';
import { Calendar, Car, MapPin, Clock, XCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
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

  const handleDeleteBooking = async (id) => {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setToast({ show: true, message: 'Booking deleted successfully', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to delete booking', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'IN_PROGRESS': return 'bg-violet-100 text-violet-700 border border-violet-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-white to-[#f6f7fb] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(192,57,43,0.11),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.1),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:30px_30px]" />
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pt-28 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} /> Driver Console
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Service History</h1>
            <p className="text-slate-600">View and manage your upcoming and past bookings.</p>
          </div>
          <button 
            onClick={() => navigate('/book')}
            className="px-6 py-3 bg-accent text-white rounded-btn font-bold shadow-[0_8px_28px_rgba(192,57,43,0.45)] hover:bg-accent/90 transition-colors"
          >
            + New Booking
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/75 backdrop-blur-md rounded-card p-12 text-center border border-slate-200/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <Car size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-600 mb-6">You haven't booked any services yet. Keep your car running smooth!</p>
            <button onClick={() => navigate('/book')} className="px-8 py-3 bg-primary text-white font-bold rounded-btn hover:bg-primary/90 transition-colors">
              Book First Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white/75 backdrop-blur-md rounded-card p-6 border border-slate-200/70 shadow-[0_20px_50px_rgba(15,23,42,0.07)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/90 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">#{booking.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1">{booking.service?.name}</h3>
                  <div className="flex flex-col space-y-2 mt-4 text-sm text-slate-600 font-medium">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-accent" /> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-accent" /> {booking.time_slot}</div>
                    <div className="flex items-center"><MapPin size={16} className="mr-2 text-accent" /> {booking.address}, {booking.city}</div>
                  </div>
                </div>

                <div className="w-full md:w-auto p-4 bg-white/80 rounded-xl border border-slate-200/80 md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                  <div>
                    <p className="text-xs text-slate-500 font-bold mb-1">Total Price</p>
                    <p className="text-2xl font-black text-slate-900">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button onClick={() => handleCancel(booking.id)} className="mt-3 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-btn transition-colors flex items-center space-x-1.5 border border-red-700/30 shadow-sm">
                      <XCircle size={14} /><span>Cancel</span>
                    </button>
                  )}
                  {['PENDING', 'CANCELLED', 'COMPLETED'].includes(booking.status) && (
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="mt-3 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-btn transition-colors border border-slate-300 shadow-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
};

export default CustomerDashboard;
