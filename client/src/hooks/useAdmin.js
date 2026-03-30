import { useCallback } from 'react';
import api from '../services/api';

const useAdmin = () => {
	const getBookings = useCallback(async () => {
		const { data } = await api.get('/admin/bookings');
		return data?.data || [];
	}, []);

	const updateBookingStatus = useCallback(async (id, payload) => {
		const { data } = await api.put(`/admin/bookings/${id}`, payload);
		return data?.data;
	}, []);

	const getMechanics = useCallback(async () => {
		const { data } = await api.get('/admin/mechanics');
		return data?.data || [];
	}, []);

	const getCustomers = useCallback(async () => {
		const { data } = await api.get('/admin/customers');
		return data?.data || [];
	}, []);

	return {
		getBookings,
		updateBookingStatus,
		getMechanics,
		getCustomers,
	};
};

export default useAdmin;
