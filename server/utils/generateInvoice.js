const pad = (value, size) => String(value).padStart(size, '0');

const generateInvoiceNumber = (bookingId) => {
	const now = new Date();
	const yyyymmdd = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`;
	return `INV-${yyyymmdd}-${pad(bookingId, 5)}`;
};

const calculateInvoiceTotals = (amount, gstRate = 0.18) => {
	const base = Number.parseFloat(amount || 0);
	const gst = Number((base * gstRate).toFixed(2));
	const total = Number((base + gst).toFixed(2));
	return { amount: Number(base.toFixed(2)), gst, total, gstRate };
};

const buildInvoicePayload = ({ bookingId, amount, gstRate }) => {
	const totals = calculateInvoiceTotals(amount, gstRate);
	return {
		booking_id: bookingId,
		invoice_number: generateInvoiceNumber(bookingId),
		amount: totals.amount,
		gst: totals.gst,
		total: totals.total,
	};
};

module.exports = {
	generateInvoiceNumber,
	calculateInvoiceTotals,
	buildInvoicePayload,
};
