import { create } from 'zustand';
import api from '../api/axios';

const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true, // Used for initial hydration
  
  loginAction: (userData, token) => {
    localStorage.setItem('token', token);
    set({ user: userData, token, isAuthenticated: true });
  },
  
  logoutAction: () => {
    console.log("logoutAction triggered");
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return set({ isAuthenticated: false, isLoading: false });
    
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Hydration failed");
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

// Listen globally for 401 unauth errors from interceptor to log out gracefully
if (typeof window !== 'undefined') {
  window.addEventListener('unauthorized_err', () => {
    useAuth.getState().logoutAction();
  });
}

export default useAuth;
