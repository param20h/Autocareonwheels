import React, { useState, useRef, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Loader2, User, Phone, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../store/useAuth';

const AuthCard = () => {
  const navigate = useNavigate();
  const { loginAction } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  // Refs to measure dynamic height of each form
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const [formHeight, setFormHeight] = useState(500);

  useEffect(() => {
    // Smoothly animate the container height based on which form is currently active
    if (isLogin && loginRef.current) {
      setFormHeight(loginRef.current.offsetHeight);
    } else if (!isLogin && registerRef.current) {
      setFormHeight(registerRef.current.offsetHeight);
    }
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        loginAction(data.data.user, data.data.token);
        if (data.data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        // Transition back to login smoothly
        setIsLogin(true); 
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      loginAction(data.data.user, data.data.token);
      if (data.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Google Auth failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">

      {/* Header Info */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md transform transition-transform duration-700 ease-out z-10">
        <div className="flex justify-center flex-row items-center space-x-2 text-primary">
          <Car size={36} />
          <h2 className="text-center text-3xl font-extrabold text-primary">
            {isLogin ? 'AutoCare Login' : 'Create an Account'}
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account yet? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="font-bold text-accent hover:text-primary transition-colors focus:outline-none"
          >
            {isLogin ? "Sign up here" : "Log in here"}
          </button>
        </p>
      </div>

      {/* Main Form Container with height animation mechanism */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div
          className="bg-white shadow sm:rounded-card relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ height: `${formHeight}px` }}
        >

          {/* ==================================== */}
          {/* LOGIN FORM (Left Panel)              */}
          {/* ==================================== */}
          <div
            ref={loginRef}
            className={`absolute top-0 w-full py-8 px-4 sm:px-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] 
              ${isLogin ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}
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
                  type="submit" disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-btn shadow-sm text-sm font-bold text-white bg-primary hover:bg-accent focus:outline-none transition-all disabled:opacity-50 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {loading && isLogin ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log in'}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 text-center w-full flex justify-center hover:shadow-md rounded-full transition-shadow">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id-here.apps.googleusercontent.com'}>
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} theme="outline" shape="pill" width="100%" />
                </GoogleOAuthProvider>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-primary transition-colors">Return to Home</Link>
            </div>
          </div>


          {/* ==================================== */}
          {/* REGISTER FORM (Right Panel)          */}
          {/* ==================================== */}
          <div
            ref={registerRef}
            className={`absolute top-0 w-full py-8 px-4 sm:px-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] 
              ${!isLogin ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}
          >
            <form className="space-y-4" onSubmit={handleLocalSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text" name="name" onChange={handleChange} required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2.5 border transition-colors outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel" name="phone" onChange={handleChange} required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2.5 border transition-colors outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Choose Password</label>
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

              <div className="pt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-btn shadow-sm text-sm font-bold text-white bg-primary hover:bg-accent focus:outline-none transition-all disabled:opacity-50 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {loading && !isLogin ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or register instantly</span>
                </div>
              </div>
              <div className="mt-6 text-center w-full flex justify-center hover:shadow-md rounded-full transition-shadow">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id-here.apps.googleusercontent.com'}>
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Signup Failed')} theme="outline" shape="pill" width="100%" />
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary opacity-[0.03] rounded-full blur-[100px] transition-transform duration-[1.5s] ease-in-out ${!isLogin ? 'translate-x-[150%] translate-y-[50%]' : 'translate-x-0'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent opacity-[0.04] rounded-full blur-[80px] transition-transform duration-[1.5s] ease-in-out ${!isLogin ? '-translate-x-[150%] -translate-y-[50%]' : 'translate-x-0'}`}></div>
      </div>

    </div>
  );
};

export default AuthCard;
