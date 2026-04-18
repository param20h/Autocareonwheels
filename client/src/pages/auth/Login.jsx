import React, { useEffect, useState } from 'react';
import { Mail, Lock, Loader2, Car } from 'lucide-react';
import MechanicBackground from '../../components/MechanicBackground';
import BorderGlow from '../../components/BorderGlow';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../store/useAuth';

const AuthCard = () => {
  const navigate = useNavigate();
  const { loginAction, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      if (data?.data?.user?.role !== 'ADMIN') {
        alert('Only admin can login from this page.');
        return;
      }

      loginAction(data.data.user, data.data.token);
      navigate('/admin', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <MechanicBackground />

      {/* Header Info */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md transform transition-transform duration-700 ease-out z-10">
        <div className="flex justify-center flex-row items-center space-x-2 text-primary">
          <Car size={36} />
          <h2 className="text-center text-3xl font-extrabold text-primary">
            Admin Login
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">Use your admin credentials to access dashboard controls.</p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <BorderGlow
          edgeSensitivity={35}
          glowColor="0 80 60"
          backgroundColor="#ffffff"
          borderRadius={24}
          glowRadius={64}
          glowIntensity={1.5}
          coneSpread={30}
          animated
          loop
          colors={['#c0392b', '#e74c3c', '#ff6b6b']}
        >
          <div
            className="bg-white rounded-[24px] relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] w-full"
            style={{ minHeight: '360px' }}
          >
          <div
            className="w-full py-8 px-4 sm:px-10"
          >
            <form className="space-y-6" onSubmit={handleLocalSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email" name="email" onChange={handleChange} required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2.5 border transition-colors outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password" name="password" onChange={handleChange} required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2.5 border transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-btn shadow-sm text-sm font-bold text-white bg-primary hover:bg-accent focus:outline-none transition-all disabled:opacity-50 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log in'}
                </button>
              </div>
            </form>

            <div className="mt-6 flex justify-center">
              <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors">Return to Home</Link>
            </div>
          </div>
          </div>
        </BorderGlow>
      </div>

      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary opacity-[0.03] rounded-full blur-[100px] transition-transform duration-[1.5s] ease-in-out translate-x-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent opacity-[0.04] rounded-full blur-[80px] transition-transform duration-[1.5s] ease-in-out translate-x-0"></div>
      </div>

    </div>
  );
};

export default AuthCard;
