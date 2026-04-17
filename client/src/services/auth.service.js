import api from './api';

const authService = {
	register: (payload) => api.post('/auth/register', payload),
	login: (payload) => api.post('/auth/login', payload),
	getMe: () => api.get('/auth/me'),
	updateProfile: (payload) => api.put('/auth/profile', payload),
	changePassword: (payload) => api.put('/auth/password', payload),
};

export default authService;
