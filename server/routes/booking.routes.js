const express = require('express');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
