import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../store/useAuth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  const getDefaultRouteByRole = (role) => {
    if (role === 'ADMIN') return '/admin';
    return '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && !(requiredRole === 'CUSTOMER' && user?.role === 'ADMIN')) {
    return <Navigate to={getDefaultRouteByRole(user?.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
