const express = require('express');
const { createBooking, getMyBookings } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my', getMyBookings);

module.exports = router;
