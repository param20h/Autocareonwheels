const prisma = require('../utils/prisma');

// Default settings payload
const DEFAULT_SETTINGS = {
  businessStatus: 'OPEN',
  announcements: [],
  holidays: []
};

// @desc    Get system settings (public)
// @route   GET /api/v1/settings/public
// @access  Public
exports.getPublicSettings = async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'system_settings' }
    });
    
    if (setting) {
      try {
        const parsedValue = JSON.parse(setting.value);
        return res.status(200).json({
          success: true,
          data: {
            businessStatus: parsedValue.businessStatus || 'OPEN',
            announcements: parsedValue.announcements || [],
            holidays: parsedValue.holidays || []
          }
        });
      } catch (parseErr) {
        console.error('Error parsing settings JSON:', parseErr);
        return res.status(200).json({ success: true, data: DEFAULT_SETTINGS });
      }
    }
    
    return res.status(200).json({ success: true, data: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Save system settings (admin-only)
// @route   POST /api/v1/settings
// @access  Private/Admin
exports.saveSettings = async (req, res) => {
  try {
    const { businessStatus, announcements, holidays } = req.body;

    // Validate inputs
    if (businessStatus && !['OPEN', 'CLOSED'].includes(businessStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid business status value' });
    }

    const newSettings = {
      businessStatus: businessStatus || 'OPEN',
      announcements: Array.isArray(announcements) ? announcements : [],
      holidays: Array.isArray(holidays) ? holidays : []
    };

    const valueStr = JSON.stringify(newSettings);

    // Upsert key system_settings using Prisma
    await prisma.setting.upsert({
      where: { key: 'system_settings' },
      update: { value: valueStr },
      create: { key: 'system_settings', value: valueStr }
    });

    res.status(200).json({
      success: true,
      message: 'Settings saved successfully',
      data: newSettings
    });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
