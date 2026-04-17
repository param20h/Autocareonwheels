const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { buildInvoicePayload, buildInvoicePdfBuffer } = require('../utils/generateInvoice');
const { sendEmail } = require('../utils/email');
const prisma = new PrismaClient();

const STAFF_ROLES = ['ADMIN'];

const canAccessBooking = (user, booking) => {
  if (!user || !booking) return false;
  if (STAFF_ROLES.includes(user.role)) return true;
  return booking.user_id === user.id;
};

const buildBookingNotes = ({ existingNotes, vehicleNumber, vehicleModel, state, pincode }) => {
  const parts = [];
  const cleanedNotes = typeof existingNotes === 'string' ? existingNotes.trim() : '';
  const cleanedVehicleNumber = typeof vehicleNumber === 'string' ? vehicleNumber.trim().toUpperCase() : '';
  const cleanedVehicleModel = typeof vehicleModel === 'string' ? vehicleModel.trim() : '';
  const cleanedState = typeof state === 'string' ? state.trim() : '';
  const cleanedPincode = typeof pincode === 'string' ? pincode.trim() : '';

  if (cleanedNotes) {
    parts.push(cleanedNotes);
  }

  if (cleanedVehicleNumber || cleanedVehicleModel) {
    parts.push(`Vehicle: ${cleanedVehicleNumber || 'NA'}${cleanedVehicleModel ? ` (${cleanedVehicleModel})` : ''}`);
  }

  if (cleanedState || cleanedPincode) {
    parts.push(`Location Meta: ${cleanedState || 'NA'}${cleanedPincode ? `, ${cleanedPincode}` : ''}`);
  }

  return parts.length > 0 ? parts.join('\n') : null;
};

const resolveBookingUserId = async (req) => {
  if (req.user?.id) {
    return req.user.id;
  }

  const guestName = typeof req.body.guest_name === 'string' ? req.body.guest_name.trim() : '';
  const guestEmail = typeof req.body.guest_email === 'string' ? req.body.guest_email.trim().toLowerCase() : '';
  const guestPhone = typeof req.body.guest_phone === 'string' ? req.body.guest_phone.trim() : '';

  if (!guestName || !guestEmail || !guestPhone) {
    const error = new Error('Guest details are required for booking without login');
    error.statusCode = 400;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(guestEmail)) {
    const error = new Error('Guest email is invalid');
    error.statusCode = 400;
    throw error;
  }

  let user = await prisma.user.findUnique({ where: { email: guestEmail } });

  if (!user && guestPhone) {
    user = await prisma.user.findFirst({ where: { phone: guestPhone } });
  }

  if (!user) {
    const guestPassword = await bcrypt.hash(`guest-${Date.now()}-${Math.random()}`, 12);
    const localGoogleId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      user = await prisma.user.create({
        data: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          password: guestPassword,
          google_id: localGoogleId,
          role: 'CUSTOMER',
        },
      });
    } catch (createError) {
      // Guard against races or existing unique values (email/phone).
      if (createError?.code === 'P2002') {
        const existing = await prisma.user.findFirst({
          where: {
            OR: [
              { email: guestEmail },
              { phone: guestPhone },
            ],
          },
        });

        if (existing) {
          user = existing;
        } else {
          throw createError;
        }
      } else {
        throw createError;
      }
    }
  }

  return user.id;
};

const formatCurrency = (value) => {
  const amount = Number.parseFloat(value || 0);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '$0.00';
};

