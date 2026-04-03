const PDFDocument = require('pdfkit');

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
	buildInvoicePdfBuffer: (invoice, booking) => {
		return new Promise((resolve, reject) => {
			const doc = new PDFDocument({ margin: 50 });
			const chunks = [];
			doc.on('data', (chunk) => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);

			doc.fontSize(22).text('AutoCare On Wheels', { align: 'left' });
			doc.moveDown(0.3);
			doc.fontSize(12).fillColor('#666666').text('Service Invoice');
			doc.fillColor('#000000');
			doc.moveDown(1);

			doc.fontSize(11).text(`Invoice Number: ${invoice.invoice_number}`);
			doc.text(`Invoice Date: ${new Date(invoice.created_at).toLocaleDateString()}`);
			doc.text(`Booking ID: #${String(booking.id).padStart(4, '0')}`);
			doc.moveDown(1);

			doc.fontSize(13).text('Customer Details', { underline: true });
			doc.moveDown(0.4);
			doc.fontSize(11).text(`Name: ${booking.user?.name || '-'}`);
			doc.text(`Email: ${booking.user?.email || '-'}`);
			doc.text(`Phone: ${booking.user?.phone || '-'}`);
			doc.moveDown(1);

			doc.fontSize(13).text('Service Details', { underline: true });
			doc.moveDown(0.4);
			doc.fontSize(11).text(`Service: ${booking.service?.name || '-'}`);
			doc.text(`Date: ${new Date(booking.date).toLocaleDateString()}`);
			doc.text(`Time Slot: ${booking.time_slot || '-'}`);
			doc.text(`Address: ${booking.address || '-'}, ${booking.city || '-'}`);
			doc.moveDown(1);

			doc.fontSize(13).text('Payment Summary', { underline: true });
			doc.moveDown(0.4);
			doc.fontSize(11).text(`Amount: INR ${Number(invoice.amount).toFixed(2)}`);
			doc.text(`GST: INR ${Number(invoice.gst).toFixed(2)}`);
			doc.fontSize(12).text(`Total: INR ${Number(invoice.total).toFixed(2)}`);
			doc.moveDown(1.4);

			doc.fontSize(10).fillColor('#666666').text('Thank you for choosing AutoCare On Wheels.', { align: 'center' });
			doc.end();
		});
	},
};
