const express = require('express');
const { createBooking, getMyBookings, cancelBooking, deleteMyBooking } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);
router.delete('/:id', deleteMyBooking);

module.exports = router;
