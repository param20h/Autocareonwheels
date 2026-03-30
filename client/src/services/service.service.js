import api from './api';

const serviceService = {
	getServices: () => api.get('/services'),
	createService: (payload) => api.post('/admin/services', payload),
	updateService: (id, payload) => api.put(`/admin/services/${id}`, payload),
	deleteService: (id) => api.delete(`/admin/services/${id}`),
	createAddon: (payload) => api.post('/admin/addons', payload),
	deleteAddon: (id) => api.delete(`/admin/addons/${id}`),
};

export default serviceService;
