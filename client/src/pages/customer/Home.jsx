import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, Star, MapPin, Phone, Mail, Send } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BorderGlow from '../../components/BorderGlow';
import MechanicBackground from '../../components/MechanicBackground';
import TestimonialsCard from '../../components/ui/testimonials-card';
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
      <div className="relative w-full overflow-hidden bg-background">
        <MechanicBackground />
        <section className="relative z-10 pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm border border-gray-800 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span>Premium Service Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight drop-shadow-sm">
              Precision Care <br /> For Your Car.
            </h1>
            <p className="text-lg md:text-xl text-primary max-w-lg leading-relaxed font-medium">
              Experience the mechanical atelier. Reliable, affordable, and expert services delivered straight to your driveway or at our luxury workshop.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <BorderGlow
                edgeSensitivity={20}
                glowColor="0 80 60"
                backgroundColor="#c0392b"
                borderRadius={12}
                glowRadius={40}
                glowIntensity={2.2}
                coneSpread={35}
                animated
                loop
                colors={['#c0392b', '#e74c3c', '#ff6b6b']}
              >
                <Link to="/book" className="block bg-accent text-white px-8 py-4 rounded-card font-bold hover:bg-red-700 transition-all text-lg text-center border border-accent">
                  Book a Service
                </Link>
              </BorderGlow>
              <BorderGlow
                edgeSensitivity={20}
                glowColor="0 0 80"
                backgroundColor="#f5f5f5"
                borderRadius={12}
                glowRadius={40}
                glowIntensity={1.8}
                coneSpread={35}
                animated
                loop
                colors={['#94a3b8', '#cbd5e1', '#e2e8f0']}
              >
                <a href="#services" className="block px-8 py-4 rounded-card font-bold text-primary bg-background border border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-all text-lg text-center shadow-sm">
                  Explore Options
                </a>
              </BorderGlow>
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
      </div>

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
              { id: 0, name: 'Engine Diagnostics', description: 'Advanced computer scanning, error code resolution, and mechanical performance tuning.', price: '2199', addons: [] },
              { id: 0, name: 'Master Car Wash', description: 'Exterior foam detailing, interior vacuuming, dashboard polishing, and tire dressing.', price: '899', addons: [] }
            ]).map((service, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              return (
                <BorderGlow
                  key={idx}
                  edgeSensitivity={33}
                  glowColor="0 80 60"
                  backgroundColor="#1a1a1a"
                  borderRadius={16}
                  glowRadius={48}
                  glowIntensity={2.0}
                  coneSpread={28}
                  animated
                  loop
                  colors={['#c0392b', '#e74c3c', '#ff6b6b']}
                >
                  <Link to={service.id ? `/services/${service.id}` : '/book'} className="p-8 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden block">
                    {(service.popular || idx === 1) && (
                      <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-lg">POPULAR</div>
                    )}
                    <div className="bg-[#2A2A2A] w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors border border-gray-700">
                      <Icon className="h-7 w-7 text-silver group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-silver mb-4 leading-relaxed">{service.description}</p>
                    {service.addons?.length > 0 && (
                      <p className="text-xs text-accent font-bold mb-3">{service.addons.length} add-ons available</p>
                    )}
                    <div className="text-accent font-bold text-lg">Starts at ₹{parseFloat(service.price).toLocaleString()}</div>
                  </Link>
                </BorderGlow>
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
                <BorderGlow
                  key={step.num}
                  edgeSensitivity={33}
                  glowColor="0 80 60"
                  backgroundColor="#2A2A2A"
                  borderRadius={16}
                  glowRadius={48}
                  glowIntensity={2.0}
                  coneSpread={28}
                  animated
                  loop
                  colors={['#c0392b', '#e74c3c', '#ff6b6b']}
                >
                  <div className="p-6">
                    <div className="text-3xl font-black text-accent mb-4">{step.num}</div>
                    <h4 className="text-xl font-bold mb-2 text-white">{step.title}</h4>
                    <p className="text-silver opacity-90">{step.desc}</p>
                  </div>
                </BorderGlow>
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

          <TestimonialsCard 
            items={[
              { 
                id: 1, 
                title: 'Rahul Sharma', 
                role: 'BMW 3 Series Owner', 
                description: "Absolutely incredible service! The mechanic arrived on time, was extremely professional, and my car has never run smoother. I've recommended AutoCare to everyone I know.", 
                stars: 5,
                image: 'https://i.pravatar.cc/250?img=11'
              },
              { 
                id: 2, 
                title: 'Priya Patel', 
                role: 'Honda City Owner', 
                description: "The convenience of at-home service is a game changer. No more wasting weekends at the workshop. The team was thorough and transparent with pricing. Will definitely use again!", 
                stars: 5,
                image: 'https://i.pravatar.cc/250?img=5'
              },
              { 
                id: 3, 
                title: 'Vikram Singh', 
                role: 'Toyota Fortuner Owner', 
                description: "I was skeptical at first, but the quality exceeded my expectations. The diagnostic report was very detailed and the oil change was done in under 40 minutes. Premium service at fair prices.", 
                stars: 4,
                image: 'https://i.pravatar.cc/250?img=12'
              }
            ]} 
            autoPlay={true}
            autoPlayInterval={4000}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">Have questions about our services? Need a custom quote for your fleet? We're here to help.</p>
              <div className="space-y-6 mb-10">
                <div className="group flex items-center space-x-4 cursor-pointer">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:shadow-[0_4px_20px_rgb(192,57,43,0.4)] transition-all duration-300 group-hover:-translate-y-1">
                    <MapPin className="text-accent group-hover:text-white transition-colors" size={22} />
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform">
                    <p className="font-bold text-primary text-sm">Visit Us</p>
                    <p className="text-gray-500 text-sm group-hover:text-gray-800 transition-colors">123 AutoCare Lane, Mechanical District, Auto City</p>
                  </div>
                </div>
                <div className="group flex items-center space-x-4 cursor-pointer">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:shadow-[0_4px_20px_rgb(192,57,43,0.4)] transition-all duration-300 group-hover:-translate-y-1">
                    <Phone className="text-accent group-hover:text-white transition-colors" size={22} />
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform">
                    <p className="font-bold text-primary text-sm">Call Us</p>
                    <p className="text-gray-500 text-sm group-hover:text-gray-800 transition-colors">+91 98765 43210</p>
                  </div>
                </div>
                <div className="group flex items-center space-x-4 cursor-pointer">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:shadow-[0_4px_20px_rgb(192,57,43,0.4)] transition-all duration-300 group-hover:-translate-y-1">
                    <Mail className="text-accent group-hover:text-white transition-colors" size={22} />
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform">
                    <p className="font-bold text-primary text-sm">Email Us</p>
                    <p className="text-gray-500 text-sm group-hover:text-gray-800 transition-colors">support@autocare.com</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-64 rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-duration-300 relative group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors pointer-events-none z-10"></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.936085521448!2d72.82779893527236!3d19.075422699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c97f346053b7%3A0xacf72f56793d190a!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.5) opacity(0.9)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <BorderGlow
              edgeSensitivity={50}
              glowColor="180 10 50"
              backgroundColor="#111111"
              borderRadius={49}
              glowRadius={78}
              glowIntensity={2.2}
              coneSpread={50}
              animated
              loop
              colors={['#1f2937', '#374151', '#4b5563']}
            >
              <div className="p-8">
                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you shortly.'); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-[#1c1c1c] text-sm text-gray-200 border border-[#2a2a2a] rounded-lg p-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all outline-none placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                    <input type="tel" required placeholder="+91 98765 43210" className="w-full bg-[#1c1c1c] text-sm text-gray-200 border border-[#2a2a2a] rounded-lg p-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all outline-none placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Car Model</label>
                    <input type="text" required placeholder="BMW 3 Series" className="w-full bg-[#1c1c1c] text-sm text-gray-200 border border-[#2a2a2a] rounded-lg p-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all outline-none placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type of Service</label>
                    <select required defaultValue="" className="w-full bg-[#1c1c1c] text-sm text-gray-200 border border-[#2a2a2a] rounded-lg p-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all outline-none appearance-none cursor-pointer">
                      <option value="" disabled hidden>Select a service...</option>
                      <option value="Premium Oil Change" className="bg-[#1c1c1c]">Premium Oil Change</option>
                      <option value="Engine Diagnostics" className="bg-[#1c1c1c]">Engine Diagnostics</option>
                      <option value="Master Car Wash" className="bg-[#1c1c1c]">Master Car Wash</option>
                      <option value="Brake Pad Replacement" className="bg-[#1c1c1c]">Brake Pad Replacement</option>
                      <option value="Annual General Service" className="bg-[#1c1c1c]">Annual General Service</option>
                      <option value="Other" className="bg-[#1c1c1c]">Other / Custom Query</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea rows="4" required placeholder="Type your message here" className="w-full bg-[#1c1c1c] text-sm text-gray-200 border border-[#2a2a2a] rounded-lg p-3 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all outline-none resize-none placeholder:text-gray-600" />
                  </div>
                  <button type="submit" className="bg-[#27272a] text-sm text-gray-200 px-6 py-2.5 rounded-md font-medium hover:bg-[#3f3f46] transition-colors border border-gray-700">
                    Submit
                  </button>
                </form>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
