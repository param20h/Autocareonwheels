import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Clock,
  CheckCircle,
  Shield,
  Phone,
  ArrowLeft,
  ChevronDown,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Truck,
  Droplets,
  Settings,
  Search
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getServiceBySlug, SERVICES_DATA } from '../../data/servicesData';

const BUSINESS_PHONE = '0427563913';
const BUSINESS_PHONE_FORMATTED = '0427 563 913';

const ICON_MAP = {
  Wrench,
  Clock,
  Search,
  Shield,
  Settings,
  Droplets
};

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const service = getServiceBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!service) return;

    // Update document title & meta description
    document.title = service.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', service.metaDescription);
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.autocareonwheels.com.au/services/${service.slug}`);
    }

    // Dynamic JSON-LD (Service + FAQPage + Breadcrumbs)
    const scriptId = 'service-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `https://www.autocareonwheels.com.au/services/${service.slug}#service`,
          'name': service.title,
          'serviceType': service.shortTitle,
          'description': service.metaDescription,
          'provider': {
            '@type': 'AutoRepair',
            'name': 'AutoCare on Wheels',
            'telephone': '+61427563913',
            'url': 'https://www.autocareonwheels.com.au/',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '10 Muntz St',
              'addressLocality': 'Chisholm',
              'addressRegion': 'ACT',
              'postalCode': '2905',
              'addressCountry': 'AU'
            }
          },
          'areaServed': [
            { '@type': 'AdministrativeArea', 'name': 'Canberra, ACT' },
            { '@type': 'AdministrativeArea', 'name': 'Queanbeyan, NSW' }
          ],
          'offers': {
            '@type': 'Offer',
            'availability': 'https://schema.org/InStock',
            'url': `https://www.autocareonwheels.com.au/services/${service.slug}`
          }
        },
        {
          '@type': 'FAQPage',
          '@id': `https://www.autocareonwheels.com.au/services/${service.slug}#faq`,
          'mainEntity': service.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `https://www.autocareonwheels.com.au/services/${service.slug}#breadcrumbs`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://www.autocareonwheels.com.au/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': service.categoryName,
              'item': `https://www.autocareonwheels.com.au/services/${service.category}`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': service.shortTitle,
              'item': `https://www.autocareonwheels.com.au/services/${service.slug}`
            }
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(schemaGraph);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-36 pb-20 text-center">
          <h1 className="text-3xl font-extrabold text-primary mb-4">Service Page Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has moved.</p>
          <div className="flex justify-center gap-4">
            <Link to="/services/car-services" className="bg-accent text-white px-6 py-3 rounded-xl font-bold">
              View Car Services
            </Link>
            <Link to="/services/repairs" className="bg-[#1a1a1a] text-white border border-gray-700 px-6 py-3 rounded-xl font-bold">
              View Repairs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const ServiceIcon = ICON_MAP[service.icon] || Wrench;
  const relatedServices = SERVICES_DATA.filter(
    s => s.category === service.category && s.slug !== service.slug
  ).slice(0, 3);

  const bookingUrl = `/book?service=${service.dbId}`;

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-accent selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-32 pb-20">
        {/* Breadcrumb Navigation - readable dark text on light background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <nav className="flex items-center text-xs font-semibold text-gray-500 space-x-2 overflow-x-auto whitespace-nowrap py-1">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/services/${service.category}`} className="text-gray-600 hover:text-primary transition-colors">
              {service.categoryName}
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">{service.shortTitle}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-[#0d0d0d] border border-gray-800 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-accent/15 text-accent text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-accent/30">
                  <Truck size={14} /> Mobile Service Across Canberra &amp; ACT
                </span>
                <span className="bg-white/10 text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                  {service.categoryName}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
                {service.title}
              </h1>

              {/* Service Highlights (No Prices) */}
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 mb-8">
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Service Type</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">Mobile Onsite</span>
                </div>
                <div className="h-8 w-px bg-gray-800 hidden sm:block" />
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Duration</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">{service.duration}</span>
                </div>
                <div className="h-8 w-px bg-gray-800 hidden sm:block" />
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Location</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-green-400">At Your Door</span>
                </div>
                <div className="h-8 w-px bg-gray-800 hidden sm:block" />
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Pricing</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-accent">Free Quote</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to={bookingUrl}
                  className="bg-accent hover:bg-red-700 text-white font-extrabold text-base px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-98 text-center flex items-center justify-center gap-2 group"
                >
                  <span>Book Online Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  className="bg-green-600 hover:bg-green-500 text-white font-extrabold text-base px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-98 text-center flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  <span>Call {BUSINESS_PHONE_FORMATTED}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Column: Full Rich Content */}
            <div className="lg:col-span-8 space-y-10">

              {/* Lead Paragraphs */}
              {service.lead && service.lead.length > 0 && (
                <div className="bg-[#181818] border border-gray-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  {service.lead.map((para, i) => (
                    <p key={i} className="text-base sm:text-lg text-gray-200 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* What's Included / Highlights Box */}
              <div className="bg-gradient-to-r from-[#1c1515] to-[#161616] border border-accent/20 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Why Drivers Choose Our Canberra Mobile Service</h3>
                    <p className="text-gray-400 text-xs">Peace of mind and complete transparency on every callout</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>Manufacturer warranty protected</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>Qualified, insured mobile technicians</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>Premium OEM-spec parts &amp; oils</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>No towing or workshop waiting rooms</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>Clear upfront quote before work begins</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span>Prompt mobile service at your location</span>
                  </div>
                </div>
              </div>

              {/* Sections from Document */}
              <div className="space-y-8">
                {service.sections && service.sections.map((sec, idx) => {
                  const isCallout =
                    sec.heading.toLowerCase().includes('why choose') ||
                    sec.heading.toLowerCase().includes('can help you') ||
                    sec.heading.toLowerCase().includes('important to');

                  return (
                    <article
                      key={idx}
                      className={`rounded-2xl p-6 sm:p-8 ${
                        isCallout
                          ? 'bg-[#181818] border border-gray-800'
                          : 'bg-[#141414] border border-gray-800/60'
                      }`}
                    >
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 tracking-tight flex items-center gap-2.5">
                        <span className="w-2 h-6 bg-accent rounded-full inline-block flex-shrink-0" />
                        <span>{sec.heading}</span>
                      </h2>

                      <div className="space-y-3.5 text-gray-300 leading-relaxed text-sm sm:text-base">
                        {sec.paragraphs && sec.paragraphs.map((p, pIdx) => {
                          const isBulletLike = p.includes(': ') && p.length < 240 && !p.startsWith('http');
                          if (isBulletLike) {
                            const [bulletTitle, ...bulletRest] = p.split(': ');
                            const bulletContent = bulletRest.join(': ');
                            return (
                              <div key={pIdx} className="flex items-start gap-2.5 py-1">
                                <CheckCircle size={18} className="text-accent mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong className="text-white font-bold">{bulletTitle}: </strong>
                                  <span className="text-gray-300">{bulletContent}</span>
                                </div>
                              </div>
                            );
                          }
                          return <p key={pIdx}>{p}</p>;
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* FAQs Section */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 sm:p-8">
                  <div className="mb-6">
                    <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-1">
                      Frequently Asked Questions
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Questions About {service.shortTitle}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {service.faqs.map((faq, fIdx) => {
                      const isOpen = openFaq === fIdx;
                      return (
                        <div
                          key={fIdx}
                          className="border border-gray-800 rounded-xl overflow-hidden bg-[#1c1c1c] transition-colors"
                        >
                          <button
                            onClick={() => setOpenFaq(isOpen ? -1 : fIdx)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-white hover:text-accent transition-colors font-bold text-sm sm:text-base"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              size={18}
                              className={`flex-shrink-0 text-accent transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-gray-300 text-sm leading-relaxed border-t border-gray-800/80">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom CTA Banner */}
              <div className="bg-gradient-to-r from-accent/90 to-red-800 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                  Ready to Book Your {service.shortTitle} in Canberra?
                </h3>
                <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
                  Tell us your location and vehicle details. Our mobile workshop comes directly to your driveway or workplace.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to={bookingUrl}
                    className="bg-white text-primary hover:bg-gray-100 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    Book Online Today
                  </Link>
                  <a
                    href={`tel:${BUSINESS_PHONE}`}
                    className="bg-black/30 hover:bg-black/40 text-white font-extrabold px-8 py-3.5 rounded-xl border border-white/30 transition-transform active:scale-95 inline-flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    <span>Call {BUSINESS_PHONE_FORMATTED}</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Support Sidebar (No Prices) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Sticky Card */}
              <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6 sm:p-8 sticky top-28 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Service Quote</span>
                    <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={12} /> Mobile Service
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">Free Upfront Quote</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    Customised to your vehicle's make, model, and manufacturer specifications.
                  </p>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <Link
                    to={bookingUrl}
                    className="w-full bg-accent hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl text-center block transition-all shadow-md active:scale-98"
                  >
                    Book This Service
                  </Link>

                  <a
                    href={`tel:${BUSINESS_PHONE}`}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <Phone size={16} /> Call for Instant Quote
                  </a>

                  <Link
                    to="/contact"
                    className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl text-center block text-xs transition-colors"
                  >
                    Send an Online Enquiry
                  </Link>
                </div>

                {/* Service Specs */}
                <div className="border-t border-gray-800 pt-4 space-y-2.5 text-xs text-gray-300">
                  <div className="flex justify-between py-1 border-b border-gray-800/50">
                    <span className="text-gray-500 font-medium">Estimated Time:</span>
                    <span className="font-bold text-white">{service.duration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-800/50">
                    <span className="text-gray-500 font-medium">Service Area:</span>
                    <span className="font-bold text-white">Canberra &amp; Queanbeyan</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 font-medium">Parts &amp; Oil:</span>
                    <span className="font-bold text-white">OEM-Grade Approved</span>
                  </div>
                </div>

                {/* Service Areas Pill List */}
                <div className="border-t border-gray-800 pt-4">
                  <p className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                    Suburbs We Service
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Belconnen', 'Gungahlin', 'Tuggeranong', 'Woden', 'Weston Creek', 'Queanbeyan', 'Acton', 'Chisholm'].map(sub => (
                      <span key={sub} className="bg-white/5 text-gray-400 text-[11px] px-2.5 py-1 rounded-md">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Related Services in Same Category (No Prices) */}
              {relatedServices.length > 0 && (
                <div className="bg-[#181818] border border-gray-800 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    Other {service.categoryName}
                  </h4>
                  <div className="space-y-3">
                    {relatedServices.map(rel => (
                      <Link
                        key={rel.id}
                        to={`/services/${rel.slug}`}
                        className="block p-3 rounded-xl bg-white/5 hover:bg-accent/15 border border-transparent hover:border-accent/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm group-hover:text-accent transition-colors">
                            {rel.shortTitle}
                          </span>
                          <span className="text-xs font-bold text-gray-400 group-hover:text-accent flex items-center gap-1">
                            Details <ArrowRight size={12} />
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                          {rel.metaDescription || rel.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
