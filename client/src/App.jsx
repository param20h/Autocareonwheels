import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/customer/Home';
import Booking from './pages/customer/Booking';
import AuthCard from './pages/auth/Login';
import Dashboard from './pages/customer/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './store/useAuth';

function App() {
  const checkAuth = useAuth(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute requiredRole="CUSTOMER" />}>
          <Route path="/book" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth/login" element={<AuthCard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
