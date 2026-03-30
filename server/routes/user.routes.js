const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
	getProfile,
	getDashboardSummary,
	getMyVehicles,
	createVehicle,
	deleteVehicle,
} = require('../controllers/user.controller');

const router = express.Router();

router.use(protect);

router.get('/me', getProfile);
router.get('/summary', getDashboardSummary);
router.get('/vehicles', getMyVehicles);
router.post('/vehicles', createVehicle);
router.delete('/vehicles/:id', deleteVehicle);

module.exports = router;
