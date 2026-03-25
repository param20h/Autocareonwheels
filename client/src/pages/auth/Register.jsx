import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Loader2, Car, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => { setLoading(false); alert('Registration successful! (mock)'); }, 1000);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log('Google Auth Token:', credentialResponse.credential);
      alert('Google Signup Successful (mock)');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-row items-center space-x-2 text-primary">
          <Car size={36} />
          <h2 className="text-center text-3xl font-extrabold text-primary">
            Create an Account
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-accent hover:text-primary transition-colors">
            Log in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-card sm:px-10">
          <form className="space-y-5" onSubmit={handleLocalSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                  className="focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2 border"
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
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                  className="focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2 border"
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
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  required
                  className="focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2 border"
                  placeholder="+91 9876543210"
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
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                  className="focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-input py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-btn shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 text-center w-full flex justify-center">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id-here.apps.googleusercontent.com'}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Signup Failed')}
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
