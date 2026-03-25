const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all bookings
// @route   GET /api/v1/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, phone: true, email: true } }, service: true, mechanic: true },
      orderBy: { created_at: 'desc' } // show newest additions first
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving system bookings' });
  }
};

// @desc    Update a booking status (Assign Mechanic / Complete)
// @route   PUT /api/v1/admin/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, mechanic_id } = req.body;
    
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { 
        status, 
        mechanic_id: mechanic_id ? parseInt(mechanic_id) : undefined 
      },
      include: { user: true, service: true }
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating booking execution state' });
  }
};

// @desc    Add a new Service to the catalog
// @route   POST /api/v1/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration_mins, category_id, image_url } = req.body;
    
    // Ensure Category exists (Fallback to creating a general one if none exist)
    let category = await prisma.category.findFirst({ where: { id: category_id ? parseInt(category_id) : 1 } });
    if (!category) {
       category = await prisma.category.create({ data: { name: 'General Maintenance', display_order: 1 } });
    }

    const service = await prisma.service.create({
      data: {
        name, 
        description, 
        price: parseFloat(price), 
        duration_mins: parseInt(duration_mins), 
        image_url,
        category_id: category.id
      }
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding service to database' });
  }
};