const sendBookingEmails = async ({ booking, user, service, selectedAddons = [], state, pincode, vehicleNumber, vehicleModel }) => {
  const shouldSendEmails = String(process.env.SEND_BOOKING_EMAILS || 'false').toLowerCase() === 'true';
  if (!shouldSendEmails) {
    return;
  }

  const businessEmail = process.env.BUSINESS_EMAIL || process.env.SMTP_USER;
  if (!businessEmail || !user?.email) {
    return;
  }

  const addonList = selectedAddons.length > 0
    ? selectedAddons.map((a) => `- ${a.name}: ${formatCurrency(a.price)}`).join('\n')
    : 'No add-ons selected';

  const locationText = `${booking.address}, ${booking.city}${state ? `, ${state}` : ''}${pincode ? ` ${pincode}` : ''}`;
  const vehicleText = `${vehicleNumber || 'N/A'}${vehicleModel ? ` (${vehicleModel})` : ''}`;

  const businessText = [
    'New booking received',
    `Booking ID: ${booking.id}`,
    `Customer: ${user.name || 'N/A'}`,
    `Customer Email: ${user.email}`,
    `Customer Phone: ${user.phone || 'N/A'}`,
    `Service: ${service.name}`,
    `Date: ${new Date(booking.date).toLocaleDateString()}`,
    `Time Slot: ${booking.time_slot}`,
    `Vehicle: ${vehicleText}`,
    `Location: ${locationText}`,
    `Total: ${formatCurrency(booking.total_price)}`,
    'Add-ons:',
    addonList,
  ].join('\n');

  const customerText = [
    `Hi ${user.name || 'Customer'},`,
    '',
    'Your booking has been confirmed.',
    `Booking ID: ${booking.id}`,
    `Service: ${service.name}`,
    `Date: ${new Date(booking.date).toLocaleDateString()}`,
    `Time Slot: ${booking.time_slot}`,
    `Vehicle: ${vehicleText}`,
    `Location: ${locationText}`,
    `Total Estimate: ${formatCurrency(booking.total_price)}`,
    '',
    'Thank you for choosing AutoCare on Wheels.',
  ].join('\n');

  let invoiceAttachment;
  try {
    let invoice = await prisma.invoice.findFirst({
      where: { booking_id: booking.id },
      orderBy: { created_at: 'desc' },
    });

    if (!invoice) {
      const payload = buildInvoicePayload({ bookingId: booking.id, amount: booking.total_price });
      invoice = await prisma.invoice.create({ data: payload });
    }

    const invoiceBooking = {
      ...booking,
      user,
      service,
      addon_items: selectedAddons,
    };

    const pdfBuffer = await buildInvoicePdfBuffer(invoice, invoiceBooking);
    invoiceAttachment = {
      filename: `${invoice.invoice_number}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    };
  } catch (invoiceError) {
    console.error('Invoice generation for booking email failed:', invoiceError.message);
  }

  await Promise.all([
    sendEmail({
      to: businessEmail,
      subject: `New Booking #${booking.id} - ${service.name}`,
      text: businessText,
      html: `<pre>${businessText}</pre>`,
      attachments: invoiceAttachment ? [invoiceAttachment] : undefined,
    }),
    sendEmail({
      to: user.email,
      subject: `Booking Confirmation #${booking.id}`,
      text: customerText,
      html: `<pre>${customerText}</pre>`,
      attachments: invoiceAttachment ? [invoiceAttachment] : undefined,
    }),
  ]);
};

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Public/Private
exports.createBooking = async (req, res) => {
  try {
    const { service_id, address, city, state, pincode, date, time_slot, total_price, addons, notes, vehicle_number, vehicle_model } = req.body;
    const parsedServiceId = Number.parseInt(service_id, 10);
    const parsedTotalPrice = Number.parseFloat(total_price);
    const parsedDate = new Date(date);

    if (!Number.isInteger(parsedServiceId) || parsedServiceId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid service selected' });
    }
    if (!address || !time_slot || Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Missing or invalid booking details' });
    }
    if (!Number.isFinite(parsedTotalPrice) || parsedTotalPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking amount' });
    }

    const service = await prisma.service.findUnique({ where: { id: parsedServiceId } });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const safeAddons = Array.isArray(addons) ? addons : [];
    
    const bookingUserId = await resolveBookingUserId(req);

    const [bookingUser, addonRecords] = await Promise.all([
      prisma.user.findUnique({ where: { id: bookingUserId } }),
      safeAddons.length > 0
        ? prisma.addon.findMany({
            where: { id: { in: safeAddons.map((a) => Number.parseInt(a.id, 10)).filter((id) => Number.isInteger(id)) } },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    ]);

    const booking = await prisma.booking.create({
      data: {
        user_id: bookingUserId,
        service_id: parsedServiceId,
        address,
        city: city || 'Local',
        date: parsedDate,
        time_slot,
        total_price: parsedTotalPrice,
        notes: buildBookingNotes({
          existingNotes: notes,
          vehicleNumber: vehicle_number,
          vehicleModel: vehicle_model,
          state,
          pincode,
        }),
        booking_addons: safeAddons.length > 0 ? {
          create: safeAddons
            .filter((a) => Number.isInteger(Number.parseInt(a.id, 10)) && Number.isFinite(Number.parseFloat(a.price)))
            .map((a) => ({ addon_id: Number.parseInt(a.id, 10), price: Number.parseFloat(a.price) }))
        } : undefined
      }
    });

    const addonNameById = new Map(addonRecords.map((a) => [a.id, a.name]));
    const selectedAddons = safeAddons
      .map((a) => {
        const addonId = Number.parseInt(a.id, 10);
        const addonPrice = Number.parseFloat(a.price);
        if (!Number.isInteger(addonId) || !Number.isFinite(addonPrice)) {
          return null;
        }
        return {
          id: addonId,
          name: addonNameById.get(addonId) || `Addon #${addonId}`,
          price: addonPrice,
        };
      })
      .filter(Boolean);

    try {
      await sendBookingEmails({
        booking,
        user: bookingUser,
        service,
        selectedAddons,
        state,
        pincode,
        vehicleNumber: vehicle_number,
        vehicleModel: vehicle_model,
      });
    } catch (mailError) {
      console.error('Booking email sending failed:', mailError.message);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating booking' });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/v1/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: req.user.id },
      include: { service: true, mechanic: true },
      orderBy: { date: 'desc' }
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingId = Number.parseInt(id, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not your booking' });
    if (booking.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
    const updated = await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
};

exports.deleteMyBooking = async (req, res) => {
  try {
    const bookingId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not your booking' });
    }

    if (!['PENDING', 'CANCELLED', 'COMPLETED'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only pending, cancelled, or completed bookings can be deleted',
      });
    }

    await prisma.booking.delete({ where: { id: bookingId } });
    return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error deleting booking' });
  }
};

// @desc    Get bookings for admin dashboard
// @route   GET /api/v1/bookings/staff
// @access  Private (ADMIN)
exports.getStaffBookings = async (req, res) => {
  try {
    if (!STAFF_ROLES.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access restricted to ADMIN role.' });
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: true,
        mechanic: true,
        invoices: { orderBy: { created_at: 'desc' }, take: 1 },
      },
      orderBy: { id: 'desc' },
    });

    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error fetching staff bookings' });
  }
};

// @desc    Create or fetch invoice for a booking
// @route   POST /api/v1/bookings/:id/invoice
// @access  Private
exports.createOrGetInvoice = async (req, res) => {
  try {
    const bookingId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!canAccessBooking(req.user, booking)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this booking invoice' });
    }

    let invoice = await prisma.invoice.findFirst({
      where: { booking_id: bookingId },
      orderBy: { created_at: 'desc' },
    });

    if (!invoice) {
      const payload = buildInvoicePayload({ bookingId, amount: booking.total_price });
      invoice = await prisma.invoice.create({ data: payload });
    }

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error creating invoice' });
  }
};

// @desc    Download booking invoice as PDF
// @route   GET /api/v1/bookings/:id/invoice/download
// @access  Private
exports.downloadInvoice = async (req, res) => {
  try {
    const bookingId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!canAccessBooking(req.user, booking)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this booking invoice' });
    }

    let invoice = await prisma.invoice.findFirst({
      where: { booking_id: bookingId },
      orderBy: { created_at: 'desc' },
    });

    if (!invoice) {
      const payload = buildInvoicePayload({ bookingId, amount: booking.total_price });
      invoice = await prisma.invoice.create({ data: payload });
    }

    const pdfBuffer = await buildInvoicePdfBuffer(invoice, booking);
    const fileName = `${invoice.invoice_number}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error downloading invoice' });
  }
};
