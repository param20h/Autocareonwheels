import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Megaphone, Calendar, Clock, Save, Loader2, Info, Power, AlertTriangle, Sparkles, Check, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessStatus, setBusinessStatus] = useState('OPEN');
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // New Holiday Form State
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'FULL_DAY',
    startHour: '09:00',
    endHour: '17:00'
  });

  // New Announcement Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'NOTICE',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/public');
      if (data.success && data.data) {
        setBusinessStatus(data.data.businessStatus || 'OPEN');
        setAnnouncements(data.data.announcements || []);
        setHolidays(data.data.holidays || []);
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedStatus, updatedAnnouncements, updatedHolidays) => {
    setSaving(true);
    try {
      const payload = {
        businessStatus: updatedStatus !== undefined ? updatedStatus : businessStatus,
        announcements: updatedAnnouncements !== undefined ? updatedAnnouncements : announcements,
        holidays: updatedHolidays !== undefined ? updatedHolidays : holidays
      };

      const { data } = await api.post('/settings', payload);
      if (data.success) {
        setToast({ show: true, message: 'Settings saved successfully!', type: 'success' });
        // Refresh local state with server response just in case
        setBusinessStatus(data.data.businessStatus);
        setAnnouncements(data.data.announcements);
        setHolidays(data.data.holidays);
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBusinessStatus = () => {
    const nextStatus = businessStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    setBusinessStatus(nextStatus);
    handleSaveAll(nextStatus, announcements, holidays);
  };

  // HOLIDAYS
  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) {
      setToast({ show: true, message: 'Please fill in holiday name and date', type: 'error' });
      return;
    }

    const holidayItem = {
      id: Date.now().toString(),
      name: newHoliday.name,
      date: newHoliday.date,
      type: newHoliday.type,
      startHour: newHoliday.type === 'CUSTOM_HOURS' ? newHoliday.startHour : null,
      endHour: newHoliday.type === 'CUSTOM_HOURS' ? newHoliday.endHour : null
    };

    // Prevent duplicates
    if (holidays.some(h => h.date === newHoliday.date)) {
      setToast({ show: true, message: 'A closure or holiday is already set for this date', type: 'error' });
      return;
    }

    const updatedHolidays = [...holidays, holidayItem].sort((a, b) => new Date(a.date) - new Date(b.date));
    setHolidays(updatedHolidays);
    handleSaveAll(businessStatus, announcements, updatedHolidays);

    // Reset Form
    setNewHoliday({
      name: '',
      date: '',
      type: 'FULL_DAY',
      startHour: '09:00',
      endHour: '17:00'
    });
  };

  const handleDeleteHoliday = (id) => {
    const updatedHolidays = holidays.filter(h => h.id !== id);
    setHolidays(updatedHolidays);
    handleSaveAll(businessStatus, announcements, updatedHolidays);
  };

  // ANNOUNCEMENTS
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.startDate || !newAnnouncement.endDate) {
      setToast({ show: true, message: 'All announcement fields are required', type: 'error' });
      return;
    }

    if (new Date(newAnnouncement.startDate) > new Date(newAnnouncement.endDate)) {
      setToast({ show: true, message: 'Start date cannot be after end date', type: 'error' });
      return;
    }

    const bannerItem = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type,
      startDate: newAnnouncement.startDate,
      endDate: newAnnouncement.endDate,
      isActive: newAnnouncement.isActive
    };

    const updatedAnnouncements = [bannerItem, ...announcements];
    setAnnouncements(updatedAnnouncements);
    handleSaveAll(businessStatus, updatedAnnouncements, holidays);

    // Reset Form
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'NOTICE',
      startDate: '',
      endDate: '',
      isActive: true
    });
  };

  const handleDeleteAnnouncement = (id) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    setAnnouncements(updatedAnnouncements);
    handleSaveAll(businessStatus, updatedAnnouncements, holidays);
  };

  const handleToggleAnnouncementActive = (id) => {
    const updatedAnnouncements = announcements.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    setAnnouncements(updatedAnnouncements);
    handleSaveAll(businessStatus, updatedAnnouncements, holidays);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 bg-white/70 backdrop-blur-md rounded-card border border-white/80">
        <Loader2 className="animate-spin text-accent" size={40} />
        <span className="ml-3 font-bold text-gray-700">Loading system settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      {/* Row 1: Business status card */}
      <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
              <Power className={businessStatus === 'OPEN' ? 'text-green-500' : 'text-red-500'} size={22} />
              Business Operations Status
            </h2>
            <p className="text-gray-500 text-sm max-w-xl">
              Quickly toggle the primary business status. Setting this to Closed will display a notification badge on the client site and block any new bookings.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/90 border border-gray-100 p-4 rounded-card shadow-inner">
            <span className={`text-base font-black px-4 py-2 rounded-full tracking-wider transition-colors ${
              businessStatus === 'OPEN' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {businessStatus === 'OPEN' ? '🟢 ONLINE & OPEN' : '🔴 CLOSED / HOLIDAY'}
            </span>
            <button
              onClick={handleToggleBusinessStatus}
              disabled={saving}
              className={`px-5 py-2.5 rounded-btn font-extrabold text-sm shadow-md transition-all flex items-center gap-2 ${
                businessStatus === 'OPEN'
                  ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-200'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200'
              }`}
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : null}
              {businessStatus === 'OPEN' ? 'Close Business' : 'Open Business'}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Holidays & Closed Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Add Closure Date Form */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 p-6">
          <h3 className="text-lg font-extrabold text-primary mb-4 flex items-center gap-2">
            <Calendar className="text-accent" size={18} />
            Add Closure Date / Holiday
          </h3>
          <form onSubmit={handleAddHoliday} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Holiday/Closure Name</label>
              <input
                type="text"
                value={newHoliday.name}
                onChange={e => setNewHoliday({...newHoliday, name: e.target.value})}
                placeholder="e.g. Christmas Day, System Upgrade"
                className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={e => setNewHoliday({...newHoliday, date: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Closure Duration</label>
                <select
                  value={newHoliday.type}
                  onChange={e => setNewHoliday({...newHoliday, type: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                >
                  <option value="FULL_DAY">Full Day Closed</option>
                  <option value="CUSTOM_HOURS">Custom Closed Hours</option>
                </select>
              </div>
            </div>

            {newHoliday.type === 'CUSTOM_HOURS' && (
              <div className="grid grid-cols-2 gap-4 bg-accent/5 p-3.5 border border-accent/10 rounded-card animate-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Closed From</label>
                  <input
                    type="time"
                    value={newHoliday.startHour}
                    onChange={e => setNewHoliday({...newHoliday, startHour: e.target.value})}
                    className="w-full border border-gray-300 bg-white text-primary rounded-input px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">Closed Until</label>
                  <input
                    type="time"
                    value={newHoliday.endHour}
                    onChange={e => setNewHoliday({...newHoliday, endHour: e.target.value})}
                    className="w-full border border-gray-300 bg-white text-primary rounded-input px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white py-3 rounded-btn font-extrabold text-sm hover:bg-accent transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add & Update Closure
            </button>
          </form>
        </div>

        {/* Right column: Closures List */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-primary mb-4 flex items-center gap-2">
              <Calendar className="text-gray-400" size={18} />
              Scheduled Closures & Public Holidays
            </h3>
            {holidays.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm bg-white/50 border border-dashed border-gray-200 rounded-card">
                No closure dates scheduled. Bookings will proceed under default hours.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {holidays.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-card shadow-sm hover:border-gray-200 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary">{h.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          h.type === 'FULL_DAY' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {h.type === 'FULL_DAY' ? 'Full Day Closed' : `Closed ${h.startHour} - ${h.endHour}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} />
                        <span>{new Date(h.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHoliday(h.id)}
                      disabled={saving}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Remove Holiday"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-white/50 p-3 rounded-card border border-gray-100">
            <Info size={14} className="text-gray-400 shrink-0" />
            <span>Dates added here will be automatically disabled in the customer booking calendar.</span>
          </div>
        </div>
      </div>

      {/* Row 3: Announcement Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Add Announcement Form */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 p-6">
          <h3 className="text-lg font-extrabold text-primary mb-4 flex items-center gap-2">
            <Megaphone className="text-accent" size={18} />
            Publish Banner / Announcement
          </h3>
          <form onSubmit={handleAddAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Banner Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                placeholder="e.g. Easter Holiday Notice"
                className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Message Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                rows="2"
                placeholder="e.g. We will be closed from Friday to Monday. Bookings resume Tuesday!"
                className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Banner Type</label>
                <select
                  value={newAnnouncement.type}
                  onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                >
                  <option value="NOTICE">Notice (Red Alert)</option>
                  <option value="PROMOTION">Promotion (Blue Glow)</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.isActive}
                    onChange={e => setNewAnnouncement({...newAnnouncement, isActive: e.target.checked})}
                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                  <span>Active immediately</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newAnnouncement.startDate}
                  onChange={e => setNewAnnouncement({...newAnnouncement, startDate: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={newAnnouncement.endDate}
                  onChange={e => setNewAnnouncement({...newAnnouncement, endDate: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-white py-3 rounded-btn font-extrabold text-sm hover:bg-accent transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Megaphone size={16} /> Publish Announcement
            </button>
          </form>
        </div>

        {/* Right column: Announcements List */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-primary mb-4 flex items-center gap-2">
              <Megaphone className="text-gray-400" size={18} />
              Active and Scheduled Banners
            </h3>
            {announcements.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm bg-white/50 border border-dashed border-gray-200 rounded-card">
                No announcement banners configured. Customers will not see any header alert.
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {announcements.map(ann => {
                  const now = new Date();
                  const start = new Date(ann.startDate);
                  const end = new Date(ann.endDate);
                  // Normalize dates to start of day for check
                  now.setHours(0,0,0,0);
                  start.setHours(0,0,0,0);
                  end.setHours(23,59,59,999);
                  const isScheduled = now < start;
                  const isExpired = now > end;
                  const isLive = ann.isActive && !isScheduled && !isExpired;

                  return (
                    <div key={ann.id} className="p-4 bg-white border border-gray-100 rounded-card shadow-sm hover:border-gray-200 transition-all flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-sm text-primary">{ann.title}</span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            ann.type === 'NOTICE' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ann.type === 'NOTICE' ? 'Notice' : 'Promo'}
                          </span>
                          
                          {/* Live / Expired / Scheduled badge */}
                          {isLive && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-0.5">
                              <Sparkles size={8} /> LIVE
                            </span>
                          )}
                          {isScheduled && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              SCHEDULED
                            </span>
                          )}
                          {isExpired && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              EXPIRED
                            </span>
                          )}
                          {!ann.isActive && !isExpired && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                              PAUSED
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-xs line-clamp-2">{ann.content}</p>

                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={10} />
                          <span>Visible: {new Date(ann.startDate).toLocaleDateString()} to {new Date(ann.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end sm:justify-start">
                        <button
                          onClick={() => handleToggleAnnouncementActive(ann.id)}
                          disabled={saving}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-full border transition-all ${
                            ann.isActive 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {ann.isActive ? 'Active' : 'Paused'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          disabled={saving}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                          title="Remove Announcement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-white/50 p-3 rounded-card border border-gray-100">
            <Info size={14} className="text-gray-400 shrink-0" />
            <span>Banners automatically render at the top of the customer-facing site during scheduled date ranges.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
