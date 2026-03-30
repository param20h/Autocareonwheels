export const isEmail = (value) => {
	if (!value) return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isPhone = (value) => {
	if (!value) return false;
	return /^\+?[0-9\s-]{8,20}$/.test(value);
};

export const isStrongPassword = (value) => {
	if (!value) return false;
	return value.length >= 8;
};

export const required = (value) => {
	return value !== undefined && value !== null && String(value).trim().length > 0;
};

export default {
	isEmail,
	isPhone,
	isStrongPassword,
	required,
};
