const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all active services
// @route   GET /api/v1/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { is_active: true },
      include: { category: true, addons: true }
    });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
