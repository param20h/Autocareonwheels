const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { service_id, address, city, date, time_slot, total_price, addons } = req.body;
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
    
    const booking = await prisma.booking.create({
      data: {
        user_id: req.user.id,
        service_id: parsedServiceId,
        address,
        city: city || 'Local',
        date: parsedDate,
        time_slot,
        total_price: parsedTotalPrice,
        booking_addons: safeAddons.length > 0 ? {
          create: safeAddons
            .filter((a) => Number.isInteger(Number.parseInt(a.id, 10)) && Number.isFinite(Number.parseFloat(a.price)))
            .map((a) => ({ addon_id: Number.parseInt(a.id, 10), price: Number.parseFloat(a.price) }))
        } : undefined
      }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Booking Creation Error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
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
