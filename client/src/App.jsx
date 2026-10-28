import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/customer/Home';
import Booking from './pages/customer/Booking';
import AuthCard from './pages/auth/Login';
import Dashboard from './pages/customer/Dashboard';
import Profile from './pages/customer/Profile';
import Contact from './pages/customer/Contact';
import ServiceDetail from './pages/customer/ServiceDetail';
import ServicePage from './pages/customer/ServicePage';
import ServiceCategoryPage from './pages/customer/ServiceCategoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import useAuth from './store/useAuth';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Dynamic dispatcher for /services/:slug
const ServiceDispatcher = () => {
  const { slug } = useParams();

  // If slug is a known category, render ServiceCategoryPage
  if (['tyres', 'car-services', 'repairs'].includes(slug)) {
    return <ServiceCategoryPage categoryName={slug} />;
  }

  // If numeric ID, render legacy ServiceDetail
  if (/^\d+$/.test(slug)) {
    return <ServiceDetail />;
  }

  // Otherwise render rich SEO service page
  return <ServicePage />;
};

// 301 client redirect for legacy category URLs
const CategoryRedirect = () => {
  const { categoryName } = useParams();
  return <Navigate to={`/services/${categoryName}`} replace />;
};

function App() {
  const checkAuth = useAuth(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Simplified SEO Category Pages */}
        <Route path="/services/tyres" element={<ServiceCategoryPage categoryName="tyres" />} />
        <Route path="/services/car-services" element={<ServiceCategoryPage categoryName="car-services" />} />
        <Route path="/services/repairs" element={<ServiceCategoryPage categoryName="repairs" />} />

        {/* 301 Redirect for legacy /services/category/:categoryName */}
        <Route path="/services/category/:categoryName" element={<CategoryRedirect />} />

        {/* Individual Service Pages & Dispatcher */}
        <Route path="/services/:slug" element={<ServiceDispatcher />} />

        {/* Contact Us Page */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

        {/* Booking */}
        <Route path="/book" element={<Booking />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute requiredRole="CUSTOMER" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<AuthCard />} />
        <Route path="/auth/login" element={<Navigate to="/login" replace />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <PWAInstallPrompt />
    </BrowserRouter>
  );
}

export default App;
