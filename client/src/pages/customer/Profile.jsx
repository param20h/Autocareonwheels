import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';

const Profile = () => {
  const { user, loginAction } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      loginAction(data.data, localStorage.getItem('token'));
      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setToast({ show: true, message: 'Password changed successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to change password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1317] via-[#131920] to-[#0f1317] flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(192,57,43,0.18),transparent_38%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={13} /> Account Settings
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">My Profile</h1>
        <p className="text-gray-300 mb-8">Manage your personal information and security settings.</p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-card p-8 shadow-sm border border-white/10 mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-white/5 text-white rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  disabled
                  className="w-full border border-white/10 rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white/10 text-gray-200"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute top-3.5 left-3 text-gray-400" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  className="w-full border border-white/10 bg-white/5 text-white rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-btn font-bold hover:bg-accent transition-all disabled:opacity-50 shadow-[0_8px_24px_rgba(192,57,43,0.35)]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Save Changes</span>
            </button>
          </form>
        </motion.div>

        {user?.password !== null && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white/5 backdrop-blur-md rounded-card p-8 shadow-sm border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-6">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-white/10 bg-white/5 text-white rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">New Password</label>
                  <input
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-white/10 bg-white/5 text-white rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1.5">Confirm New</label>
                  <input
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-white/10 bg-white/5 text-white rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-white/10 border border-white/10 text-white px-6 py-3 rounded-btn font-bold hover:bg-white/20 transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                <span>Update Password</span>
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Profile;
