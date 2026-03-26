const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ BOOKINGS ============
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, phone: true, email: true } }, service: true, mechanic: true },
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
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status, mechanic_id: mechanic_id ? parseInt(mechanic_id) : undefined },
      include: { user: true, service: true }
    });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating booking' });
  }
};

// ============ SERVICES ============
exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration_mins, category_id, image_url } = req.body;
    let category = await prisma.category.findFirst({ where: { id: category_id ? parseInt(category_id) : 1 } });
    if (!category) category = await prisma.category.create({ data: { name: 'General Maintenance', display_order: 1 } });
    const service = await prisma.service.create({
      data: { name, description, price: parseFloat(price), duration_mins: parseInt(duration_mins), image_url, category_id: category.id }
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
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: { name, description, price: price ? parseFloat(price) : undefined, duration_mins: duration_mins ? parseInt(duration_mins) : undefined, is_active }
    });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await prisma.addon.deleteMany({ where: { service_id: parseInt(req.params.id) } });
    await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
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
    const addon = await prisma.addon.create({
      data: { name, price: parseFloat(price), service_id: parseInt(service_id) }
    });
    res.status(201).json({ success: true, data: addon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding add-on' });
  }
};

exports.deleteAddon = async (req, res) => {
  try {
    await prisma.addon.delete({ where: { id: parseInt(req.params.id) } });
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
    const mechanic = await prisma.mechanic.create({ data: { name, phone, email } });
    res.status(201).json({ success: true, data: mechanic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding mechanic' });
  }
};

exports.deleteMechanic = async (req, res) => {
  try {
    await prisma.mechanic.delete({ where: { id: parseInt(req.params.id) } });
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
