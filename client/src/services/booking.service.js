import api from './api';

const bookingService = {
	createBooking: (payload) => api.post('/bookings', payload),
	getMyBookings: () => api.get('/bookings/my'),
	cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export default bookingService;
