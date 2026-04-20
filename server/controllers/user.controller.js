const prisma = require('../utils/prisma');

const toPositiveInt = (value) => {
	const parsed = Number.parseInt(value, 10);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

exports.getProfile = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { id: true, name: true, email: true, phone: true, role: true, avatar_url: true, created_at: true },
		});
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
	}
};

exports.getDashboardSummary = async (req, res) => {
	try {
		const [bookings, vehicles] = await Promise.all([
			prisma.booking.findMany({ where: { user_id: req.user.id }, select: { status: true, total_price: true } }),
			prisma.vehicle.count({ where: { user_id: req.user.id } }),
		]);

		const summary = {
			totalBookings: bookings.length,
			pending: bookings.filter((b) => b.status === 'PENDING').length,
			completed: bookings.filter((b) => b.status === 'COMPLETED').length,
			totalSpent: Number(bookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0).toFixed(2)),
			vehicleCount: vehicles,
		};

		res.status(200).json({ success: true, data: summary });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to fetch dashboard summary' });
	}
};

exports.getMyVehicles = async (req, res) => {
	try {
		const vehicles = await prisma.vehicle.findMany({
			where: { user_id: req.user.id },
			orderBy: { id: 'desc' },
		});
		res.status(200).json({ success: true, data: vehicles });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
	}
};

exports.createVehicle = async (req, res) => {
	try {
		const { make, model, year, reg_number } = req.body;
		const parsedYear = toPositiveInt(year);

		if (!make || !model || !parsedYear || !reg_number) {
			return res.status(400).json({ success: false, message: 'Invalid vehicle payload' });
		}

		const vehicle = await prisma.vehicle.create({
			data: {
				user_id: req.user.id,
				make,
				model,
				year: parsedYear,
				reg_number,
			},
		});

		res.status(201).json({ success: true, data: vehicle });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to create vehicle' });
	}
};

exports.deleteVehicle = async (req, res) => {
	try {
		const vehicleId = toPositiveInt(req.params.id);
		if (!vehicleId) {
			return res.status(400).json({ success: false, message: 'Invalid vehicle id' });
		}

		const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
		if (!vehicle || vehicle.user_id !== req.user.id) {
			return res.status(404).json({ success: false, message: 'Vehicle not found' });
		}

		await prisma.vehicle.delete({ where: { id: vehicleId } });
		res.status(200).json({ success: true, message: 'Vehicle deleted' });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
	}
};
