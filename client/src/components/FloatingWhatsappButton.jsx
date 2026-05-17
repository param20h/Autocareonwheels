import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

const BUSINESS_PHONE = '61427563913'; // Format for wa.me link without the plus sign

const FloatingWhatsappButton = () => {
  const [dimmed, setDimmed] = useState(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Dim immediately when scrolling starts
      setDimmed(true);
      // Clear any existing timer
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      // Restore full opacity 1.5s after scrolling stops
      scrollTimer.current = setTimeout(() => setDimmed(false), 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${BUSINESS_PHONE}?text=Hi%20AutoCare%20on%20Wheels,%20I%20would%20like%20to%20book%20a%20service`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp us now"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group transition-all duration-500"
      style={{ opacity: dimmed ? 0.25 : 1 }}
    >
      {/* Circle button */}
      <span className="w-14 h-14 bg-green-500 hover:bg-green-400 active:scale-90 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 border-2 border-green-300 group-hover:rounded-r-none group-hover:rounded-l-2xl">
        {/* Ripple ring */}
        <span className="absolute w-14 h-14 rounded-full border-2 border-green-300 animate-ping opacity-40" />
        <MessageCircle size={24} className="text-white relative z-10" />
      </span>

      {/* Label — slides in on hover, hidden on mobile */}
      <span className="hidden sm:flex items-center bg-green-500 text-white text-sm font-bold px-4 py-3 rounded-r-2xl shadow-lg
        max-w-0 overflow-hidden group-hover:max-w-[200px] opacity-0 group-hover:opacity-100
        transition-all duration-300 whitespace-nowrap pl-2 border-l border-green-600">
        WhatsApp Us
      </span>
    </a>
  );
};

export default FloatingWhatsappButton;
