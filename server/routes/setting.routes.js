const express = require('express');
const { getPublicSettings, saveSettings } = require('../controllers/setting.controller');
const { protect, authorizeRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public settings route
router.get('/public', getPublicSettings);

// Admin-only settings route
router.post('/', protect, authorizeRole('ADMIN'), saveSettings);

module.exports = router;
