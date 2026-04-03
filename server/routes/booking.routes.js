const express = require('express');
const {
	createBooking,
	getMyBookings,
	cancelBooking,
	deleteMyBooking,
	getStaffBookings,
	createOrGetInvoice,
	downloadInvoice,
} = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/staff', getStaffBookings);
router.put('/:id/cancel', cancelBooking);
router.delete('/:id', deleteMyBooking);
router.post('/:id/invoice', createOrGetInvoice);
router.get('/:id/invoice/download', downloadInvoice);

module.exports = router;
