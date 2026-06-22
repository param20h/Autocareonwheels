import React, { useEffect, useState } from 'react';
import { LogOut, Calendar, CheckCircle, Clock, Settings, CarFront, Wrench, Users, Plus, Trash2, X, Save, Loader2, Sparkles, Home, Download, FilePlus2, Package, Sliders, MinusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../store/useAuth';
import api from '../../api/axios';
import bookingService from '../../services/booking.service';
import Toast from '../../components/Toast';
import SettingsTab from './Settings';

const AdminDashboard = () => {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  // Modal state for adding services/mechanics
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [useItemData, setUseItemData] = useState(null);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const { data } = await api.get('/admin/bookings');
        setBookings(data.data);
      } else if (activeTab === 'services') {
        const { data } = await api.get('/services');
        setServices(data.data);
      } else if (activeTab === 'mechanics') {
        const { data } = await api.get('/admin/mechanics');
        setMechanics(data.data);
      } else if (activeTab === 'customers') {
        const { data } = await api.get('/admin/customers');
        setCustomers(data.data);
      } else if (activeTab === 'inventory') {
        const { data } = await api.get('/inventory');
        setInventory(data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logoutAction(); navigate('/'); };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status: newStatus, notify_customer: notifyCustomer });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      setToast({ show: true, message: `Booking #${id} → ${newStatus}`, type: 'success' });
    } catch { setToast({ show: true, message: 'Failed to update', type: 'error' }); }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setToast({ show: true, message: `Booking #${id} deleted`, type: 'success' });
    } catch {
      setToast({ show: true, message: 'Failed to delete booking', type: 'error' });
    }
  };

  const handleCreateInvoice = async (id) => {
    try {
      await bookingService.createInvoice(id);
      setToast({ show: true, message: `Invoice ready for booking #${id}`, type: 'success' });
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to create invoice', type: 'error' });
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const response = await bookingService.downloadInvoice(id);
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `booking-${id}-invoice.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to download invoice', type: 'error' });
    }
  };

  const handleAddSubmit = async () => {
    try {
      if (modalType === 'service') {
        await api.post('/admin/services', modalData);
        setToast({ show: true, message: 'Service added!', type: 'success' });
      } else if (modalType === 'mechanic') {
        await api.post('/admin/mechanics', modalData);
        setToast({ show: true, message: 'Mechanic added!', type: 'success' });
      } else if (modalType === 'inventory') {
        await api.post('/inventory', modalData);
        setToast({ show: true, message: 'Part added to inventory!', type: 'success' });
      }
      setShowModal(false);
      setModalData({});
      fetchData();
    } catch { setToast({ show: true, message: 'Failed to add', type: 'error' }); }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const endpoint = type === 'inventory' ? `/inventory/${id}` : `/admin/${type}/${id}`;
      await api.delete(endpoint);
      setToast({ show: true, message: 'Deleted successfully', type: 'success' });
      fetchData();
    } catch { setToast({ show: true, message: 'Delete failed', type: 'error' }); }
  };

  const handleUseItem = async () => {
    try {
      await api.post(`/inventory/${useItemData.id}/use`, {
        quantity: useItemData.quantity,
        notes: useItemData.notes
      });
      setToast({ show: true, message: 'Stock updated successfully!', type: 'success' });
      setUseItemData(null);
      fetchData();
    } catch (error) {
      setToast({ show: true, message: error.response?.data?.message || 'Failed to update stock', type: 'error' });
    }
  };

  const getStatusColor = (s) => {
    const map = { 
      PENDING: 'bg-amber-100 text-amber-800 border-amber-200', 
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200', 
      IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200', 
      CANCELLED: 'bg-red-100 text-red-800 border-red-200' 
    };
    return map[s] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const tabs = [
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'services', label: 'Services', icon: Wrench },
    { key: 'mechanics', label: 'Mechanics', icon: Users },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'inventory', label: 'Inventory', icon: Package },
    { key: 'settings', label: 'System Settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8fa] via-[#f3f4f6] to-[#eef0f3] text-primary relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(192,57,43,0.10),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.55),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.65)_1px,transparent_1px)] [background-size:26px_26px]" />
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

      {/* Top Navbar */}
      <nav className="bg-white/70 backdrop-blur-xl h-16 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-white/80 shadow-sm">
        <div className="flex items-center space-x-3 text-primary">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/90 to-red-700/80 border border-accent/30 shadow-[0_0_18px_rgba(192,57,43,0.25)] flex items-center justify-center">
            <Settings className="text-white" size={18} />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="flex items-center text-gray-700 hover:text-primary transition-colors font-bold text-sm bg-white/80 hover:bg-white px-4 py-2 rounded-btn border border-gray-200">
            <Home size={16} className="mr-2" /> Home
          </button>
          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-primary transition-colors font-bold text-sm bg-white/80 hover:bg-white px-4 py-2 rounded-btn border border-gray-200">
            <LogOut size={16} className="mr-2" /> End Shift
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-4 relative z-10">

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Jobs', val: bookings.length, icon: Calendar },
            { label: 'Pending', val: bookings.filter(b => b.status === 'PENDING').length, icon: Clock },
            { label: 'Completed', val: bookings.filter(b => b.status === 'COMPLETED').length, icon: CheckCircle },
            { label: 'Revenue', val: `$${bookings.reduce((s, b) => s + parseFloat(b.total_price || 0), 0).toLocaleString()}`, icon: CarFront }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="relative p-5 rounded-card border border-white/70 bg-white/65 backdrop-blur-md shadow-[0_10px_30px_rgba(15,23,42,0.08)] flex items-center justify-between overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-primary">{stat.val}</p>
              </div>
              <div className="w-11 h-11 bg-accent/10 rounded-full flex items-center justify-center text-accent border border-accent/20">
                <stat.icon size={22} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/70 backdrop-blur-md rounded-card p-1.5 shadow-sm border border-white/80 mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.key ? 'text-white' : 'text-gray-600 hover:bg-white/80'
              }`}>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent to-red-700 shadow-[0_0_20px_rgba(192,57,43,0.45)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-2">
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/70 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-primary">Global Job Board</h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={notifyCustomer} onChange={() => setNotifyCustomer(!notifyCustomer)} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                  <span>Notify Customer on Update</span>
                </label>
                <div className="flex items-center text-xs uppercase tracking-wider text-accent font-bold">
                  <Sparkles size={14} className="mr-1" /> live
                </div>
              </div>
            </div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div> : bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No bookings found yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                      <th className="p-4 pl-6">ID</th><th className="p-4">Client</th><th className="p-4">Service</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 pl-6 text-sm font-black text-gray-400">#{b.id.toString().padStart(4,'0')}</td>
                        <td className="p-4">
                          <p className="text-sm font-bold text-primary">{b.user?.name}</p>
                          {b.user?.phone ? (
                            <p className="text-xs text-accent font-semibold mt-0.5">
                              <a href={`tel:${b.user.phone.replace(/[^+\d]/g, '')}`} className="hover:underline">{b.user.phone}</a>
                            </p>
                          ) : null}
                          {b.user?.email && (
                            <p className="text-xs text-gray-500">{b.user.email}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-sm text-gray-700">{b.service?.name}</p>
                          <p className="text-xs font-black text-accent">${Number(b.total_price || 0).toLocaleString()}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{new Date(b.date).toLocaleDateString()}<br/><span className="text-xs text-gray-500">{b.time_slot}</span></td>
                        <td className="p-4">
                          <select value={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer outline-none border ${getStatusColor(b.status)}`}>
                            <option>PENDING</option><option>CONFIRMED</option><option>IN_PROGRESS</option><option>COMPLETED</option><option>CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleCreateInvoice(b.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full transition-colors"
                            >
                              <FilePlus2 size={13} /> Make
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(b.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors"
                            >
                              <Download size={13} /> Download
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full transition-colors"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/70 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-primary">Service Catalog</h2>
              <button onClick={() => { setModalType('service'); setModalData({ name: '', description: '', price: '', duration_mins: '60' }); setShowModal(true); }}
                className="flex items-center space-x-1.5 bg-accent text-white px-4 py-2 rounded-btn font-bold text-sm hover:bg-accent/90 transition-colors">
                <Plus size={16} /><span>Add Service</span>
              </button>
            </div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div> : (
              <div className="divide-y divide-gray-100">
                {services.map(s => (
                  <div key={s.id} className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary truncate">{s.name}</p>
                      <p className="text-xs text-gray-500 truncate">{s.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                      <span className="text-base sm:text-lg font-black text-accent">${parseFloat(s.price).toLocaleString()}</span>
                      <span className="text-[10px] sm:text-xs text-gray-400">{s.duration_mins} min</span>
                      <button onClick={() => handleDelete('services', s.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mechanics Tab */}
        {activeTab === 'mechanics' && (
          <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/70 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-primary">Mechanics Roster</h2>
              <button onClick={() => { setModalType('mechanic'); setModalData({ name: '', phone: '', email: '' }); setShowModal(true); }}
                className="flex items-center space-x-1.5 bg-accent text-white px-4 py-2 rounded-btn font-bold text-sm hover:bg-accent/90 transition-colors">
                <Plus size={16} /><span>Add Mechanic</span>
              </button>
            </div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div> : mechanics.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No mechanics added yet. Click "Add Mechanic" to start building your team.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {mechanics.map(m => (
                  <div key={m.id} className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex-shrink-0 flex items-center justify-center text-accent font-bold">{m.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="font-bold text-primary truncate">{m.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          <a href={`tel:${m.phone.replace(/[^+\d]/g, '')}`} className="hover:underline text-accent font-semibold">{m.phone}</a> · {m.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold ${m.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {m.is_available ? 'Available' : 'Busy'}
                      </span>
                      <button onClick={() => handleDelete('mechanics', m.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/70">
              <h2 className="text-lg font-extrabold text-primary">Registered Customers ({customers.length})</h2>
            </div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                      <th className="p-4 pl-6">Customer</th><th className="p-4">Phone</th><th className="p-4">Joined</th><th className="p-4">Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/80">
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">{c.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-primary text-sm">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-primary">
                          {c.phone ? (
                            <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} className="hover:underline text-accent">
                              {c.phone}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-300">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="p-4"><span className="bg-accent/10 text-accent font-bold text-xs px-2.5 py-1 rounded-full">{c._count?.bookings || 0}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white/70 backdrop-blur-md rounded-card shadow-sm border border-white/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white/70 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-primary">Parts & Inventory</h2>
              <button onClick={() => { setModalType('inventory'); setModalData({ name: '', part_number: '', stock_quantity: '0', min_stock_level: '5' }); setShowModal(true); }}
                className="flex items-center space-x-1.5 bg-accent text-white px-4 py-2 rounded-btn font-bold text-sm hover:bg-accent/90 transition-colors">
                <Plus size={16} /><span>Add Part</span>
              </button>
            </div>
            {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div> : inventory.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No inventory items added yet. Click "Add Part" to start tracking.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                      <th className="p-4 pl-6">Part Name / Number</th><th className="p-4">Stock Level</th><th className="p-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inventory.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-bold text-primary">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.part_number ? `Part #: ${item.part_number}` : 'No part number'}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className={`text-lg font-black ${item.stock_quantity <= item.min_stock_level ? 'text-red-500' : 'text-green-600'}`}>
                              {item.stock_quantity}
                            </span>
                            {item.stock_quantity <= item.min_stock_level && (
                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Low Stock</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setUseItemData({ id: item.id, name: item.name, quantity: 1, notes: '' })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
                            >
                              <MinusCircle size={13} /> Use Part
                            </button>
                            <button onClick={() => handleDelete('inventory', item.id)} className="text-red-400 hover:text-red-600 ml-2 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white/90 backdrop-blur-md border border-white rounded-card p-8 w-full max-w-md shadow-2xl text-primary" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-primary">Add {modalType === 'service' ? 'Service' : 'Mechanic'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input value={modalData.name || ''} onChange={e => setModalData({...modalData, name: e.target.value})} placeholder="Enter name"
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              {modalType === 'service' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea value={modalData.description || ''} onChange={e => setModalData({...modalData, description: e.target.value})} rows="3" placeholder="Describe the service"
                      className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                      <input type="number" value={modalData.price || ''} onChange={e => setModalData({...modalData, price: e.target.value})} placeholder="1499"
                        className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Duration (min)</label>
                      <input type="number" value={modalData.duration_mins || ''} onChange={e => setModalData({...modalData, duration_mins: e.target.value})} placeholder="60"
                        className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                  </div>
                </>
              )}
              {modalType === 'mechanic' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                    <input value={modalData.phone || ''} onChange={e => setModalData({...modalData, phone: e.target.value})} placeholder="+91 9876543210"
                      className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input value={modalData.email || ''} onChange={e => setModalData({...modalData, email: e.target.value})} placeholder="mechanic@autocare.com"
                      className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </>
              )}
              {modalType === 'inventory' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Part Number (Optional)</label>
                    <input value={modalData.part_number || ''} onChange={e => setModalData({...modalData, part_number: e.target.value})} placeholder="e.g. VAL-10W40"
                      className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
                      <input type="number" value={modalData.stock_quantity || ''} onChange={e => setModalData({...modalData, stock_quantity: e.target.value})} placeholder="10"
                        className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Low Stock Alert At</label>
                      <input type="number" value={modalData.min_stock_level || ''} onChange={e => setModalData({...modalData, min_stock_level: e.target.value})} placeholder="5"
                        className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                    </div>
                  </div>
                </>
              )}
              <button onClick={handleAddSubmit} className="w-full bg-primary text-white py-3 rounded-btn font-bold hover:bg-accent transition-all shadow-md flex items-center justify-center space-x-2">
                <Save size={18} /><span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Part Modal */}
      {useItemData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setUseItemData(null)}>
          <div className="bg-white/90 backdrop-blur-md border border-white rounded-card p-8 w-full max-w-md shadow-2xl text-primary" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-primary">Use Part: {useItemData.name}</h3>
              <button onClick={() => setUseItemData(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Quantity Used</label>
                <input type="number" min="1" value={useItemData.quantity || 1} onChange={e => setUseItemData({...useItemData, quantity: e.target.value})}
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notes / Job Reference (Optional)</label>
                <textarea value={useItemData.notes || ''} onChange={e => setUseItemData({...useItemData, notes: e.target.value})} rows="2" placeholder="e.g., Used for Booking #104"
                  className="w-full border border-gray-300 bg-white text-primary rounded-input px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
              </div>
              <button onClick={handleUseItem} className="w-full bg-amber-500 text-white py-3 rounded-btn font-bold hover:bg-amber-600 transition-all shadow-md flex items-center justify-center space-x-2">
                <MinusCircle size={18} /><span>Deduct Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
