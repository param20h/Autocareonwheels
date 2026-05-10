import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, Star, MapPin, Phone, Mail, Send, Truck, ShieldCheck } from 'lucide-react';
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
    document.title = 'AutoCare on Wheels | Mobile Mechanic Canberra & Queanbeyan';
    api.get('/services').then(({ data }) => setServices(data.data || [])).catch(() => { });
  }, []);

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-background">
        <MechanicBackground />
        <section className="relative z-10 pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
          <div className="lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm border border-gray-800 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span>Premium Service Available</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight drop-shadow-sm">
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
                backgroundColor="#8d7c7c"
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

          <div className="lg:w-1/2 mt-10 lg:mt-0 relative w-full hidden sm:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-accent/20 to-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="relative">
              <img
                src="/van.png"
                alt="AutoCare on Wheels — Mobile Mechanic Van serving Canberra"
                className="rounded-2xl object-cover h-[400px] md:h-[520px] w-full transform -rotate-2 hover:rotate-1 transition-transform duration-500"
              />
              <div className="absolute -bottom-1 -left-1 bg-primary p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-800 -rotate-2 hover:rotate-2 transition-transform duration-500">
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

      {/* Services Grid */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Our Expertise</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We treat every vehicle as a masterpiece. Select from our core maintenance pillars given below.</p>
          </div>

          {/* ===== FEATURED TYRES BANNER ===== */}
          <div className="mb-8">
            <BorderGlow
              edgeSensitivity={25}
              glowColor="0 80 60"
              backgroundColor="#0f0f0f"
              borderRadius={20}
              glowRadius={60}
              glowIntensity={2.5}
              coneSpread={40}
              animated
              loop
              colors={['#c0392b', '#e74c3c', '#ff6b6b']}
            >
              <Link to="/services/category/tyres"
                className="group relative block overflow-hidden rounded-[20px] min-h-[220px] sm:min-h-[200px]">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent group-hover:from-accent/30 transition-all duration-500" />
                {/* Tyre circle decoration */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full border-[6px] border-accent/30 group-hover:border-accent/60 transition-colors duration-500 flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[4px] border-accent/20 group-hover:border-accent/50 transition-colors duration-500 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                  </div>
                </div>
                {/* Content */}
                <div className="relative z-10 p-8 sm:p-10 pr-36 sm:pr-52">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Featured Service
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Tyre Supply &amp; Fitment</h3>
                  <p className="text-gray-400 text-base sm:text-lg max-w-lg leading-relaxed mb-5">
                    Flat, worn, or time for an upgrade? We bring 30+ premium brands <span className="text-accent font-bold">straight to your door</span> — supply and fit included.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold text-sm group-hover:bg-red-700 transition-colors">
                    Find Your Tyre Size →
                  </span>
                </div>
              </Link>
            </BorderGlow>
          </div>



          {/* ===== Car Services + Repairs — same featured card style ===== */}
          <div className="flex flex-col gap-6">
            {[
              {
                title: 'Car Services',
                link: '/services/category/car-services',
                badge: 'Logbook & Yearly',
                desc: 'Logbook servicing, yearly maintenance, pre-purchase inspections and diagnostic checks — all at your door.',
                cta: 'Explore Car Services →',
                icon: Settings,
                accent: '#1a2a1a',
                circle: 'border-green-500/30 group-hover:border-green-400/60',
                inner: 'border-green-500/20 group-hover:border-green-400/50',
                iconCls: 'text-green-400/60 group-hover:text-green-400',
                badgeCls: 'bg-green-600',
                gradient: 'from-green-900/30 via-transparent to-transparent group-hover:from-green-800/40',
              },
              {
                title: 'Repairs',
                link: '/services/category/repairs',
                badge: 'Brakes · Battery · More',
                desc: 'Expert troubleshooting and repairs for brakes, batteries, alternators, air conditioning and engine components.',
                cta: 'Explore Repairs →',
                icon: Wrench,
                accent: '#1a1a2a',
                circle: 'border-blue-500/30 group-hover:border-blue-400/60',
                inner: 'border-blue-500/20 group-hover:border-blue-400/50',
                iconCls: 'text-blue-400/60 group-hover:text-blue-400',
                badgeCls: 'bg-blue-600',
                gradient: 'from-blue-900/30 via-transparent to-transparent group-hover:from-blue-800/40',
              },
            ].map((cat) => (
              <BorderGlow
                key={cat.title}
                edgeSensitivity={40}
                glowColor="0 80 60"
                backgroundColor="#1a1a1a"
                borderRadius={20}
                glowRadius={60}
                glowIntensity={2.0}
                coneSpread={40}
                animated
                loop
                colors={['#c0392b', '#e74c3c', '#ff6b6b']}
              >
                <Link to={cat.link}
                  className="group relative block overflow-hidden rounded-[20px] min-h-[180px] sm:min-h-[160px]">
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a] via-[#1a1a1a] to-[#0f0f0f]" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-all duration-500`} />
                  {/* Decorative circle */}
                  <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-28 h-28 sm:h-36 sm:w-36 rounded-full border-[6px] ${cat.circle} transition-colors duration-500 flex items-center justify-center`}>
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full border-[4px] ${cat.inner} transition-colors duration-500 flex items-center justify-center`}>
                      <cat.icon className={`w-7 h-7 sm:w-10 sm:h-10 ${cat.iconCls} transition-colors duration-300`} />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="relative z-10 p-7 sm:p-9 pr-36 sm:pr-48">
                    <span className={`inline-flex items-center gap-1.5 ${cat.badgeCls} text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      {cat.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">{cat.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed mb-4">{cat.desc}</p>
                    <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-bold text-sm transition-colors">
                      {cat.cta}
                    </span>
                  </div>
                </Link>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">How It Works.</h2>
              <p className="text-silver text-lg leading-relaxed mb-8">It's easy to book a professional mobile mechanic that comes to you.</p>
              <Link to="/book" className="bg-accent text-white px-8 py-3 rounded-btn font-bold hover:bg-red-700 border border-accent transition shadow-lg inline-block">
                Start Booking
              </Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { num: '01', title: 'Tell us where you are', desc: "Type in your postcode and discover a qualified mobile mechanic near you now!" },
                { num: '02', title: 'Tell us about your car', desc: 'We are able to work on a wide range of popular makes and models.' },
                { num: '03', title: 'Select a service', desc: "Even if you don't know what's wrong, we'll come to you, inspect your vehicle and supply a quote upfront." },
                { num: '04', title: 'Pick a time and place!', desc: 'Tell us where your car is and a mechanics will be with you soon.' }
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

      {/* Why AutoCare */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Why book an AutoCare on Wheels mechanic?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Discover why more Aussies are choosing us for professional car service and repairs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-primary max-w-5xl mx-auto">
            {[
              { icon: Truck, title: 'Convenient onsite service', desc: 'Qualified mechanics that do the work at your location.' },
              { icon: Clock, title: 'Same or next day appointments', desc: 'More vans on the road means we can get to your car faster!' },
              { icon: Settings, title: 'Highest quality parts and brands', desc: 'We only use the best quality parts, oils and equipment.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="mb-6 flex justify-center text-accent"><feature.icon size={56} strokeWidth={1.5} /></div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-16 border-t border-gray-200">
            <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Popular makes we proudly service</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-75">
              {['Holden', 'Honda', 'Hyundai', 'Ford', 'Kia', 'BMW', 'Mazda', 'Toyota', 'Nissan', 'Subaru', 'Suzuki'].map(make => (
                <span key={make} className="text-xl sm:text-2xl font-bold text-gray-400 hover:text-accent transition-colors cursor-pointer">{make}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials
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
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-500 leading-relaxed mb-12">Have questions about our services? Reach out directly — we're here to help.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <a href="tel:0427563913" className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors flex-shrink-0">
                <Phone className="text-accent group-hover:text-white transition-colors" size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-primary text-sm">Call Us</p>
                <p className="text-gray-500 text-sm">0427563913</p>
              </div>
            </a>

            <a href="mailto:info@autocareonwheels.com.au" className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors flex-shrink-0">
                <Mail className="text-accent group-hover:text-white transition-colors" size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-primary text-sm">Email Us</p>
                <p className="text-gray-500 text-sm">info@autocareonwheels.com.au</p>
              </div>
            </a>
          </div>

          <div className="w-full h-72 rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.936085521448!2d72.82779893527236!3d19.075422699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c97f346053b7%3A0xacf72f56793d190a!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%" height="100%"
              style={{ border: 0, filter: 'grayscale(0.3)' }}
              allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

