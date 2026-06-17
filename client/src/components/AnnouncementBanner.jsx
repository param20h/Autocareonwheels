import React, { useEffect, useState } from 'react';
import { Megaphone, X, Sparkles, AlertCircle } from 'lucide-react';

const AnnouncementBanner = ({ announcements = [] }) => {
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!announcements || announcements.length === 0) {
      setActiveAnnouncement(null);
      return;
    }

    const now = new Date();
    // Normalize date for range check
    now.setHours(0, 0, 0, 0);

    const parseLocalDate = (dateStr) => {
      if (!dateStr) return new Date();
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    // Filter active banners
    const activeBanners = announcements.filter(banner => {
      if (!banner.isActive) return false;
      const start = parseLocalDate(banner.startDate);
      const end = parseLocalDate(banner.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return now >= start && now <= end;
    });

    if (activeBanners.length === 0) {
      setActiveAnnouncement(null);
      return;
    }

    // Prioritize NOTICE type over PROMOTION type
    const notices = activeBanners.filter(b => b.type === 'NOTICE');
    const promos = activeBanners.filter(b => b.type === 'PROMOTION');

    const selectedBanner = notices.length > 0 ? notices[0] : promos[0];
    
    // Check if this banner has been dismissed in the current session
    const isDismissed = sessionStorage.getItem(`dismissed_banner_${selectedBanner.id}`);
    if (isDismissed) {
      setDismissed(true);
    } else {
      setDismissed(false);
      setActiveAnnouncement(selectedBanner);
    }
  }, [announcements]);

  const handleDismiss = () => {
    if (activeAnnouncement) {
      sessionStorage.setItem(`dismissed_banner_${activeAnnouncement.id}`, 'true');
      setDismissed(true);
    }
  };

  if (!activeAnnouncement || dismissed) return null;

  const isNotice = activeAnnouncement.type === 'NOTICE';

  return (
    <div className={`relative w-full z-[60] flex items-center justify-center py-2.5 px-8 text-center text-xs font-bold transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] ${
      isNotice 
        ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-red-100 border-b border-red-800/50' 
        : 'bg-gradient-to-r from-[#1a2e40] via-[#24405c] to-[#1a2e40] text-blue-100 border-b border-blue-900/50'
    }`}>
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none animate-pulse" />
      
      <div className="flex items-center gap-2 justify-center max-w-5xl mx-auto flex-wrap relative z-10">
        {isNotice ? (
          <AlertCircle size={14} className="text-red-400 shrink-0 animate-bounce" />
        ) : (
          <Sparkles size={14} className="text-blue-400 shrink-0 animate-pulse" />
        )}
        <span className="uppercase tracking-widest text-[10px] font-black border border-white/20 px-1.5 py-0.5 rounded mr-1">
          {isNotice ? 'Notice' : 'Special'}
        </span>
        <span className="font-extrabold tracking-wide">{activeAnnouncement.title}:</span>
        <span className="font-semibold opacity-90">{activeAnnouncement.content}</span>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-75 transition-opacity text-white/70 hover:text-white"
        aria-label="Dismiss Banner"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
