const express = require('express');
const { getAllBookings, updateBookingStatus, createService } = require('../controllers/admin.controller');
const { protect, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

// Secure all admin routes explicitly
router.use(protect);
router.use(authorizeRole('ADMIN'));

router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBookingStatus);
router.post('/services', createService);

module.exports = router;
