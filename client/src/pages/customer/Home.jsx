import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white">
      {/* Navigation (Glassmorphism) */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 text-primary">
              <Wrench size={32} className="text-accent" />
              <span className="font-extrabold text-2xl tracking-tight">AutoCare</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-primary font-medium transition-colors">Services</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary font-medium transition-colors">Reviews</a>
            </div>
            <div className="flex space-x-4 items-center">
              <Link to="/auth/login" className="text-primary font-semibold hover:text-accent transition-colors">Log in</Link>
              <Link to="/book" className="bg-primary text-white px-6 py-2.5 rounded-btn font-semibold hover:bg-accent transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section (Asymmetrical with generous spacing) */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-accent px-4 py-2 rounded-full font-semibold text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span>Premium At-Home Service Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight">
            Precision Care <br /> For Your Car.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
            Experience the mechanical atelier. Reliable, affordable, and expert services delivered straight to your driveway or at our luxury workshop.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/book" className="bg-primary text-white px-8 py-4 rounded-card font-bold hover:bg-accent transition-all text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(37,99,168,0.3)] text-center">
              Book a Service
            </Link>
            <a href="#services" className="px-8 py-4 rounded-card font-bold text-primary bg-white border border-gray-200 hover:border-accent hover:text-accent transition-all text-lg text-center shadow-sm">
              Explore Options
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 mt-16 lg:mt-0 relative w-full">
          {/* Decorative Background Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-accent/20 to-primary/5 rounded-full blur-3xl -z-10"></div>

          <div className="relative">
            <img
              src="https://github.com/param20h/datasets/blob/main/home.png?raw=true"
              alt="Pristine Car Engine"
              className="rounded-2xl shadow-2xl object-cover h-[400px] md:h-[600px] w-full transform -rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white"
            />
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-100">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Certified Mechanics</p>
                <p className="font-bold text-primary text-xl">100% Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Surface logic, no strict borders) */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Our Expertise</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We treat every vehicle as a masterpiece. Select from our core maintenance pillars below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-background rounded-card p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors">
                <Droplets className="h-7 w-7 text-accent group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Premium Oil Change</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Full synthetic fluid replacement, comprehensive filter change, and a 20-point health inspection.</p>
              <div className="text-accent font-bold text-lg">Starts at ₹1,499</div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-background rounded-card p-8 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors">
                <Settings className="h-7 w-7 text-accent group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Engine Diagnostics</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Advanced computer scanning, error code resolution, and mechanical performance tuning.</p>
              <div className="text-accent font-bold text-lg">Starts at ₹2,199</div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-background rounded-card p-8 group hover:-translate-y-2 transition-all duration-300">
              <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors">
                <CheckCircle className="h-7 w-7 text-accent group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Master Car Wash</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Exterior foam detailing, interior vacuuming, dashboard polishing, and tire dressing.</p>
              <div className="text-accent font-bold text-lg">Starts at ₹899</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Effortless Process.</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">We have removed all friction from auto maintenance so you can focus on the drive.</p>
              <Link to="/book" className="bg-white text-primary px-8 py-3 rounded-btn font-bold hover:bg-gray-100 transition shadow-lg">
                Start Booking
              </Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-card">
                <div className="text-3xl font-black text-accent mb-4">01</div>
                <h4 className="text-xl font-bold mb-2">Select Service</h4>
                <p className="text-blue-100 opacity-90">Choose your car's needs from our curated catalog.</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-card">
                <div className="text-3xl font-black text-accent mb-4">02</div>
                <h4 className="text-xl font-bold mb-2">Pick a Time</h4>
                <p className="text-blue-100 opacity-90">Select a convenient 2-hour slot for our mechanics.</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-card">
                <div className="text-3xl font-black text-accent mb-4">03</div>
                <h4 className="text-xl font-bold mb-2">We Arrive</h4>
                <p className="text-blue-100 opacity-90">Our fully-equipped van arrives at your doorstep.</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-card">
                <div className="text-3xl font-black text-accent mb-4">04</div>
                <h4 className="text-xl font-bold mb-2">Drive Happy</h4>
                <p className="text-blue-100 opacity-90">Secure payment, instant invoice, and pure performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4 opacity-50">
            <Wrench size={24} />
            <span className="font-bold text-lg">AutoCare</span>
          </div>
          <p>© 2026 AutoCare Professional Services. Designed with Velocity Blue.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
