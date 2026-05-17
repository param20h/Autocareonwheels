import React, { useState } from 'react';
import { Wrench, Menu, X, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';
import FloatingCallButton from './FloatingCallButton';
import FloatingWhatsappButton from './FloatingWhatsappButton';
const Navbar = () => {
  const { isAuthenticated, user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutAction();
    navigate('/');
    setMobileOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    return '/dashboard';
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-primary/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="AutoCare on Wheels Logo" className="h-24 w-auto object-contain scale-[1.4] transform origin-left transition-transform hover:scale-[1.45]" />
            </Link>

            {/* Main Desktop Links */}
            <div className="hidden lg:flex items-center space-x-6 ml-auto">
              <Link to="/services/category/car-services" className="text-sm font-bold text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all uppercase tracking-wider">Car Services</Link>
              <Link to="/services/category/repairs" className="text-sm font-bold text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all uppercase tracking-wider">Repairs</Link>
              <Link to="/services/category/tyres" className="text-sm font-bold text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all uppercase tracking-wider">Tyres</Link>

              <a href="/#contact" className="text-sm font-bold text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all">Contact</a>

              {isAuthenticated ? (
                <span className="flex items-center space-x-4 border-l border-gray-700 pl-6">
                  <Link to={getDashboardPath()} className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-bold hover:-translate-y-0.5 transition-all">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-300 hover:text-red-400 text-sm font-bold hover:-translate-y-0.5 transition-all">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </span>
              ) : (
                <Link to="/book" className="ml-4 bg-accent text-white text-sm font-bold px-6 py-2 rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all border border-red-700">
                  Book Now
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-silver p-2 hover:text-white">
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-primary border-t border-gray-800 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="px-6 py-6 space-y-4">
              <Link to="/services/category/car-services" onClick={() => setMobileOpen(false)} className="block text-silver font-semibold hover:text-white transition-colors">Car Services</Link>
              <Link to="/services/category/repairs" onClick={() => setMobileOpen(false)} className="block text-silver font-semibold hover:text-white transition-colors">Repairs</Link>
              <Link to="/services/category/tyres" onClick={() => setMobileOpen(false)} className="block text-silver font-semibold hover:text-white transition-colors">Tyres</Link>

              <a href="/#contact" onClick={() => setMobileOpen(false)} className="block text-silver font-semibold hover:text-white transition-colors">Contact</a>

              <hr className="border-gray-800" />

              {isAuthenticated ? (
                <>
                  <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="block text-white font-bold">Dashboard</Link>
                  <button onClick={handleLogout} className="block text-accent font-bold mt-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/book" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-accent text-white px-6 py-3 rounded-btn font-bold">Book Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <FloatingCallButton />
      <FloatingWhatsappButton />
    </>);
};

export default Navbar;
