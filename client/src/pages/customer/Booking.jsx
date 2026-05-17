import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Loader2, Plus, Check, AlertCircle, Phone } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import useAuth from '../../store/useAuth';

const AUSTRALIA_CITIES = ['Canberra', 'Queanbeyan'];
const AUSTRALIA_STATES = ['New South Wales', 'Australian Capital Territory (ACT)'];
const BUSINESS_PHONE = '0427563913';

const isTyreService = (service) => {
  if (!service) return false;
  const name = (service.name || '').toLowerCase();
  return name.includes('tyre') || name.includes('tire') || name.includes('flat') || name.includes('wheel');
};

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  // Allow tyre page to jump directly to step 2 via ?step=2
  const initialStep = Math.max(1, Math.min(6, parseInt(searchParams.get('step') || '1', 10)));
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    // Vehicle
    vehicleNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    // Tyre size (only for tyre services)
    tyreWidth: '',
    tyreProfile: '',
    tyreRim: '',
    // Location + guest
    address: '', city: '', state: '', pincode: '',
    guestName: '', guestEmail: '', guestPhone: '',
    // Booking
    service: null, selectedAddons: [], date: '', timeSlot: '', repairIssue: '',
  });

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null); // 'success' | 'error' | null
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const TOTAL_STEPS = 7;

  useEffect(() => {
    document.title = 'Book a Mobile Mechanic | AutoCare on Wheels — Canberra & Queanbeyan';
    const fetchServices = async () => {
      let list = [];
      try {
        const { data } = await api.get('/services');
        list = data?.data || [];
      } catch { /* fallback below */ }
      
      if (list.length === 0) {
        list = [
          {
            id: '1', name: 'Logbook Service',
            description: 'The convenient way to maintain your new car warranty.',
            addons: [
              { id: 101, name: 'Air Filter Replacement' },
              { id: 102, name: 'Cabin Filter Replacement' },
              { id: 103, name: 'Fuel System Treatment' },
              { id: 104, name: 'Tyre Rotation (All 4)' },
            ]
          },
          {
            id: '3', name: 'Car Battery',
            description: 'Every AutoCare van stocks the highest quality battery brands.',
            addons: [
              { id: 301, name: 'Battery Terminal Protector Spray' },
              { id: 302, name: 'Charging System Test' },
              { id: 303, name: 'Battery Health Report' },
            ]
          },
          {
            id: '4', name: 'Brakes',
            description: 'Quality brake repairs to keep you safe on the road.',
            addons: [
              { id: 401, name: 'Brake Fluid Flush' },
              { id: 402, name: 'Brake Caliper Clean & Lubricate' },
              { id: 403, name: 'Rotor Inspection Report' },
              { id: 404, name: 'Handbrake Adjustment' },
            ]
          },
          {
            id: '5', name: 'Flat Tyre Service',
            description: 'Puncture repair and professional tyre fitment!',
            addons: [
              { id: 501, name: 'Emergency Spare Fitting' },
              { id: 502, name: 'Tyre Pressure Check (All 4 Tyres)' },
              { id: 503, name: 'Wheel Alignment Check' },
              { id: 504, name: 'Tyre Sealant Application' },
            ]
          }
        ];
      }

      // Filter out unwanted services from both API and fallback
      list = list.filter(s => !['Ultimate Service', 'Yearly Service', 'Yearly Car Service'].includes(s.name));

      // Inject Basic Service if missing
      if (!list.find(s => s.name === 'Basic Service')) {
        list.push({
          id: 'basic-service', name: 'Basic Service',
          description: 'Essential maintenance to keep your car running smoothly.',
          addons: [
            { id: 701, name: 'Wiper Blade Replacement' },
            { id: 702, name: 'Battery Health Check & Report' },
            { id: 703, name: 'Tyre Pressure & Tread Check' },
          ]
        });
      }

      // Inject Roadside Assistance & Repair if missing
      if (!list.find(s => s.name === 'Roadside Assistance & Repair')) {
        list.push({
          id: 'roadside-repair', name: 'Roadside Assistance & Repair',
          description: 'Battery jump-start, emergency fuel, flat tyre change, diagnostics, and minor roadside repairs.',
          addons: []
        });
      }

      setServices(list);

      // Pre-select service from URL param ?service=id
      const preId = searchParams.get('service');
      if (preId) {
        const found = list.find(s => String(s.id) === String(preId));
        if (found) {
          // Also pre-fill tyre size from URL params (tw=width, tp=profile, tr=rim)
          const tw = searchParams.get('tw') || '';
          const tp = searchParams.get('tp') || '';
          const tr = searchParams.get('tr') || '';
          setFormData(prev => ({ ...prev, service: found, tyreWidth: tw, tyreProfile: tp, tyreRim: tr }));
        }
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, [isAuthenticated, searchParams]);


  // ---- GPS Location Detection ----
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setToast({ show: true, message: 'Geolocation is not supported by your browser.', type: 'error' });
      return;
    }
    setDetectingLocation(true);
    setLocationStatus(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Free reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const geo = await res.json();
          const addr = geo.address || {};
          const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
          const suburb = addr.suburb || addr.neighbourhood || addr.town || '';
          const fullAddress = [street, suburb].filter(Boolean).join(', ');
          const city = addr.city || addr.town || addr.village || addr.suburb || '';
          const state = addr.state || '';
          const postcode = (addr.postcode || '').slice(0, 4);
          setFormData(prev => ({
            ...prev,
            address: fullAddress || prev.address,
            city: AUSTRALIA_CITIES.find(c => city.toLowerCase().includes(c.toLowerCase())) || prev.city,
            state: AUSTRALIA_STATES.find(s => state.toLowerCase().includes(s.split(' ')[0].toLowerCase())) || prev.state,
            pincode: postcode || prev.pincode,
          }));
          setLocationStatus('success');
          setToast({ show: true, message: 'Location detected and filled in!', type: 'success' });
        } catch {
          setLocationStatus('error');
          setToast({ show: true, message: 'Could not reverse geocode your location. Please fill in manually.', type: 'error' });
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        setLocationStatus('error');
        const msg = err.code === 1 ? 'Location permission denied. Please allow access and try again.'
          : 'Could not get your location. Please fill in manually.';
        setToast({ show: true, message: msg, type: 'error' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleAddon = (addon) => {
    const exists = formData.selectedAddons.find(a => a.id === addon.id);
    setFormData({ ...formData, selectedAddons: exists ? formData.selectedAddons.filter(a => a.id !== addon.id) : [...formData.selectedAddons, addon] });
  };

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    const tyreSizeStr = isTyreService(formData.service) && formData.tyreWidth && formData.tyreProfile && formData.tyreRim
      ? `${formData.tyreWidth}/${formData.tyreProfile} R${formData.tyreRim}`
      : undefined;
    try {
      await api.post('/bookings', {
        service_id: formData.service.id,
        address: formData.address, city: formData.city || 'Local', state: formData.state, pincode: formData.pincode,
        date: formData.date, time_slot: formData.timeSlot, total_price: 0,
        guest_name: formData.guestName, guest_email: formData.guestEmail, guest_phone: formData.guestPhone,
        vehicle_number: formData.vehicleNumber,
        vehicle_model: [formData.vehicleMake, formData.vehicleModel, formData.vehicleYear].filter(Boolean).join(' '),
        tyre_size: tyreSizeStr,
        notes: formData.repairIssue || undefined,
        addons: formData.selectedAddons.map(a => ({ id: a.id, price: 0 }))
      });
      setToast({ show: true, message: 'Booking confirmed! Redirecting...', type: 'success' });
      setTimeout(() => navigate(isAuthenticated ? '/dashboard' : '/'), 1500);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Booking failed', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const canProceed = () => {
    if (step === 1) {
      if (!formData.service) return false;
      if (formData.service.name === 'Roadside Assistance & Repair') {
        return !!formData.repairIssue?.trim();
      }
      return true;
    }
    if (step === 2) {
      if (isTyreService(formData.service)) return !!formData.tyreWidth && !!formData.tyreProfile && !!formData.tyreRim;
      return !!formData.vehicleNumber && !!formData.vehicleModel;
    }
    if (step === 3) {
      const hasMeta = !!formData.city && !!formData.state && /^\d{4}$/.test(formData.pincode);
      const hasAddr = !!formData.address;
      return hasAddr && hasMeta;
    }
    if (step === 4) {
      if (isAuthenticated) return true; // logged-in users skip this step
      return !!formData.guestName && !!formData.guestEmail && !!formData.guestPhone;
    }
    if (step === 5) return true;
    if (step === 6) return !!formData.date && !!formData.timeSlot;
    return true;
  };

  // Auto-skip Step 4 for authenticated users
  const nextStep = () => {
    const next = Math.min(step + 1, TOTAL_STEPS);
    if (next === 4 && isAuthenticated) {
      setStep(5); // skip guest details
    } else {
      setStep(next);
    }
  };
  const prevStep = () => {
    const prev = Math.max(step - 1, 1);
    if (prev === 4 && isAuthenticated) {
      setStep(3); // skip guest details going backwards too
    } else {
      setStep(prev);
    }
  };

  const stepLabels = ['Service', 'Vehicle', 'Location', 'Your Details', 'Add-ons', 'Schedule', 'Confirm'];
  const inputCls = 'w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none';

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20">

        {/* Call Now Banner */}
        <a href={`tel:${BUSINESS_PHONE}`}
          className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 px-6 rounded-2xl mb-6 transition-all shadow-lg">
          <Phone size={20} className="animate-pulse" />
          <span>Call Now — {BUSINESS_PHONE}</span>
          <span className="text-green-200 text-xs font-normal hidden sm:inline">Speak to a mechanic directly</span>
        </a>

        {/* Progress */}
        <div className="mb-10 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />
          <div className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }} />
          {stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isActive ? 'bg-primary text-white ring-2 ring-primary' : isCompleted ? 'bg-accent text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                </div>
                <span className={`mt-2 text-xs font-semibold ${isActive || isCompleted ? 'text-primary' : 'text-gray-400'} hidden sm:block`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* ===== STEP 1: SERVICE ===== */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Select a Service</h2>
            <p className="text-gray-500 mb-6">Choose what you need done — we'll handle the rest.</p>

            {loadingServices ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : (
              <div className="space-y-3">
                {services.map(service => {
                  const selected = formData.service?.id === service.id;
                  const isTyre = isTyreService(service);
                  return (
                    <label key={service.id} className={`block p-4 sm:p-5 border-2 rounded-card cursor-pointer transition-all ${selected ? 'border-accent bg-red-50/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-start justify-between pointer-events-none">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-primary text-lg">{service.name}</span>
                            {isTyre && <span className="text-xs bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">🛞 Tyre</span>}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{service.description?.substring(0, 90)}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-1 ml-4 flex items-center justify-center ${selected ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                      {/* Tyre notice */}
                      {selected && isTyre && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-700">
                            <span className="font-bold">Have your tyre size ready</span> — e.g. <span className="font-mono font-bold">205/55 R16</span>. You can find it on your tyre sidewall or in your car's manual.{' '}
                            <Link to="/services/category/tyres" className="underline font-bold">Check our tyre brands →</Link>
                          </div>
                        </div>
                      )}
                      {/* Repair Issue Textarea */}
                      {selected && service.name === 'Roadside Assistance & Repair' && (
                        <div className="mt-4">
                          <label className="block text-sm font-bold text-accent mb-2">Please describe what needs repairing or your symptoms:</label>
                          <textarea
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none transition-colors text-sm"
                            rows="3"
                            placeholder="e.g. My battery is completely flat, car won't start..."
                            value={formData.repairIssue || ''}
                            onChange={(e) => setFormData({ ...formData, repairIssue: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      <input type="radio" name="service" className="hidden"
                        onChange={() => setFormData({ ...formData, service, selectedAddons: [] })}
                        checked={selected} />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== STEP 2: VEHICLE / TYRE SIZE ===== */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isTyreService(formData.service) ? (
              <>
                <h2 className="text-3xl font-extrabold text-primary mb-2">🛞 Your Tyre Size</h2>
                <p className="text-gray-500 mb-6">Select your tyre dimensions — find them on your tyre sidewall.</p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-500">
                  e.g. <span className="font-mono font-bold text-primary">205/55 R16</span> — the numbers printed on the side of your current tyre.
                </div>
                {formData.tyreWidth && formData.tyreProfile && formData.tyreRim && (
                  <div className="mb-5 text-center">
                    <span className="text-2xl font-black text-accent font-mono">{formData.tyreWidth}/{formData.tyreProfile} R{formData.tyreRim}</span>
                    <p className="text-xs text-gray-400 mt-1">Selected size</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Width *</label>
                    <select value={formData.tyreWidth} onChange={e => setFormData({ ...formData, tyreWidth: e.target.value })}
                      className={inputCls + ' bg-white'}>
                      <option value="">Width</option>
                      {['155','165','175','185','195','205','215','225','235','245','255','265','275','285','295','305'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Profile *</label>
                    <select value={formData.tyreProfile} onChange={e => setFormData({ ...formData, tyreProfile: e.target.value })}
                      className={inputCls + ' bg-white'}>
                      <option value="">Profile</option>
                      {['30','35','40','45','50','55','60','65','70','75','80'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rim (R) *</label>
                    <select value={formData.tyreRim} onChange={e => setFormData({ ...formData, tyreRim: e.target.value })}
                      className={inputCls + ' bg-white'}>
                      <option value="">Rim</option>
                      {['13','14','15','16','17','18','19','20','21','22','24'].map(r => (
                        <option key={r} value={r}>R{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-primary mb-2">Your Vehicle</h2>
                <p className="text-gray-500 mb-6">Tell us about the car we're servicing.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Registration Number *</label>
                    <input type="text" value={formData.vehicleNumber}
                      onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                      className={inputCls} placeholder="e.g. ABC123" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Make *</label>
                      <input type="text" value={formData.vehicleMake}
                        onChange={e => setFormData({ ...formData, vehicleMake: e.target.value })}
                        className={inputCls} placeholder="Toyota" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Model *</label>
                      <input type="text" value={formData.vehicleModel}
                        onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })}
                        className={inputCls} placeholder="Camry" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                    <input type="number" value={formData.vehicleYear}
                      onChange={e => setFormData({ ...formData, vehicleYear: e.target.value })}
                      className={inputCls} placeholder="2019" min="1980" max={new Date().getFullYear() + 1} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== STEP 3: LOCATION ===== */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Service Location</h2>
            <p className="text-gray-500 mb-4">Where should our mechanic arrive?</p>

            {/* GPS Detect Button */}
            <button onClick={detectLocation} disabled={detectingLocation}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm mb-5 transition-all border-2 ${
                locationStatus === 'success' ? 'bg-green-50 border-green-400 text-green-700'
                : locationStatus === 'error' ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
              } disabled:opacity-60`}>
              {detectingLocation ? (
                <><Loader2 size={18} className="animate-spin" /> Detecting your location...</>
              ) : locationStatus === 'success' ? (
                <><CheckCircle2 size={18} className="text-green-600" /> Location detected — check fields below</>
              ) : locationStatus === 'error' ? (
                <><AlertCircle size={18} /> Could not detect — fill in manually</>
              ) : (
                <><MapPin size={18} /> Use My Current Location</>
              )}
            </button>
            <p className="text-xs text-gray-400 -mt-3 mb-4 text-center">
              Your GPS location is only used to fill your service address — never stored separately.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address *</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400"><MapPin size={20} /></div>
                  <textarea rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="123 Main St..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                  <select value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className={inputCls + ' bg-white'}>
                    <option value="">Select</option>
                    {AUSTRALIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                  <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className={inputCls + ' bg-white'}>
                    <option value="">Select</option>
                    {AUSTRALIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Postcode *</label>
                <input type="text" value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  className={inputCls} placeholder="2600" />
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 4: YOUR DETAILS (guest only) ===== */}
        {step === 4 && !isAuthenticated && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Your Details</h2>
            <p className="text-gray-500 mb-6">So we can confirm your booking and get in touch.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input type="text" value={formData.guestName}
                  onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                  className={inputCls} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input type="email" value={formData.guestEmail}
                  onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                  className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                <input type="tel" value={formData.guestPhone}
                  onChange={e => setFormData({ ...formData, guestPhone: e.target.value })}
                  className={inputCls} placeholder="0400 000 000" />
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 5: ADD-ONS ===== */}
        {step === 5 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Add-ons</h2>
            <p className="text-gray-500 mb-6">Optional extras for your service.</p>
            {formData.service?.addons?.length > 0 ? (
              <div className="space-y-3">
                {formData.service.addons.map(addon => {
                  const isSelected = formData.selectedAddons.find(a => a.id === addon.id);
                  return (
                    <button key={addon.id} onClick={() => toggleAddon(addon)}
                      className={`w-full p-4 border-2 rounded-card flex items-center gap-3 transition-all text-left ${isSelected ? 'border-accent bg-red-50/20' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-accent border-accent text-white' : 'border-gray-300'}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                      <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{addon.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">No add-ons for this service. Continue to schedule.</div>
            )}
            {formData.selectedAddons.length > 0 && (
              <div className="mt-5 p-4 bg-background rounded-card border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">{formData.selectedAddons.length} selected: {formData.selectedAddons.map(a => a.name).join(', ')}</p>
                <p className="text-xs text-gray-400 mt-1">Pricing provided in your offline invoice.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== STEP 6: SCHEDULE ===== */}
        {step === 6 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Pick a Date &amp; Time</h2>
            <p className="text-gray-500 mb-6">When should our mechanics arrive?</p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <input type="date" value={formData.date} min={new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({ ...formData, date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(slot => (
                  <button key={slot} onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    className={`p-3 rounded-input text-sm font-semibold border transition-colors flex items-center justify-center ${formData.timeSlot === slot ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-accent'}`}>
                    <Clock size={14} className="mr-1.5 opacity-70" />{slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 7: CONFIRMATION ===== */}
        {step === 7 && (
          <div className="bg-white p-6 sm:p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">Order Summary</h2>
            <div className="bg-background p-5 rounded-card space-y-3 mb-6 text-sm">
              {[
                { label: 'Service', value: formData.service?.name },
                { label: 'Vehicle', value: [formData.vehicleMake, formData.vehicleModel, formData.vehicleYear].filter(Boolean).join(' ') + (formData.vehicleNumber ? ` (${formData.vehicleNumber})` : '') },
                { label: 'Location', value: [formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(', ') },
                { label: 'Schedule', value: formData.date && formData.timeSlot ? `${formData.date} at ${formData.timeSlot}` : '' },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-bold text-primary text-right max-w-xs">{value}</span>
                </div>
              ) : null)}

              {/* Tyre size — shown only for tyre services */}
              {isTyreService(formData.service) && formData.tyreWidth && formData.tyreProfile && formData.tyreRim && (
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">🛞 Tyre Size</span>
                  <span className="font-bold text-accent text-right font-mono">
                    {formData.tyreWidth}/{formData.tyreProfile} R{formData.tyreRim}
                  </span>
                </div>
              )}

              {formData.selectedAddons.length > 0 && (
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Add-ons</span>
                  <span className="font-bold text-primary text-right">{formData.selectedAddons.map(a => a.name).join(', ')}</span>
                </div>
              )}
              <div className="pt-2 flex items-start gap-2 bg-amber-50 rounded-xl p-3 mt-2">
                <span className="text-amber-500 text-base">📋</span>
                <p className="text-xs text-amber-700">Your invoice will be <strong>provided offline by your mechanic</strong> after the service is completed. No invoice will be emailed to you.</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400">Our team will contact you to confirm your booking details.</p>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="mt-8 flex justify-between">
          <button onClick={prevStep} disabled={submitting}
            className={`px-6 py-3 rounded-btn font-bold transition-colors ${step === 1 ? 'invisible' : 'bg-white border border-gray-200 text-gray-600 hover:bg-background disabled:opacity-50'}`}>
            Back
          </button>
          <button onClick={() => { if (step < TOTAL_STEPS) nextStep(); else handleBookingSubmit(); }}
            disabled={!canProceed() || submitting}
            className="px-8 py-3 rounded-btn font-bold bg-primary text-white hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center">
            {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {step === TOTAL_STEPS ? 'Confirm Booking' : 'Continue'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
