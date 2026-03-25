import React, { useState } from 'react';
import { Wrench, Menu, X, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutAction();
    navigate('/');
    setMobileOpen(false);
  };

  const getDashboardPath = () => user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <Wrench size={32} className="text-accent" />
            <span className="font-extrabold text-2xl tracking-tight">AutoCare</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <a href="/#services" className="text-gray-600 hover:text-primary font-medium transition-colors">Services</a>
            <a href="/#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How it Works</a>
            <a href="/#testimonials" className="text-gray-600 hover:text-primary font-medium transition-colors">Reviews</a>
            <a href="/#contact" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact</a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="flex items-center text-gray-600 hover:text-primary font-semibold transition-colors space-x-1.5">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-primary font-semibold transition-colors space-x-1.5">
                  <UserCircle size={18} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-500 font-semibold transition-colors space-x-1.5">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-primary font-semibold hover:text-accent transition-colors">Log in</Link>
                <Link to="/book" className="bg-primary text-white px-6 py-2.5 rounded-btn font-semibold hover:bg-accent transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-700 p-2">
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-6 space-y-4">
            <a href="/#services" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-semibold hover:text-accent transition-colors">Services</a>
            <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-semibold hover:text-accent transition-colors">How it Works</a>
            <a href="/#testimonials" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-semibold hover:text-accent transition-colors">Reviews</a>
            <a href="/#contact" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-semibold hover:text-accent transition-colors">Contact</a>
            
            <hr className="border-gray-100" />

            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="block text-primary font-bold">Dashboard</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-primary font-bold">My Profile</Link>
                <button onClick={handleLogout} className="block text-red-500 font-bold">Logout</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="block text-primary font-bold">Log in</Link>
                <Link to="/book" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-primary text-white px-6 py-3 rounded-btn font-bold">Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
