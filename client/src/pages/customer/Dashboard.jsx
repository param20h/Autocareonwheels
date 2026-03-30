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

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-500/20 text-amber-200 border border-amber-400/30';
      case 'CONFIRMED': return 'bg-blue-500/20 text-blue-200 border border-blue-400/30';
      case 'IN_PROGRESS': return 'bg-violet-500/20 text-violet-200 border border-violet-400/30';
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-200 border border-red-400/30';
      default: return 'bg-white/10 text-gray-200 border border-white/15';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1317] via-[#131920] to-[#0f1317] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(192,57,43,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pt-28 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} /> Driver Console
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">My Service History</h1>
            <p className="text-gray-300">View and manage your upcoming and past bookings.</p>
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
          <div className="bg-white/5 backdrop-blur-md rounded-card p-12 text-center border border-white/10 shadow-sm">
            <Car size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-300 mb-6">You haven't booked any services yet. Keep your car running smooth!</p>
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
                className="bg-white/5 backdrop-blur-md rounded-card p-6 border border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-400">#{booking.id.toString().padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mb-1">{booking.service?.name}</h3>
                  <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-300 font-medium">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-accent" /> {new Date(booking.date).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-accent" /> {booking.time_slot}</div>
                    <div className="flex items-center"><MapPin size={16} className="mr-2 text-accent" /> {booking.address}, {booking.city}</div>
                  </div>
                </div>

                <div className="w-full md:w-auto p-4 bg-[#0f1317]/70 rounded-xl border border-white/10 md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">Total Price</p>
                    <p className="text-2xl font-black text-white">₹{parseFloat(booking.total_price).toLocaleString()}</p>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button onClick={() => handleCancel(booking.id)} className="mt-3 px-4 py-2 text-sm font-bold text-red-100 bg-red-600/35 hover:bg-red-600/45 rounded-btn transition-colors flex items-center space-x-1.5 border border-red-400/25">
                      <XCircle size={14} /><span>Cancel</span>
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
