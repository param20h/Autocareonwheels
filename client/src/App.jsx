import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/customer/Home';
import Booking from './pages/customer/Booking';
import AuthCard from './pages/auth/Login';
import Dashboard from './pages/customer/Dashboard';
import Profile from './pages/customer/Profile';
import ServiceDetail from './pages/customer/ServiceDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
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
        <Route path="/services/:id" element={<ServiceDetail />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute requiredRole="CUSTOMER" />}>
          <Route path="/book" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected Worker Routes */}
        <Route element={<ProtectedRoute requiredRole="WORKER" />}>
          <Route path="/worker" element={<WorkerDashboard />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth/login" element={<AuthCard />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
