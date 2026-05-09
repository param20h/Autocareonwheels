import React, { useState, useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';

const BUSINESS_PHONE = '0427563913';

const FloatingCallButton = () => {
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
      href={`tel:${BUSINESS_PHONE}`}
      aria-label="Call us now"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group transition-all duration-500"
      style={{ opacity: dimmed ? 0.25 : 1 }}
    >
      {/* Label — slides in on hover, hidden on mobile */}
      <span className="hidden sm:flex items-center bg-green-600 text-white text-sm font-bold px-4 py-3 rounded-l-2xl shadow-lg
        max-w-0 overflow-hidden group-hover:max-w-[200px] opacity-0 group-hover:opacity-100
        transition-all duration-300 whitespace-nowrap pr-2 border-r border-green-700">
        {BUSINESS_PHONE}
      </span>

      {/* Circle button */}
      <span className="w-14 h-14 bg-green-600 hover:bg-green-500 active:scale-90 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 border-2 border-green-400 group-hover:rounded-l-none group-hover:rounded-r-2xl">
        {/* Ripple ring */}
        <span className="absolute w-14 h-14 rounded-full border-2 border-green-400 animate-ping opacity-40" />
        <Phone size={22} className="text-white relative z-10" />
      </span>
    </a>
  );
};

export default FloatingCallButton;
