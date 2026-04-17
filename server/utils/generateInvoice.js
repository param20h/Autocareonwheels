const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

			const businessName = process.env.BUSINESS_NAME || 'AutoCare On Wheels';
			const businessEmail = process.env.BUSINESS_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || 'info@autocareonwheels.com.au';
			const businessPhone = process.env.BUSINESS_PHONE || '0427563913';
			const businessAddress = process.env.BUSINESS_ADDRESS || 'AutoCare On Wheels, Australia';
			const currency = process.env.BUSINESS_CURRENCY || 'AUD';
			const logoPath = path.resolve(__dirname, '../../public/data.png');
			const addonItems = Array.isArray(booking.addon_items)
				? booking.addon_items
				: (Array.isArray(booking.booking_addons)
					? booking.booking_addons.map((item) => ({
						name: item?.addon?.name || item?.name || 'Add-on',
						price: Number(item?.price || 0),
					}))
					: []);

			doc.rect(45, 45, 505, 120).fill('#f8fafc').stroke('#e2e8f0');

			let textStartX = 60;
			let leftColumnWidth = 280;
			if (fs.existsSync(logoPath)) {
				try {
					doc.image(logoPath, 58, 56, { fit: [150, 70] });
					textStartX = 220;
					leftColumnWidth = 180;
				} catch (logoError) {
					textStartX = 60;
					leftColumnWidth = 280;
				}
			}

			const leftTopY = 64;
			doc.fillColor('#0f172a').fontSize(20).text(businessName, textStartX, leftTopY, {
				width: leftColumnWidth,
				align: 'left',
				lineBreak: true,
			});

			const businessNameHeight = doc.heightOfString(businessName, { width: leftColumnWidth, align: 'left' });
			let leftDetailY = leftTopY + businessNameHeight + 6;

			doc.fontSize(10).fillColor('#334155').text(`Email: ${businessEmail}`, textStartX, leftDetailY, {
				width: leftColumnWidth,
				lineBreak: true,
			});
			leftDetailY += 16;
			doc.text(`Phone: ${businessPhone}`, textStartX, leftDetailY, {
				width: leftColumnWidth,
				lineBreak: true,
			});
			leftDetailY += 16;
			doc.text(`Address: ${businessAddress}`, textStartX, leftDetailY, {
				width: leftColumnWidth,
				lineBreak: true,
			});

			const rightColumnX = 370;
			const rightColumnWidth = 160;
			const rightTopY = 66;
			doc.fillColor('#0f172a').fontSize(24).text('INVOICE', rightColumnX, rightTopY, {
				align: 'right',
				width: rightColumnWidth,
				lineBreak: true,
			});
			const invoiceTitleHeight = doc.heightOfString('INVOICE', { width: rightColumnWidth, align: 'right' });
			let rightMetaY = rightTopY + invoiceTitleHeight + 6;

			doc.fontSize(10).fillColor('#475569').text(`Invoice #: ${invoice.invoice_number}`, rightColumnX, rightMetaY, {
				align: 'right',
				width: rightColumnWidth,
				lineBreak: true,
			});
			rightMetaY += 16;
			doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, rightColumnX, rightMetaY, {
				align: 'right',
				width: rightColumnWidth,
				lineBreak: true,
			});
			rightMetaY += 16;
			doc.text(`Booking ID: #${String(booking.id).padStart(4, '0')}`, rightColumnX, rightMetaY, {
				align: 'right',
				width: rightColumnWidth,
				lineBreak: true,
			});

			doc.moveTo(50, 170).lineTo(545, 170).strokeColor('#cbd5e1').stroke();
			doc.moveDown(3);

			doc.fillColor('#0f172a').fontSize(12).text('Bill To', 50, 185, { underline: true });
			doc.fontSize(11).fillColor('#111827').text(booking.user?.name || '-', 50, 205);
			doc.fillColor('#334155').text(booking.user?.email || '-', 50, 222);
			doc.text(booking.user?.phone || '-', 50, 239);

			doc.fillColor('#0f172a').fontSize(12).text('Service Details', 300, 185, { underline: true });
			doc.fontSize(11).fillColor('#111827').text(`Service: ${booking.service?.name || '-'}`, 300, 205, { width: 240 });
			doc.fillColor('#334155').text(`Date: ${new Date(booking.date).toLocaleDateString()}`, 300, 222);
			doc.text(`Time Slot: ${booking.time_slot || '-'}`, 300, 239, { width: 240 });
			doc.text(`Location: ${booking.address || '-'}, ${booking.city || '-'}`, 300, 256, { width: 240 });

			doc.rect(50, 290, 495, 30).fill('#0f172a');
			doc.fillColor('#ffffff').fontSize(11).text('Description', 60, 300);
			doc.text('Amount', 460, 300, { width: 70, align: 'right' });

			let y = 333;
			doc.fillColor('#111827').fontSize(11).text(`${booking.service?.name || 'Service Booking'} (${booking.time_slot || '-'})`, 60, y, { width: 360 });
			doc.text(`${currency} ${Number(invoice.amount).toFixed(2)}`, 460, y, { width: 70, align: 'right' });

			y += 24;
			if (addonItems.length > 0) {
				doc.fillColor('#0f172a').fontSize(10).text('Add-ons', 60, y);
				y += 16;
				addonItems.forEach((addon) => {
					doc.fillColor('#334155').fontSize(10).text(`- ${addon.name}`, 70, y, { width: 340 });
					doc.text(`${currency} ${Number(addon.price).toFixed(2)}`, 460, y, { width: 70, align: 'right' });
					y += 16;
				});
			}

			y += 8;
			doc.fillColor('#334155').fontSize(11).text('Tax (GST)', 60, y);
			doc.text(`${currency} ${Number(invoice.gst).toFixed(2)}`, 460, y, { width: 70, align: 'right' });

			y += 24;
			doc.moveTo(50, y).lineTo(545, y).strokeColor('#cbd5e1').stroke();
			y += 14;
			doc.fontSize(13).fillColor('#0f172a').text('Total Due', 60, y);
			doc.fontSize(14).text(`${currency} ${Number(invoice.total).toFixed(2)}`, 430, y, { width: 100, align: 'right' });

			doc.fontSize(10).fillColor('#64748b').text('Thank you for choosing AutoCare On Wheels.', 50, 725, { align: 'center', width: 495 });
			doc.text('This is a system-generated invoice.', 50, 740, { align: 'center', width: 495 });
			doc.end();
		});
	},
};
