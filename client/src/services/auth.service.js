import api from './api';

const authService = {
	login: (payload) => api.post('/auth/login', payload),
	getMe: () => api.get('/auth/me'),
	updateProfile: (payload) => api.put('/auth/profile', payload),
	changePassword: (payload) => api.put('/auth/password', payload),
};

export default authService;
