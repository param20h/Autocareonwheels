import React from 'react';
import { Wrench, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench size={28} className="text-accent" />
              <span className="font-black text-xl text-white tracking-tight">AutoCare on wheels</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium at-home car maintenance and repair services. Trusted by thousands of vehicle owners across the city.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/autocareonwheels" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589617888050" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="mailto:info@autocareonwheels.com.au" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/book" className="hover:text-accent transition-colors">Book a Service</Link></li>

              <li><a href="/#services" className="hover:text-accent transition-colors">Our Services</a></li>
              <li><a href="/#how-it-works" className="hover:text-accent transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="hover:text-accent transition-colors cursor-default">Tyre Services</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">Cooling System Services</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">Basic Car AC Service</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">Brakes Service</span></li>
              <li><span className="hover:text-accent transition-colors cursor-default">Suspension & Steering Service</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <span>Canberra, ACT, Australia</span>
                  <div className="mt-1 flex space-x-2 text-xs">
                    <a href="https://maps.google.com/?q=Canberra,+Australia" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-white transition-colors">Google Maps</a>
                    <span className="text-gray-600">|</span>
                    <a href="http://maps.apple.com/?q=Canberra,+Australia" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-white transition-colors">Apple Maps</a>
                  </div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>
                  +61 427 563 913</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>info@autocareonwheels.com.au</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 AutoCare Professional Services. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
