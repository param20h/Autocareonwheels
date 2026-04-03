import api from './api';

const bookingService = {
	createBooking: (payload) => api.post('/bookings', payload),
	getMyBookings: () => api.get('/bookings/my'),
	getStaffBookings: () => api.get('/bookings/staff'),
	cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
	createInvoice: (id) => api.post(`/bookings/${id}/invoice`),
	downloadInvoice: (id) => api.get(`/bookings/${id}/invoice/download`, { responseType: 'blob' }),
};

export default bookingService;
