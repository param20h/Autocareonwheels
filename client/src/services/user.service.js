import api from './api';

const userService = {
	getSummary: () => api.get('/users/summary'),
	getVehicles: () => api.get('/users/vehicles'),
	createVehicle: (payload) => api.post('/users/vehicles', payload),
	deleteVehicle: (id) => api.delete(`/users/vehicles/${id}`),
};

export default userService;
