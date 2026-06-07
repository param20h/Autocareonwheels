import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BorderGlow from '../../components/BorderGlow';
import { Wrench, Droplets, Settings, CheckCircle, Shield, Clock, ArrowLeft, Search, Star, Truck, Phone } from 'lucide-react';
import api from '../../api/axios';

const TYRE_BRANDS = [
  'Accelera', 'Achilles', 'Atturo', 'BF Goodrich', 'Bridgestone',
  'Comforser', 'Continental', 'Double Star', 'Federal', 'Firestone',
  'General', 'Goodyear', 'Grenlander', 'Haida', 'Hankook',
  'Headway', 'Kumho', 'Lanvigator', 'Lionhart', 'Maxxis',
  'Michelin', 'Mickey Thompson', 'Nankang', 'Nexen', 'Pirelli',
  'Roadclaw', 'Roadstone', 'Sumitomo', 'Toyo', 'Windforce',
  'Winrun', 'Yokohama',
];

const TYRE_WIDTHS = ['155', '165', '175', '185', '195', '205', '215', '225', '235', '245', '255', '265', '275', '285', '295', '305', '315', '325', '335'];
const TYRE_PROFILES = ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80'];
const RIM_SIZES = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '24'];

const BUSINESS_PHONE = '0427563913';

const TyreSizeSearch = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState('');
  const [profile, setProfile] = useState('');
  const [rim, setRim] = useState('');

  const handleSearch = () => {
    if (!width || !profile || !rim) return;
    // Pass tyre size in URL so booking skips Step 2
    navigate(`/book?service=5&step=3&tw=${width}&tp=${profile}&tr=${rim}`);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-10 sm:mb-12 shadow-xl">
      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5">Find Your Tyre Size</h2>
      <p className="text-white/70 text-xs sm:text-sm mb-5">Select your tyre dimensions to find the right fit for your vehicle</p>

      {/* Live size preview */}
      <div className="bg-white/10 rounded-xl p-3 sm:p-4 mb-5 text-center">
        <p className="text-white font-mono text-xl sm:text-2xl font-bold tracking-widest">
          <span className={`transition-colors ${width ? 'text-yellow-300' : 'text-white/40'}`}>{width || '205'}</span>
          <span className="text-white/50">/</span>
          <span className={`transition-colors ${profile ? 'text-green-300' : 'text-white/40'}`}>{profile || '55'}</span>
          <span className="text-white/50"> R</span>
          <span className={`transition-colors ${rim ? 'text-blue-300' : 'text-white/40'}`}>{rim || '16'}</span>
        </p>
        <div className="flex justify-center gap-4 sm:gap-8 mt-2 text-xs">
          <span className="text-yellow-300/80">Width (mm)</span>
          <span className="text-green-300/80">Profile (%)</span>
          <span className="text-blue-300/80">Rim (inch)</span>
        </div>
      </div>

      {/* Dropdowns — 1 col on tiny phones, 3 col from sm up */}
      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-white/80 text-xs font-bold mb-1.5 uppercase tracking-wide">Width (mm)</label>
          <select value={width} onChange={e => setWidth(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-3.5 sm:py-3 focus:outline-none focus:border-white font-bold text-center text-base sm:text-sm">
            <option value="">Select --</option>
            {TYRE_WIDTHS.map(w => <option key={w} value={w} className="text-black">{w}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/80 text-xs font-bold mb-1.5 uppercase tracking-wide">Profile (%)</label>
          <select value={profile} onChange={e => setProfile(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-3.5 sm:py-3 focus:outline-none focus:border-white font-bold text-center text-base sm:text-sm">
            <option value="">Select --</option>
            {TYRE_PROFILES.map(p => <option key={p} value={p} className="text-black">{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/80 text-xs font-bold mb-1.5 uppercase tracking-wide">Rim (inch)</label>
          <select value={rim} onChange={e => setRim(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-3 py-3.5 sm:py-3 focus:outline-none focus:border-white font-bold text-center text-base sm:text-sm">
            <option value="">Select --</option>
            {RIM_SIZES.map(r => <option key={r} value={r} className="text-black">R{r}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleSearch}
        className={`w-full py-4 rounded-xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${width && profile && rim
            ? 'bg-white text-primary active:scale-95 hover:shadow-xl hover:-translate-y-0.5'
            : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}>
        <Search size={20} />
        {width && profile && rim ? `Get a Quote — ${width}/${profile} R${rim}` : 'Select all 3 dimensions above'}
      </button>
      <p className="text-white/50 text-xs text-center mt-3">Or call us directly for same-day fitment</p>
      <a href={`tel:${BUSINESS_PHONE}`}
        className="flex items-center justify-center gap-2 mt-3 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-bold py-3 rounded-xl transition-all">
        📞 Call Now — {BUSINESS_PHONE}
      </a>
    </div>
  );
};

const TrustBadges = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
    {[
      { icon: Truck, title: 'Mobile Fitment', desc: 'We come to you' },
      { icon: Star, title: 'Top Brands', desc: '30+ premium brands' },
      { icon: Shield, title: 'Warranty', desc: 'All tyres warranted' },
      { icon: Phone, title: 'Same Day', desc: 'Call for availability' },
    ].map(({ icon: Icon, title, desc }) => (
      <div key={title} className="bg-[#1a1a1a] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center hover:border-accent transition-colors">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Icon size={20} className="text-accent" />
        </div>
        <p className="font-bold text-white text-xs sm:text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5 hidden sm:block">{desc}</p>
      </div>
    ))}
  </div>
);

const FlatTyreCTA = () => (
  <div className="bg-[#1a1a1a] border border-accent/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-10 sm:mb-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
      <Wrench size={28} className="text-accent" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">Flat Tyre Emergency?</h3>
      <p className="text-gray-400 text-sm">Got a flat right now? Our mobile mechanics come to you — on the road, at home, or at work.</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
      <a href="tel:0427563913"
        className="w-full sm:w-auto bg-green-600 hover:bg-green-500 active:scale-95 text-white px-6 py-3.5 rounded-xl font-bold transition-all text-center">
        📞 Call Now
      </a>
      <Link to="/book?service=5&step=2"
        className="w-full sm:w-auto bg-accent text-white px-6 py-3.5 rounded-xl font-bold hover:bg-accent/90 active:scale-95 transition-all text-center">
        Book Online
      </Link>
    </div>
  </div>
);

// Map brand name → image filename in /brands/
const BRAND_IMAGES = {
  'Accelera': 'accelera.png',
  'Achilles': 'achilles.png',
  'Atturo': 'atturo.png',
  'BF Goodrich': 'bf-goodrich.png',
  'Bridgestone': 'bridgestone.png',
  'Comforser': 'comforser.png',
  'Continental': 'continental.png',
  'Double Star': 'doublestar.png',
  'Federal': 'federal.png',
  'Firestone': 'firestone.png',
  'General': 'general-tire.png',
  'Goodyear': 'goodyear.png',
  'Grenlander': 'grenlander.png',
  'Haida': 'haida.png',
  'Hankook': 'hankook.png',
  'Headway': 'headway.png',
  'Kumho': 'kumho.png',
  'Lanvigator': 'lanvigator.png',
  'Lionhart': 'lionhart.png',
  'Maxxis': 'maxxis.png',
  'Michelin': 'michelin.png',
  'Mickey Thompson': 'mickey-thompson.png',
  'Nankang': 'nankang.png',
  'Nexen': 'nexen.png',
  'Pirelli': 'pirelli.png',
  'Roadclaw': 'roadclaw.png',
  'Roadstone': 'roadstone.png',
  'Sumitomo': 'sumitomo.png',
  'Toyo': 'toyo.png',
  'Windforce': 'windforce.png',
  'Winrun': 'winrun.png',
  'Yokohama': 'yokohama.png',
};

const BrandLogoGrid = () => (
  <div className="mb-12">
    <h2 className="text-xl sm:text-2xl font-extrabold text-black mb-2">Brands We Supply &amp; Fit</h2>
    <p className="text-gray-500 text-sm mb-6">We source and install tyres from all major brands at your location.</p>
    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
      {TYRE_BRANDS.map(brand => {
        const imgFile = BRAND_IMAGES[brand];
        return (
          <div key={brand}
            className="bg-white border border-gray-200 hover:border-accent rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer group min-h-[72px]">
            {imgFile ? (
              <img
                src={`/brands/${imgFile}`}
                alt={brand}
                className="h-8 sm:h-10 w-auto object-contain max-w-full grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
              />
            ) : null}
            <span
              className="text-gray-500 group-hover:text-primary text-[9px] sm:text-[10px] font-bold text-center leading-tight transition-colors"
              style={imgFile ? { display: 'none' } : {}}
            >{brand}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const ServiceCategoryPage = () => {
  const { categoryName } = useParams();
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const serviceIcons = [Droplets, Settings, CheckCircle, Wrench, Shield, Clock];

  const hardcodedData = {
    'car services': [
      { name: 'Logbook Service', description: 'The convenient way to maintain your new car warranty.', price: 249 },
      { name: 'Yearly Service', description: 'Extend the life of your vehicle without the hassle of a garage.', price: 189 },
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
    'tyres': []
  };

  const formattedCategory = categoryName.replace(/-/g, ' ').toLowerCase();
  const isTyres = formattedCategory === 'tyres';
  const services = dbServices.length > 0 ? dbServices : (hardcodedData[formattedCategory] || []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        if (!isTyres) {
          const { data } = await api.get('/services');
          const filtered = data.data.filter(s =>
            s.category?.name?.toLowerCase() === formattedCategory ||
            (!s.category && formattedCategory === 'car services')
          );
          const finalServices = filtered.length > 0
            ? filtered
            : data.data.filter(s => s.categoryName?.toLowerCase() === formattedCategory);
          if (finalServices.length > 0) setDbServices(finalServices);
        }
      } catch (error) {
        console.error('Failed to load DB category services, falling back to static', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [categoryName, isTyres, formattedCategory]);

  const displayName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Dynamic SEO per category
  useEffect(() => {
    const titles = {
      tyres: 'Tyre Supply & Fitting Canberra | AutoCare on Wheels — 30+ Brands',
      'car services': 'Car Servicing Canberra | Logbook & Yearly Service | AutoCare on Wheels',
      repairs: 'Mobile Car Repairs Canberra | Brakes, Battery, Alternator | AutoCare on Wheels',
    };
    const descs = {
      tyres: 'Buy and fit tyres in Canberra from 30+ brands including Michelin, Bridgestone and Pirelli. We come to you — mobile tyre fitting service in ACT & Queanbeyan.',
      'car services': 'Logbook services, yearly car servicing and pre-purchase inspections in Canberra. Qualified mobile mechanics who come to your home or workplace.',
      repairs: 'Mobile car repairs in Canberra — brakes, batteries, alternators, air conditioning and more. Same-day appointments available. Call 0427563913.',
    };
    document.title = titles[formattedCategory] || `${displayName} | AutoCare on Wheels Canberra`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', descs[formattedCategory] || `Professional ${displayName.toLowerCase()} in Canberra and Queanbeyan by AutoCare on Wheels.`);
  }, [formattedCategory, displayName]);

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-4 capitalize">{displayName}</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {isTyres
              ? 'Supply and fit of premium tyres from 30+ top brands — delivered and installed at your location.'
              : `Explore our professional ${displayName.toLowerCase()} delivered directly to you.`}
          </p>
        </div>

        {isTyres ? (
          <>
            <TyreSizeSearch />
            <TrustBadges />
            <FlatTyreCTA />
            <BrandLogoGrid />
          </>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            No services currently listed under {displayName}. Check back soon!
          </div>
        ) : (
          <>
            <TrustBadges />
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
                  <Link to={service.id ? `/book?service=${service.id}` : '/book'}
                    className="p-8 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden block h-full flex flex-col">
                    <div className="bg-[#2A2A2A] w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:bg-accent transition-colors border border-gray-700">
                      <Icon className="h-7 w-7 text-silver group-hover:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-silver mb-8 leading-relaxed flex-grow">{service.description}</p>
                    <div className="mt-auto">
                      {service.addons?.length > 0 && (
                        <p className="text-xs text-accent font-bold mb-2">{service.addons.length} add-ons available</p>
                      )}
                      <div className="text-accent font-bold text-lg">Book a Quote →</div>
                    </div>
                  </Link>
                </BorderGlow>
              );
            })}
          </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCategoryPage;
