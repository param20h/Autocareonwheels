import React from 'react';
import { Wrench, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <Wrench size={28} className="text-accent group-hover:rotate-45 transition-transform" />
              <span className="font-black text-xl text-white tracking-tight">AutoCare on wheels</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium mobile car servicing, mechanical repairs and tyre fitment across Canberra and Queanbeyan. We bring the workshop to your doorstep.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/autocareonwheels" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589617888050" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="mailto:info@autocareonwheels.com.au" aria-label="Email" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors font-medium">Contact Us</Link></li>
              <li><Link to="/book" className="hover:text-accent transition-colors">Book a Service</Link></li>
              <li><Link to="/services/car-services" className="hover:text-accent transition-colors">Car Services</Link></li>
              <li><Link to="/services/repairs" className="hover:text-accent transition-colors">Repairs</Link></li>
              <li><Link to="/services/tyres" className="hover:text-accent transition-colors">Tyre Supply &amp; Fitment</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Featured Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services/logbook-service-canberra" className="hover:text-accent transition-colors">Logbook Service</Link></li>
              <li><Link to="/services/yearly-service-canberra" className="hover:text-accent transition-colors">Yearly Service</Link></li>
              <li><Link to="/services/pre-purchase-inspection-canberra" className="hover:text-accent transition-colors">Pre-Purchase Inspection</Link></li>
              <li><Link to="/services/brakes-canberra" className="hover:text-accent transition-colors">Brakes Service</Link></li>
              <li><Link to="/services/car-battery-canberra" className="hover:text-accent transition-colors">Car Battery Replacement</Link></li>
              <li><Link to="/services/cooling-system" className="hover:text-accent transition-colors">Cooling System</Link></li>
              <li><Link to="/services/car-air-conditioning" className="hover:text-accent transition-colors">Car Air-Conditioning</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <span>10 Muntz St, Chisholm ACT 2905</span>
                  <div className="mt-1 flex space-x-2 text-xs">
                    <a href="https://maps.app.goo.gl/w3SQ7VsSin5gGsND6" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-white transition-colors">Google Maps</a>
                    <span className="text-gray-600">|</span>
                    <a href="http://maps.apple.com/?q=10+Muntz+St,+Chisholm+ACT+2905" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-white transition-colors">Apple Maps</a>
                  </div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <a href="tel:0427563913" className="hover:text-accent transition-colors font-medium">
                  +61 427 563 913
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <a href="mailto:info@autocareonwheels.com.au" className="hover:text-accent transition-colors break-all">
                  info@autocareonwheels.com.au
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 AutoCare on Wheels. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
