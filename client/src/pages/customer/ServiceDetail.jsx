import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Wrench, Plus, Star, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get('/services');
        const found = data.data.find(s => s.id === parseInt(id));
        setService(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Service Not Found</h2>
            <Link to="/" className="text-accent font-semibold hover:underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        {/* Service Header */}
        <div className="bg-white rounded-card p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">{service.category?.name || 'Service'}</span>
                <span className="text-xs text-gray-400 flex items-center"><Clock size={12} className="mr-1" />{service.duration_mins} minutes</span>
              </div>
              <h1 className="text-3xl font-extrabold text-primary mb-3">{service.name}</h1>
              <p className="text-gray-600 leading-relaxed max-w-xl">{service.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 font-bold uppercase">Starting from</p>
              <p className="text-4xl font-black text-accent">${parseFloat(service.price).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Add-ons Section */}
        {service.addons?.length > 0 && (
          <div className="bg-white rounded-card p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-extrabold text-primary mb-2">Available Add-ons</h2>
            <p className="text-sm text-gray-500 mb-6">Enhance your service with these optional upgrades.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.addons.map(addon => (
                <div key={addon.id} className="border border-gray-200 rounded-card p-4 flex items-center justify-between hover:border-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Plus size={16} className="text-accent" />
                    </div>
                    <span className="font-semibold text-gray-700">{addon.name}</span>
                  </div>
                  <span className="font-bold text-accent">+ ${parseFloat(addon.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Included */}
        <div className="bg-white rounded-card p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-extrabold text-primary mb-4">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Certified professional mechanic',
              'Genuine OEM parts & fluids',
              'Doorstep convenience',
              '30-day service warranty',
              'Digital inspection report',
              'Post-service health check'
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-gray-600">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button onClick={() => navigate('/book')}
            className="bg-primary text-white px-10 py-4 rounded-btn font-bold text-lg hover:bg-accent transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Book This Service — ${parseFloat(service.price).toLocaleString()}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
