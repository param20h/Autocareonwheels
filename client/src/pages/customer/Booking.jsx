import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Wrench, Loader2, Plus, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: null,
    selectedAddons: [],
    date: '',
    timeSlot: '',
    address: '',
    city: ''
  });
  
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const TOTAL_STEPS = 5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

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

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        service_id: formData.service.id,
        address: formData.address,
        city: formData.city || 'Local',
        date: formData.date,
        time_slot: formData.timeSlot,
        total_price: getTotalPrice(),
        addons: formData.selectedAddons.map(a => ({ id: a.id, price: parseFloat(a.price) }))
      });
      setToast({ show: true, message: 'Booking confirmed! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!formData.service;
    if (step === 2) return true; // addons are optional
    if (step === 3) return formData.date && formData.timeSlot;
    if (step === 4) return !!formData.address;
    return true;
  };

  const stepLabels = ['Service', 'Add-ons', 'Schedule', 'Location', 'Confirm'];

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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${
                  isActive ? 'bg-primary text-white border-2 border-primary ring-2 ring-primary' : 
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

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Select a Service</h2>
            <p className="text-gray-500 mb-8">Choose the primary maintenance package for your vehicle.</p>
            
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
                        {service.addons?.length > 0 && (
                          <span className="text-xs text-accent font-semibold mt-1 inline-block">{service.addons.length} add-ons available</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
                        <span className="font-bold text-gray-700 text-lg">₹{parseFloat(service.price).toLocaleString()}</span>
                        <span className="text-xs text-gray-400">{service.duration_mins} min</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.service?.id === service.id ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                          {formData.service?.id === service.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                    <input type="radio" name="service" className="hidden"
                      onChange={() => setFormData({...formData, service, selectedAddons: []})}
                      checked={formData.service?.id === service.id} />
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Add-ons */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Enhance Your Service</h2>
            <p className="text-gray-500 mb-2">Customize your <span className="font-bold text-primary">{formData.service?.name}</span> with optional add-ons.</p>
            <p className="text-sm text-gray-400 mb-8">These are completely optional — skip if you don't need them.</p>

            {formData.service?.addons?.length > 0 ? (
              <div className="space-y-3">
                {formData.service.addons.map(addon => {
                  const isSelected = formData.selectedAddons.find(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-4 border rounded-card flex items-center justify-between transition-all text-left ${
                        isSelected ? 'border-accent bg-red-50/20 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-accent border-accent text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check size={14} />}
                        </div>
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{addon.name}</span>
                      </div>
                      <span className={`font-bold ${isSelected ? 'text-accent' : 'text-gray-500'}`}>+ ₹{parseFloat(addon.price).toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <p>No add-ons available for this service.</p>
              </div>
            )}

            {/* Running Total */}
            <div className="mt-6 p-4 bg-background rounded-card border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Base: ₹{parseFloat(formData.service?.price).toLocaleString()}</p>
                  {formData.selectedAddons.length > 0 && (
                    <p className="text-sm text-accent font-semibold">+ {formData.selectedAddons.length} add-on{formData.selectedAddons.length > 1 ? 's' : ''}: ₹{formData.selectedAddons.reduce((s, a) => s + parseFloat(a.price), 0).toLocaleString()}</p>
                  )}
                </div>
                <p className="text-2xl font-black text-primary">₹{getTotalPrice().toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Pick a Date & Time</h2>
            <p className="text-gray-500 mb-8">When should our mechanics arrive?</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
              <input type="date" value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'].map(slot => (
                  <button key={slot}
                    onClick={() => setFormData({...formData, timeSlot: slot})}
                    className={`p-3 rounded-input text-sm font-semibold border transition-colors flex items-center justify-center ${
                      formData.timeSlot === slot ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-accent'
                    }`}>
                    <Clock size={16} className="mr-2 opacity-70" /> {slot.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Service Location</h2>
            <p className="text-gray-500 mb-8">Where should we dispatch our workshop van?</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400"><MapPin size={20} /></div>
                  <textarea rows="3" value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" 
                    placeholder="123 Mechanics Blvd, Apt 4B..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input type="text" value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                  placeholder="Auto City" />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">Order Summary</h2>
            
            <div className="bg-background p-6 rounded-card space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Service Package</span>
                <div className="text-right">
                  <span className="font-bold text-primary">{formData.service?.name}</span>
                  <p className="text-sm text-gray-400">₹{parseFloat(formData.service?.price).toLocaleString()}</p>
                </div>
              </div>

              {formData.selectedAddons.length > 0 && (
                <div className="border-b border-gray-200 pb-4">
                  <span className="text-gray-500 font-medium block mb-2">Add-ons</span>
                  <div className="space-y-2 pl-4">
                    {formData.selectedAddons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center"><Plus size={12} className="mr-1 text-accent" />{addon.name}</span>
                        <span className="font-semibold text-gray-700">₹{parseFloat(addon.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Schedule</span>
                <span className="font-bold text-primary text-right">{formData.date}<br/>{formData.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Location</span>
                <span className="font-bold text-primary max-w-xs text-right truncate">{formData.address}{formData.city ? `, ${formData.city}` : ''}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-primary">Total Amount Due</span>
                <span className="text-2xl font-black text-accent">₹{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-6">Payment will be collected securely upon service completion.</p>
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
            {step === TOTAL_STEPS ? 'Confirm Booking' : step === 2 ? (formData.selectedAddons.length > 0 ? `Continue with ${formData.selectedAddons.length} add-on${formData.selectedAddons.length > 1 ? 's' : ''}` : 'Skip Add-ons') : 'Continue'}
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Booking;
