export const formatDate = (value, options = {}) => {
	if (!value) return '';
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return '';

	return parsed.toLocaleDateString('en-IN', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		...options,
	});
};

export default formatDate;
