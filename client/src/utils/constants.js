export const BOOKING_STATUS = {
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	IN_PROGRESS: 'IN_PROGRESS',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
};

export const USER_ROLE = {
	ADMIN: 'ADMIN',
	CUSTOMER: 'CUSTOMER',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const CURRENCY_CODE = 'INR';
export const DEFAULT_CITY = 'Local';
