import React, { useEffect, useState } from 'react';
import { Wrench, Sparkles, Loader2, Calendar, Download, FilePlus2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import useAuth from '../../store/useAuth';
import bookingService from '../../services/booking.service';
import Toast from '../../components/Toast';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const loadStaffBookings = async () => {
      try {
        const { data } = await bookingService.getStaffBookings();
        setBookings(data.data || []);
      } catch (error) {
        setToast({ show: true, message: error.response?.data?.message || 'Failed to load bookings', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadStaffBookings();
  }, []);

  const handleCreateInvoice = async (id) => {
    try {
      await bookingService.createInvoice(id);
      setToast({ show: true, message: `Invoice ready for booking #${id}`, type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to create invoice', type: 'error' });
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const response = await bookingService.downloadInvoice(id);
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `booking-${id}-invoice.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to download invoice', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-white to-[#f6f7fb] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(192,57,43,0.11),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.1),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:30px_30px]" />

      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <main className="max-w-5xl mx-auto w-full px-6 pt-28 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/75 backdrop-blur-md rounded-card p-8 border border-slate-200/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Worker Console
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome, {user?.name || 'Worker'}</h1>
          <p className="text-slate-600 mb-8">Manage service bookings and generate invoices directly from your worker panel.</p>

          <div className="mt-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-white/70 flex items-center justify-between">
              <p className="font-bold inline-flex items-center gap-2"><Wrench size={16} /> Worker Job Board</p>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{bookings.length} jobs</span>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-accent" size={28} /></div>
            ) : bookings.length === 0 ? (
              <div className="py-10 text-center text-slate-500">No bookings available right now.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">#{String(booking.id).padStart(4, '0')} · {booking.service?.name || 'Service'}</p>
                      <p className="text-sm text-slate-600">{booking.user?.name || 'Customer'} · {booking.user?.phone || booking.user?.email || '-'}</p>
                      <p className="text-xs text-slate-500 inline-flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(booking.date).toLocaleDateString()} · {booking.time_slot}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCreateInvoice(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-full transition-colors"
                      >
                        <FilePlus2 size={13} /> Make Invoice
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors"
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
