import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock, MapPin, Wrench, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: null, // Stores the full service object
    date: '',
    timeSlot: '',
    address: ''
  });
  
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleBookingSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        service_id: formData.service.id,
        address: formData.address,
        date: formData.date,
        time_slot: formData.timeSlot,
        total_price: parseFloat(formData.service.price)
      });
      alert('Booking Confirmed Successfully!');
      navigate('/dashboard'); // Will redirect to dashboard once built
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing your booking');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-8 sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} className="mr-2" /> 
          <span className="font-semibold text-sm">Cancel Booking</span>
        </Link>
        <div className="mx-auto flex items-center space-x-2 text-primary">
          <Wrench size={24} />
          <span className="font-extrabold text-xl tracking-tight hidden sm:block">AutoCare Check-out</span>
        </div>
        <div className="w-24"></div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        <div className="mb-10 flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {['Service', 'Schedule', 'Location', 'Confirm'].map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${
                  isActive ? 'bg-primary text-white border-2 border-white ring-2 ring-primary' : 
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
                  <label key={service.id} className={`block p-5 border rounded-card cursor-pointer transition-all ${formData.service?.id === service.id ? 'border-accent bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between pointer-events-none">
                      <span className="font-bold text-primary text-lg">{service.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-700">₹{parseFloat(service.price).toLocaleString()}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.service?.id === service.id ? 'border-accent bg-accent text-white' : 'border-gray-300'}`}>
                          {formData.service?.id === service.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                    {/* Invisible radio input to make the whole block clickable */}
                    <input 
                      type="radio" 
                      name="service" 
                      className="hidden"
                      onChange={() => setFormData({...formData, service})}
                      checked={formData.service?.id === service.id}
                    />
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Pick a Date & Time</h2>
            <p className="text-gray-500 mb-8">When should our mechanics arrive?</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
              <input 
                type="date" 
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'].map(slot => (
                  <button 
                    key={slot}
                    onClick={() => setFormData({...formData, timeSlot: slot})}
                    className={`p-3 rounded-input text-sm font-semibold border transition-colors flex items-center justify-center ${
                      formData.timeSlot === slot ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-accent'
                    }`}
                  >
                    <Clock size={16} className="mr-2 opacity-70" /> {slot.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Service Location</h2>
            <p className="text-gray-500 mb-8">Where should we dispatch our workshop van?</p>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  <MapPin size={20} />
                </div>
                <textarea 
                  rows="4"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-input pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                  placeholder="123 Mechanics Blvd, Apt 4B, Auto City..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="bg-white p-8 rounded-card shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-primary mb-6 text-center">Order Summary</h2>
            
            <div className="bg-background p-6 rounded-card space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Service Package</span>
                <span className="font-bold text-primary">{formData.service?.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Schedule</span>
                <span className="font-bold text-primary text-right">{formData.date}<br/>{formData.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium">Location</span>
                <span className="font-bold text-primary max-w-xs text-right truncate">{formData.address}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-primary">Total Amount Due</span>
                <span className="text-2xl font-black text-accent">₹{parseFloat(formData.service?.price).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 mb-6">Payment will be collected securely upon service completion.</p>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button 
            onClick={prevStep}
            disabled={submitting}
            className={`px-6 py-3 rounded-btn font-bold transition-colors ${step === 1 ? 'invisible' : 'bg-white border border-gray-200 text-gray-600 hover:bg-background disabled:opacity-50'}`}
          >
            Back
          </button>
          
          <button 
            onClick={() => {
              if (step < 4) nextStep();
              else handleBookingSubmit();
            }}
            disabled={(step === 1 && !formData.service) || (step === 2 && (!formData.date || !formData.timeSlot)) || (step === 3 && !formData.address) || submitting}
            className="px-8 py-3 rounded-btn font-bold bg-primary text-white hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center"
          >
            {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {step === 4 ? 'Confirm Booking' : 'Continue'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Booking;
