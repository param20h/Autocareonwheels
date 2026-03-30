export const formatCurrency = (value, options = {}) => {
	const amount = Number(value || 0);
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumFractionDigits: 2,
		...options,
	}).format(Number.isFinite(amount) ? amount : 0);
};

export default formatCurrency;
