import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Loader2, Plus, Check, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import useAuth from '../../store/useAuth';
import userService from '../../services/user.service';

const AUSTRALIA_CITIES = [
  'Canberra',
  'Queanbeyan',
];

const AUSTRALIA_STATES = [
  'New South Wales',
  'Australian Capital Territory (ACT)',
];

const Booking = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    vehicleNumber: '',
    vehicleModel: '',
    service: null,
    selectedAddons: [],
    date: '',
    timeSlot: '',
  });

  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [lookingUpVehicle, setLookingUpVehicle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const TOTAL_STEPS = 6;

  useEffect(() => {
    const fetchInitialData = async () => {
      let fetchedServices = [];
      try {
        const { data: servicesData } = await api.get('/services');
        fetchedServices = servicesData?.data || [];
      } catch (error) {
        console.error('Failed to load services from API, using fallback', error);
      }

      if (fetchedServices.length === 0) {
        fetchedServices = [
          { id: '1', name: 'Logbook Service', description: 'The convenient way to maintain your new car warranty.', price: 249, addons: [{ id: 101, name: 'Air Filter Upgrade', price: 39 }] },
          { id: '2', name: 'Yearly Service', description: 'Extend the life of your vehicle without the hassle of a garage.', price: 189, addons: [{ id: 102, name: 'Wiper Blade Replacement', price: 39 }] },
          { id: '3', name: 'Car Battery', description: 'Every AutoCare van stocks the highest quality battery brands.', price: 199, addons: [{ id: 103, name: 'Terminal Check', price: 19 }] },
          { id: '4', name: 'Brakes', description: 'Quality brake repairs to keep you safe on the road.', price: 220, addons: [{ id: 104, name: 'Brake Fluid Flush', price: 89 }] },
          { id: '5', name: 'Flat Tyre Service', description: 'Puncture repair and professional tyre fitment!', price: 110, addons: [{ id: 105, name: 'Emergency Spare Fitting', price: 25 }] },
          { id: '6', name: 'Ultimate Service', description: 'Give your car the birthday it deserves. Our most comprehensive service.', price: 349, addons: [{ id: 106, name: 'Fuel System Flush', price: 89 }] }
        ];
      }
      setServices(fetchedServices);

      try {
        // Only attempt to fetch vehicles if authenticated
        if (isAuthenticated) {
          const { data: vehiclesData } = await userService.getVehicles();
          setVehicles(vehiclesData?.data || []);
        }
      } catch (error) {
        console.error('Failed to load vehicles data', error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchInitialData();
  }, [isAuthenticated]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleAddon = (addon) => {
    const exists = formData.selectedAddons.find(a => a.id === addon.id);
    if (exists) {
      setFormData({ ...formData, selectedAddons: formData.selectedAddons.filter(a => a.id !== addon.id) });
    } else {
      setFormData({ ...formData, selectedAddons: [...formData.selectedAddons, addon] });
    }
  };

  const getTotalPrice = () => {
    const base = parseFloat(formData.service?.price || 0);
    const addonsTotal = formData.selectedAddons.reduce((sum, a) => sum + parseFloat(a.price), 0);
    return base + addonsTotal;
  };

  const handleVehicleLookup = () => {
    const regNumber = formData.vehicleNumber.trim().toUpperCase();
    if (!regNumber) {
      setToast({ show: true, message: 'Enter a vehicle number first', type: 'error' });
      return;
    }

    setLookingUpVehicle(true);
    try {
      if (isAuthenticated) {
        const match = vehicles.find((v) => (v.reg_number || '').toUpperCase() === regNumber);
        if (!match) {
          setToast({ show: true, message: 'Vehicle not found in your saved vehicles. Enter model manually.', type: 'error' });
          return;
        }
        const modelLabel = [match.make, match.model].filter(Boolean).join(' ').trim();
        setFormData((prev) => ({ ...prev, vehicleNumber: regNumber, vehicleModel: modelLabel || prev.vehicleModel }));
        setToast({ show: true, message: 'Vehicle found and prefilled', type: 'success' });
        return;
      }

      if (!formData.vehicleModel.trim()) {
        setToast({ show: true, message: 'Enter vehicle model after number lookup', type: 'error' });
        return;
      }
      setFormData((prev) => ({ ...prev, vehicleNumber: regNumber }));
      setToast({ show: true, message: 'Vehicle details captured', type: 'success' });
    } finally {
      setLookingUpVehicle(false);
    }
  };

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        service_id: formData.service.id,
        address: formData.address,
        city: formData.city || 'Local',
        state: formData.state,
        pincode: formData.pincode,
        date: formData.date,
        time_slot: formData.timeSlot,
        total_price: getTotalPrice(),
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        vehicle_number: formData.vehicleNumber,
        vehicle_model: formData.vehicleModel,
        addons: formData.selectedAddons.map(a => ({ id: a.id, price: parseFloat(a.price) }))
      });
      setToast({ show: true, message: 'Booking confirmed! Redirecting...', type: 'success' });
      setTimeout(() => navigate(isAuthenticated ? '/dashboard' : '/'), 1500);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      const hasAddress = !!formData.address;
      const hasLocationMeta = !!formData.city && !!formData.state && /^\d{4}$/.test(formData.pincode);
      if (isAuthenticated) return hasAddress && hasLocationMeta;
      return hasAddress && hasLocationMeta && !!formData.guestName && !!formData.guestEmail && !!formData.guestPhone;
    }
    if (step === 2) return !!formData.vehicleNumber && !!formData.vehicleModel;
    if (step === 3) return !!formData.service;
    if (step === 4) return true;
    if (step === 5) return formData.date && formData.timeSlot;
    return true;
  };

  const stepLabels = ['Location', 'Vehicle', 'Service', 'Estimate', 'Schedule', 'Confirm'];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Navbar />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-28 pb-20">

        {/* Progress Bar */}
        <div className="mb-10 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}></div>

          {stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isActive ? 'bg-primary text-white border-2 border-primary ring-2 ring-primary' :
                    isCompleted ? 'bg-accent text-white' : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                  {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                </div>
                <span className={`mt-2 text-xs font-semibold ${isActive || isCompleted ? 'text-primary' : 'text-gray-400'} hidden sm:block`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Service Location</h2>
            <p className="text-gray-500 mb-8">Enter where our mechanic should arrive.</p>

            <div className="space-y-5">
              {!isAuthenticated && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                      className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400"><MapPin size={20} /></div>
                  <textarea rows="3" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="123 Mechanics Blvd, Apt 4B..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                >
                  <option value="">Select a city</option>
                  {AUSTRALIA_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white"
                >
                  <option value="">Select a state</option>
                  {AUSTRALIA_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Postcode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="2000"
                />
                <p className="text-xs text-gray-500 mt-1">Use a 4-digit Australian postcode.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Lookup */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Lookup Vehicle</h2>
            <p className="text-gray-500 mb-8">Enter vehicle number and confirm model details.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Number</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="MH12AB1234"
                  />
                  <button
                    onClick={handleVehicleLookup}
                    type="button"
                    disabled={lookingUpVehicle}
                    className="px-5 py-3 rounded-btn bg-primary text-white font-bold hover:bg-accent transition-colors disabled:opacity-50 flex items-center"
                  >
                    {lookingUpVehicle ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                    <span className="ml-2">Lookup</span>
                  </button>
                </div>
                {isAuthenticated && vehicles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Saved vehicles found: {vehicles.length}. Lookup will prefill model when reg no matches.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Honda City / Hyundai i20 / Tata Nexon"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Select Services</h2>
            <p className="text-gray-500 mb-8">Choose the primary service package for your vehicle.</p>

            <div className="space-y-4">
              {loadingServices ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" size={32} /></div>
              ) : services.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No services available right now.</div>
              ) : (
                services.map(service => (
                  <label key={service.id} className={`block p-5 border rounded-card cursor-pointer transition-all ${formData.service?.id === service.id ? 'border-accent bg-red-50/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between pointer-events-none">
                      <div>
                        <span className="font-bold text-primary text-lg">{service.name}</span>
                        <p className="text-sm text-gray-500 mt-1">{service.description?.substring(0, 80)}...</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
                        <span className="text-xs text-gray-400">{service.duration_mins} min</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.service?.id === service.id ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                          {formData.service?.id === service.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                    <input type="radio" name="service" className="hidden"
                      onChange={() => setFormData({ ...formData, service, selectedAddons: [] })}
                      checked={formData.service?.id === service.id} />
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 4: Estimate */}
        {step === 4 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Add-ons</h2>
            <p className="text-gray-500 mb-8">Select any optional extras you'd like added to your service.</p>

            {formData.service?.addons?.length > 0 ? (
              <div className="space-y-3">
                {formData.service.addons.map(addon => {
                  const isSelected = formData.selectedAddons.find(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-4 border rounded-card flex items-center justify-between transition-all text-left ${isSelected ? 'border-accent bg-red-50/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-accent border-accent text-white' : 'border-gray-300'
                          }`}>
                          {isSelected && <Check size={14} />}
                        </div>
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{addon.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <p>No add-ons available for this service. Base estimate is shown below.</p>
              </div>
            )}

            {/* Selected add-ons summary */}
            {formData.selectedAddons.length > 0 && (
              <div className="mt-6 p-4 bg-background rounded-card border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">{formData.selectedAddons.length} add-on{formData.selectedAddons.length > 1 ? 's' : ''} selected: {formData.selectedAddons.map(a => a.name).join(', ')}</p>
                <p className="text-xs text-gray-400 mt-1">Pricing will be provided in your offline invoice.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Schedule */}
        {step === 5 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Pick a Date & Time</h2>
            <p className="text-gray-500 mb-8">When should our mechanics arrive?</p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
              <input type="date" value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM', '05:00 PM - 06:00 PM'].map(slot => (
                  <button key={slot}
                    onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    className={`p-3 rounded-input text-sm font-semibold border transition-colors flex items-center justify-center ${formData.timeSlot === slot ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-accent'
                      }`}>
                    <Clock size={16} className="mr-2 opacity-70" /> {slot.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Confirm */}
        {step === 6 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">Order Summary</h2>

            <div className="bg-background p-6 rounded-card space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Location</span>
                <span className="font-bold text-primary max-w-xs text-right truncate">{formData.address}{formData.city ? `, ${formData.city}` : ''}{formData.state ? `, ${formData.state}` : ''}{formData.pincode ? `, ${formData.pincode}` : ''}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Vehicle</span>
                <span className="font-bold text-primary text-right">{formData.vehicleNumber}<br />{formData.vehicleModel}</span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Service Package</span>
                <span className="font-bold text-primary text-right">{formData.service?.name}</span>
              </div>

              {formData.selectedAddons.length > 0 && (
                <div className="border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium block mb-2">Add-ons</span>
                  <div className="space-y-2 pl-4">
                    {formData.selectedAddons.map(addon => (
                      <div key={addon.id} className="text-sm">
                        <span className="text-gray-600 flex items-center"><Plus size={12} className="mr-1 text-accent" />{addon.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Schedule</span>
                <span className="font-bold text-primary text-right">{formData.date}<br />{formData.timeSlot}</span>
              </div>
              <div className="pt-2 text-center">
                <p className="text-sm text-gray-400">A detailed invoice will be provided by your mechanic after the service.</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-6">Our team will contact you to confirm your booking details.</p>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="mt-8 flex justify-between">
          <button onClick={prevStep} disabled={submitting}
            className={`px-6 py-3 rounded-btn font-bold transition-colors ${step === 1 ? 'invisible' : 'bg-white border border-gray-200 text-gray-600 hover:bg-background disabled:opacity-50'}`}>
            Back
          </button>

          <button
            onClick={() => { if (step < TOTAL_STEPS) nextStep(); else handleBookingSubmit(); }}
            disabled={!canProceed() || submitting}
            className="px-8 py-3 rounded-btn font-bold bg-primary text-white hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center">
            {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {step === TOTAL_STEPS ? 'Confirm Booking' : step === 4 ? (formData.selectedAddons.length > 0 ? `Continue with ${formData.selectedAddons.length} add-on${formData.selectedAddons.length > 1 ? 's' : ''}` : 'Continue to Schedule') : 'Continue'}
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Booking;
