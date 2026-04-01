import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Home, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import useAuth from '../../store/useAuth';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { logoutAction, user } = useAuth();

  const handleLogout = () => {
    logoutAction();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-white to-[#f6f7fb] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(192,57,43,0.11),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.1),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:30px_30px]" />

      <Navbar />

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
          <p className="text-slate-600 mb-8">Your worker account is active. You can access your assigned tools from this dashboard.</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold transition-colors"
            >
              <Home size={16} /> Home
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            <p className="font-bold mb-1 inline-flex items-center gap-2"><Wrench size={16} /> Worker access enabled</p>
            <p className="text-sm text-slate-600">If you want worker-specific booking actions (assigned jobs, status updates), I can add a full worker jobs panel next.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
