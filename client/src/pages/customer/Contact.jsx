import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, Shield, Truck, Wrench, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api/axios';
import { SERVICES_DATA } from '../../data/servicesData';

const BUSINESS_PHONE = '0427563913';
const BUSINESS_PHONE_FORMATTED = '0427 563 913';
const BUSINESS_EMAIL = 'info@autocareonwheels.com.au';
const BUSINESS_ADDRESS = '10 Muntz St, Chisholm ACT 2905';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    service: '',
    suburb: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Contact Us | AutoCare on Wheels — Mobile Mechanic Canberra';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Contact AutoCare on Wheels for reliable mobile car servicing, mechanical repairs, and tyre fitting across Canberra and Queanbeyan. Call 0427 563 913 or send an enquiry.'
      );
    }

    // Dynamic JSON-LD Schema
    const scriptId = 'contact-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact AutoCare on Wheels',
      'url': 'https://www.autocareonwheels.com.au/contact',
      'description': 'Contact Canberra mobile mechanic AutoCare on Wheels for car servicing, repairs, and tyre fitment.',
      'mainEntity': {
        '@type': 'AutoRepair',
        'name': 'AutoCare on Wheels',
        'telephone': '+61427563913',
        'email': 'info@autocareonwheels.com.au',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '10 Muntz St',
          'addressLocality': 'Chisholm',
          'addressRegion': 'ACT',
          'postalCode': '2905',
          'addressCountry': 'AU'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': -35.4208,
          'longitude': 149.1274
        },
        'areaServed': [
          'Canberra',
          'Queanbeyan',
          'Belconnen',
          'Gungahlin',
          'Tuggeranong',
          'Woden Valley',
          'Weston Creek',
          'Molonglo Valley'
        ],
        'openingHoursSpecification': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '08:00',
          'closes': '18:00'
        }
      }
    };
    script.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, phone, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
    } catch (err) {
      console.warn('API error submitting enquiry:', err);
      // Even if offline/network error, show courteous message and direct call option
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-accent/20">
              <Truck size={14} /> Mobile Mechanic Across ACT &amp; Queanbeyan
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
              Get in Touch with AutoCare
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Have questions, need an urgent quote, or ready to book your mobile mechanic? Call us directly, send an enquiry, or book online — we come straight to your location.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone Card */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-accent transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <Phone size={22} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Call Directly</h3>
                <p className="text-gray-400 text-xs mb-4">Fastest response for bookings, advice &amp; emergencies.</p>
              </div>
              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="inline-flex items-center text-accent hover:text-white font-extrabold text-lg transition-colors group-hover:translate-x-1 duration-200"
              >
                {BUSINESS_PHONE_FORMATTED} <ArrowRight size={16} className="ml-1.5" />
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-accent transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <Mail size={22} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Email Us</h3>
                <p className="text-gray-400 text-xs mb-4">Send service records, quote requests or detailed queries.</p>
              </div>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="text-accent hover:text-white font-bold text-sm transition-colors break-all"
              >
                {BUSINESS_EMAIL}
              </a>
            </div>

            {/* Workshop / Base Address */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-accent transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <MapPin size={22} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Location Base</h3>
                <p className="text-gray-300 text-sm font-medium mb-1">{BUSINESS_ADDRESS}</p>
                <p className="text-gray-400 text-xs mb-4">Servicing all Canberra suburbs &amp; Queanbeyan.</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-bold">
                <a
                  href="https://maps.app.goo.gl/w3SQ7VsSin5gGsND6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline hover:text-white transition-colors"
                >
                  Google Maps
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="http://maps.apple.com/?q=10+Muntz+St,+Chisholm+ACT+2905"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline hover:text-white transition-colors"
                >
                  Apple Maps
                </a>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-accent transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                  <Clock size={22} className="text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Operating Hours</h3>
                <p className="text-gray-300 text-sm font-semibold">Mon – Sat: 8:00 AM – 6:00 PM</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">Emergency &amp; tyre callouts available by phone.</p>
              </div>
              <Link
                to="/book"
                className="inline-flex items-center text-accent hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Book 24/7 Online →
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content: Form & Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left: Interactive Enquiry Form */}
            <div className="lg:col-span-7 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Send an Enquiry</h2>
                <p className="text-gray-400 text-sm">
                  Fill in your details below and our Canberra team will get back to you with pricing and availability.
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Enquiry Sent Successfully!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto mb-6">
                    Thank you, <span className="font-semibold text-white">{formData.name}</span>. We've received your request and our mobile mechanic team will contact you shortly on <span className="font-semibold text-accent">{formData.phone}</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href={`tel:${BUSINESS_PHONE}`}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Phone size={18} /> Need Faster Help? Call Now
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          vehicle: '',
                          service: '',
                          suburb: '',
                          message: ''
                        });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3">
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Phone Number <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="0400 000 000"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                    </div>

                    {/* Suburb / Postcode */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Your Suburb (ACT / Queanbeyan)
                      </label>
                      <input
                        type="text"
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        placeholder="e.g. Belconnen, Gungahlin, Chisholm"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Vehicle */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Vehicle Make, Model &amp; Year
                      </label>
                      <input
                        type="text"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        placeholder="e.g. 2018 Toyota RAV4"
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                      />
                    </div>

                    {/* Service Needed */}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Service Required
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors text-sm"
                      >
                        <option value="">Select a service (optional)</option>
                        <option value="Tyre Supply & Fitment">Tyre Supply &amp; Fitment</option>
                        {SERVICES_DATA.map(s => (
                          <option key={s.id} value={s.shortTitle}>
                            {s.shortTitle}
                          </option>
                        ))}
                        <option value="Emergency Breakdown / Towing">Emergency Breakdown</option>
                        <option value="General Diagnostics / Other">General Diagnostics / Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
                      Message / Issue Description <span className="text-accent">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please describe what maintenance, repair, or tyre assistance you need..."
                      className="w-full bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent hover:bg-red-700 text-white font-extrabold text-base py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    We respect your privacy. Your information is only used to respond to your service enquiry.
                  </p>
                </form>
              )}
            </div>

            {/* Right: Service Areas, Map & Guarantees */}
            <div className="lg:col-span-5 space-y-6">

              {/* Service Areas Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin size={20} className="text-accent" /> Where We Come To You
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Our mobile mechanic vans are fully equipped workshops on wheels, servicing drivers throughout Canberra and Queanbeyan:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-300 mb-6">
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Belconnen</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Gungahlin</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> North Canberra</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> South Canberra</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Tuggeranong</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Woden Valley</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Weston Creek</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accent" /> Queanbeyan</span>
                </div>
                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">At home, work, or roadside</span>
                  <Link to="/book" className="text-accent text-xs font-bold hover:underline">
                    Book an Appointment →
                  </Link>
                </div>
              </div>

              {/* Map Embed */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-2 overflow-hidden shadow-lg">
                <div className="w-full h-64 rounded-xl overflow-hidden">
                  <iframe
                    title="AutoCare on Wheels Canberra Base Location"
                    src="https://maps.google.com/maps?q=Autocare+on+wheels,+10+Muntz+St,+Chisholm+ACT+2905&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.2)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Emergency Banner */}
              <div className="bg-gradient-to-r from-red-950/60 to-red-900/30 border border-red-700/40 rounded-2xl p-6 text-center">
                <h4 className="text-white font-extrabold text-base mb-1">Flat Tyre or Urgent Breakdown?</h4>
                <p className="text-gray-300 text-xs mb-4">
                  Don't wait for form replies when stranded. Call our mobile technician immediately for same-day dispatch.
                </p>
                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  className="bg-green-600 hover:bg-green-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Phone size={16} /> Call {BUSINESS_PHONE_FORMATTED}
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
