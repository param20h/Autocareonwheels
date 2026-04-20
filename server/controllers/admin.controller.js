const { sendEmail } = require('../utils/email');
const prisma = require('../utils/prisma');

const allowedBookingStatus = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const toPositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// ============ BOOKINGS ============
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, phone: true, email: true } },
        service: true,
        mechanic: true,
        invoices: { orderBy: { created_at: 'desc' }, take: 1 },
      },
      orderBy: { id: 'desc' }
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mechanic_id } = req.body;
    const bookingId = toPositiveInt(id);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }
    if (!allowedBookingStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    let parsedMechanicId;
    if (mechanic_id !== undefined && mechanic_id !== null && mechanic_id !== '') {
      parsedMechanicId = toPositiveInt(mechanic_id);
      if (!parsedMechanicId) {
        return res.status(400).json({ success: false, message: 'Invalid mechanic id' });
      }
      const mechanic = await prisma.mechanic.findUnique({ where: { id: parsedMechanicId } });
      if (!mechanic) {
        return res.status(404).json({ success: false, message: 'Mechanic not found' });
      }
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status, mechanic_id: parsedMechanicId !== undefined ? parsedMechanicId : undefined },
      include: { user: true, service: true }
    });

    // Send Status Update Email
    const shouldSendEmails = String(process.env.SEND_BOOKING_EMAILS || 'false').toLowerCase() === 'true';
    if (shouldSendEmails && booking.user && booking.user.email) {
      let subject = '';
      let text = '';
      
      if (status === 'CONFIRMED') {
        subject = `Booking Confirmed #${booking.id}`;
        text = `Hi ${booking.user.name || 'Customer'},\n\nYour booking #${booking.id} for ${booking.service.name} has been CONFIRMED.\n\nThank you for choosing AutoCare on Wheels.`;
      } else if (status === 'COMPLETED') {
        subject = `Booking Completed / Ready for Pickup #${booking.id}`;
        text = `Hi ${booking.user.name || 'Customer'},\n\nYour vehicle service #${booking.id} for ${booking.service.name} is now COMPLETED and ready!\n\nThank you for choosing AutoCare on Wheels.`;
      } else if (status === 'CANCELLED') {
        subject = `Booking Cancelled #${booking.id}`;
        text = `Hi ${booking.user.name || 'Customer'},\n\nYour booking #${booking.id} for ${booking.service.name} has been CANCELLED.\n\nIf you have any questions, please contact us.`;
      }

      if (subject && text) {
        try {
          await sendEmail({
            to: booking.user.email,
            subject,
            text,
            html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${text}</pre>`
          });
        } catch (mailError) {
          console.error('Failed to send status update email:', mailError.message);
        }
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating booking' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = toPositiveInt(req.params.id);
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Invalid booking id' });
    }

    const existing = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await prisma.booking.delete({ where: { id: bookingId } });
    return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error deleting booking' });
  }
};

// ============ SERVICES ============
exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration_mins, category_id, image_url } = req.body;
    const parsedPrice = toNumber(price);
    const parsedDuration = toPositiveInt(duration_mins);
    const parsedCategoryId = category_id ? toPositiveInt(category_id) : 1;

    if (!name || !description || parsedPrice === null || parsedPrice <= 0 || !parsedDuration) {
      return res.status(400).json({ success: false, message: 'Invalid service payload' });
    }

    let category = await prisma.category.findFirst({ where: { id: parsedCategoryId } });
    if (!category) category = await prisma.category.create({ data: { name: 'General Maintenance', display_order: 1 } });
    const service = await prisma.service.create({
      data: { name, description, price: parsedPrice, duration_mins: parsedDuration, image_url, category_id: category.id }
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration_mins, is_active } = req.body;
    const serviceId = toPositiveInt(id);
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'Invalid service id' });
    }

    const parsedPrice = price !== undefined ? toNumber(price) : undefined;
    const parsedDuration = duration_mins !== undefined ? toPositiveInt(duration_mins) : undefined;
    if (price !== undefined && (parsedPrice === null || parsedPrice <= 0)) {
      return res.status(400).json({ success: false, message: 'Invalid service price' });
    }
    if (duration_mins !== undefined && !parsedDuration) {
      return res.status(400).json({ success: false, message: 'Invalid service duration' });
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: { name, description, price: parsedPrice, duration_mins: parsedDuration, is_active }
    });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = toPositiveInt(req.params.id);
    if (!serviceId) {
      return res.status(400).json({ success: false, message: 'Invalid service id' });
    }
    await prisma.addon.deleteMany({ where: { service_id: serviceId } });
    await prisma.service.delete({ where: { id: serviceId } });
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
};

// ============ ADD-ONS ============
exports.createAddon = async (req, res) => {
  try {
    const { service_id, name, price } = req.body;
    const serviceId = toPositiveInt(service_id);
    const parsedPrice = toNumber(price);
    if (!serviceId || !name || parsedPrice === null || parsedPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid add-on payload' });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const addon = await prisma.addon.create({
      data: { name, price: parsedPrice, service_id: serviceId }
    });
    res.status(201).json({ success: true, data: addon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding add-on' });
  }
};

exports.deleteAddon = async (req, res) => {
  try {
    const addonId = toPositiveInt(req.params.id);
    if (!addonId) {
      return res.status(400).json({ success: false, message: 'Invalid add-on id' });
    }
    await prisma.addon.delete({ where: { id: addonId } });
    res.status(200).json({ success: true, message: 'Add-on deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting add-on' });
  }
};

// ============ MECHANICS ============
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await prisma.mechanic.findMany({ orderBy: { id: 'desc' } });
    res.status(200).json({ success: true, data: mechanics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createMechanic = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Name, phone, and email are required' });
    }
    const mechanic = await prisma.mechanic.create({ data: { name, phone, email } });
    res.status(201).json({ success: true, data: mechanic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding mechanic' });
  }
};

exports.deleteMechanic = async (req, res) => {
  try {
    const mechanicId = toPositiveInt(req.params.id);
    if (!mechanicId) {
      return res.status(400).json({ success: false, message: 'Invalid mechanic id' });
    }
    await prisma.mechanic.delete({ where: { id: mechanicId } });
    res.status(200).json({ success: true, message: 'Mechanic removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing mechanic' });
  }
};

// ============ CUSTOMERS ============
exports.getAllCustomers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, email: true, phone: true, created_at: true, _count: { select: { bookings: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
