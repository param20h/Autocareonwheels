import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, Star, MapPin, Phone, Mail, Send } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../api/axios';

const Home = () => {
  const [services, setServices] = useState([]);
  const serviceIcons = [Droplets, Settings, CheckCircle, Wrench, Shield, Clock];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data);
      } catch {
        // Fallback to empty; homepage still renders fine
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm border border-gray-800 shadow-xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span>Premium At-Home Service Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight drop-shadow-sm">
            Precision Care <br /> For Your Car.
          </h1>
          <p className="text-lg md:text-xl text-primary max-w-lg leading-relaxed font-medium">
            Experience the mechanical atelier. Reliable, affordable, and expert services delivered straight to your driveway or at our luxury workshop.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/book" className="bg-accent text-white px-8 py-4 rounded-card font-bold hover:bg-red-700 transition-all text-lg shadow-[0_8px_30px_rgb(192,57,43,0.3)] hover:shadow-[0_8px_30px_rgb(192,57,43,0.5)] text-center border border-accent">
              Book a Service
            </Link>
            <a href="#services" className="px-8 py-4 rounded-card font-bold text-primary bg-background border border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-all text-lg text-center shadow-sm">
              Explore Options
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 mt-16 lg:mt-0 relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-accent/20 to-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="relative">
            <img
              src="https://github.com/param20h/datasets/blob/main/home.png?raw=true"
              alt="Pristine Car Engine"
              className="rounded-2xl shadow-2xl object-cover h-[400px] md:h-[600px] w-full transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-800">
              <div className="bg-accent/20 p-3 rounded-full">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-silver font-medium">Certified Mechanics</p>
                <p className="font-bold text-white text-xl">100% Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid — Dynamic from DB */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Our Expertise</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We treat every vehicle as a masterpiece. Select from our core maintenance pillars below.</p>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(services.length > 0 ? services.slice(0, 6) : [
              { id: 0, name: 'Premium Oil Change', description: 'Full synthetic fluid replacement, comprehensive filter change, and a 20-point health inspection.', price: '1499', addons: [] },
              { id: 0, name: 'Engine Diagnostics', description: 'Advanced computer scanning, error code resolution, and mechanical performance tuning.', price: '2199', popular: true, addons: [] },
              { id: 0, name: 'Master Car Wash', description: 'Exterior foam detailing, interior vacuuming, dashboard polishing, and tire dressing.', price: '899', addons: [] }
            ]).map((service, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              return (
                <Link to={service.id ? `/services/${service.id}` : '/book'} key={idx} className="bg-primary rounded-card p-8 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden block border border-transparent hover:border-gray-700 shadow-xl">
                  {(service.popular || idx === 1) && (
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                  )}
                  <div className="bg-[#2A2A2A] w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors border border-gray-700">
                    <Icon className="h-7 w-7 text-silver group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                  <p className="text-silver mb-4 leading-relaxed">{service.description}</p>
                  {service.addons?.length > 0 && (
                    <p className="text-xs text-accent font-bold mb-3">{service.addons.length} add-ons available</p>
                  )}
                  <div className="text-accent font-bold text-lg">Starts at ₹{parseFloat(service.price).toLocaleString()}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Effortless Process.</h2>
              <p className="text-silver text-lg leading-relaxed mb-8">We have removed all friction from auto maintenance so you can focus on the drive.</p>
              <Link to="/book" className="bg-accent text-white px-8 py-3 rounded-btn font-bold hover:bg-red-700 border border-accent transition shadow-lg inline-block">
                Start Booking
              </Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { num: '01', title: 'Select Service', desc: "Choose your car's needs from our curated catalog." },
                { num: '02', title: 'Pick a Time', desc: 'Select a convenient 2-hour slot for our mechanics.' },
                { num: '03', title: 'We Arrive', desc: 'Our fully-equipped van arrives at your doorstep.' },
                { num: '04', title: 'Drive Happy', desc: 'Secure payment, instant invoice, and pure performance.' }
              ].map((step) => (
                <div key={step.num} className="bg-[#2A2A2A] border border-gray-700 p-6 rounded-card">
                  <div className="text-3xl font-black text-accent mb-4">{step.num}</div>
                  <h4 className="text-xl font-bold mb-2 text-white">{step.title}</h4>
                  <p className="text-silver opacity-90">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Thousands of happy vehicle owners trust AutoCare for their maintenance needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul Sharma', role: 'BMW 3 Series Owner', text: "Absolutely incredible service! The mechanic arrived on time, was extremely professional, and my car has never run smoother. I've recommended AutoCare to everyone I know.", stars: 5 },
              { name: 'Priya Patel', role: 'Honda City Owner', text: "The convenience of at-home service is a game changer. No more wasting weekends at the workshop. The team was thorough and transparent with pricing. Will definitely use again!", stars: 5 },
              { name: 'Vikram Singh', role: 'Toyota Fortuner Owner', text: "I was skeptical at first, but the quality exceeded my expectations. The diagnostic report was very detailed and the oil change was done in under 40 minutes. Premium service at fair prices.", stars: 4 }
            ].map((review, idx) => (
              <div key={idx} className="bg-background rounded-card p-8 relative group hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-6 right-6 text-6xl font-black text-primary/5 leading-none">"</div>
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={`${i < review.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">Have questions about our services? Need a custom quote for your fleet? We're here to help.</p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <MapPin className="text-accent" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">Visit Us</p>
                    <p className="text-gray-500 text-sm">123 AutoCare Lane, Mechanical District, Auto City</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Phone className="text-accent" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">Call Us</p>
                    <p className="text-gray-500 text-sm">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Mail className="text-accent" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm">Email Us</p>
                    <p className="text-gray-500 text-sm">support@autocare.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-extrabold text-primary mb-6">Send us a Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you shortly.'); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Name</label>
                  <input type="text" required placeholder="John Doe" className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                  <input type="email" required placeholder="you@example.com" className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Message</label>
                  <textarea rows="4" required placeholder="How can we help you?" className="w-full border border-gray-300 rounded-input p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-btn font-bold hover:bg-accent transition-all flex items-center justify-center space-x-2 shadow-md">
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
