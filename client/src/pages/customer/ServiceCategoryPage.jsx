import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BorderGlow from '../../components/BorderGlow';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const ServiceCategoryPage = () => {
  const { categoryName } = useParams();
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const serviceIcons = [Droplets, Settings, CheckCircle, Wrench, Shield, Clock];

  const hardcodedData = {
    'car services': [
      { name: 'Logbook Service', description: 'The convenient way to maintain your new car warranty.', price: 249 },
      { name: 'Yearly Service', description: 'Extend the life of your vehicle without the hassle of a garage.', price: 189 },
      // { name: '3 Year Service', description: 'Comprehensive 3-year maintenance milestone check.', price: 229 },
      // { name: '6 Year Service', description: 'Major 6-year maintenance milestone service.', price: 269 },
      // { name: 'Pink Slip', description: 'Roadworthiness inspection report required for registration.', price: 55 },
      // { name: 'Ultimate Service', description: 'Give your car the birthday it deserves. Our most comprehensive service.', price: 349 },
      { name: 'Pre-purchase Inspection', description: 'Drive away confident. Book a roadworthiness report by a qualified mechanic.', price: 149 }
    ],
    'repairs': [
      { name: 'Car Battery', description: 'Every AutoCare van stocks the highest quality battery brands.', price: 199 },
      { name: 'Brakes', description: 'Quality brake repairs to keep you safe on the road.', price: 220 },
      { name: 'Alternator', description: 'Alternator testing and replacement services.', price: 350 },
      { name: 'Starter Motor', description: 'Complete diagnostics and fitting for starter motors.', price: 280 },
      { name: 'Timing System', description: 'Timing belt and water pump replacements.', price: 450 },
      { name: 'Cooling System', description: 'Radiator testing, water pump repairs, and cooling flushes.', price: 180 },
      { name: 'Car Air-Conditioning', description: 'Air-con re-gas and general climate control repairs.', price: 169 },
      { name: 'Drive Belt', description: 'Inspection and replacement of drive and serpentine belts.', price: 120 },
      { name: 'Clutch', description: 'Clutch replacements and diagnostic services.', price: 650 },
      { name: 'Fuel System', description: 'Injection cleaning, fuel pumps, and system repairs.', price: 210 },
      { name: 'CV Shaft', description: 'CV joint and drive shaft repairs for smoother driving.', price: 300 }
    ],
    'tyres': [
      // { name: 'Flat Tyre Service', description: 'Puncture repair and professional tyre fitment wherever it suits you!', price: 110 },
      // { name: 'Bridgestone tyres', description: 'Supply and fit of premium Bridgestone tyres.', price: 199 },
      // { name: 'Firestone tyres', description: 'Dependable and durable Firestone tyre installations.', price: 145 },
      // { name: 'Dayton tyres', description: 'Affordable Dayton tyres supplied and expertly fitted.', price: 125 }
    ]
  };

  const formattedCategory = categoryName.replace(/-/g, ' ').toLowerCase();
  const services = dbServices.length > 0 ? dbServices : (hardcodedData[formattedCategory] || []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/services');
        const formattedCategory = categoryName.replace(/-/g, ' ');
        const filtered = data.data.filter(s => s.category?.name?.toLowerCase() === formattedCategory || (!s.category && formattedCategory === 'car services'));
        const finalServices = filtered.length > 0 ? filtered : data.data.filter(s => s.categoryName?.toLowerCase() === formattedCategory);
        if (finalServices.length > 0) setDbServices(finalServices);
      } catch (error) {
        console.error("Failed to load DB category services, falling back to static", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryName]);

  const displayName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4 capitalize">
            {displayName}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore our professional {displayName.toLowerCase()} delivered directly to you.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            No services currently listed under {displayName}. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              return (
                <BorderGlow
                  key={service.id || idx}
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
                  <Link to={service.id ? `/services/${service.id}` : '/book'} className="p-8 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden block h-full flex flex-col">
                    <div className="bg-[#2A2A2A] w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors border border-gray-700">
                      <Icon className="h-7 w-7 text-silver group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-silver mb-8 leading-relaxed flex-grow">{service.description}</p>
                    <div className="mt-auto">
                      {service.addons?.length > 0 && (
                        <p className="text-xs text-accent font-bold mb-2">{service.addons.length} add-ons available</p>
                      )}
                      <div className="text-accent font-bold text-lg">Starts at ${parseFloat(service.price).toLocaleString()}</div>
                    </div>
                  </Link>
                </BorderGlow>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCategoryPage;
