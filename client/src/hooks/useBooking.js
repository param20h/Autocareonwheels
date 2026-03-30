import { useCallback, useState } from 'react';
import bookingService from '../services/booking.service';

const useBooking = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchMyBookings = useCallback(async () => {
		setLoading(true);
		try {
			const { data } = await bookingService.getMyBookings();
			const items = data?.data || [];
			setBookings(items);
			return items;
		} finally {
			setLoading(false);
		}
	}, []);

	const createBooking = useCallback(async (payload) => {
		const { data } = await bookingService.createBooking(payload);
		return data?.data;
	}, []);

	const cancelBooking = useCallback(async (id) => {
		const { data } = await bookingService.cancelBooking(id);
		setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)));
		return data?.data;
	}, []);

	return {
		bookings,
		loading,
		fetchMyBookings,
		createBooking,
		cancelBooking,
	};
};

export default useBooking;
