const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { service_id, address, city, date, time_slot, total_price, addons } = req.body;
    
    const booking = await prisma.booking.create({
      data: {
        user_id: req.user.id,
        service_id: parseInt(service_id),
        address,
        city: city || 'Local',
        date: new Date(date),
        time_slot,
        total_price,
        booking_addons: addons && addons.length > 0 ? {
          create: addons.map(a => ({ addon_id: a.id, price: a.price }))
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
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Not your booking' });
    if (booking.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
    const updated = await prisma.booking.update({ where: { id: parseInt(id) }, data: { status: 'CANCELLED' } });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
};
