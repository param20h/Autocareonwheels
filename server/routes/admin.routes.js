const express = require('express');
const { 
  getAllBookings, updateBookingStatus, deleteBooking,
  createService, updateService, deleteService,
  createAddon, deleteAddon,
  getAllMechanics, createMechanic, deleteMechanic,
  getAllCustomers
} = require('../controllers/admin.controller');
const { protect, authorizeRole } = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(protect);
router.use(authorizeRole('ADMIN'));

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// Services
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Add-ons
router.post('/addons', createAddon);
router.delete('/addons/:id', deleteAddon);

// Mechanics
router.get('/mechanics', getAllMechanics);
router.post('/mechanics', createMechanic);
router.delete('/mechanics/:id', deleteMechanic);

// Customers
router.get('/customers', getAllCustomers);

module.exports = router;
