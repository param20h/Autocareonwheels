const express = require('express');
const { protect, authorizeRole } = require('../middlewares/auth.middleware');
const prisma = require('../utils/prisma');

const router = express.Router();

router.get('/available', async (req, res) => {
	try {
		const mechanics = await prisma.mechanic.findMany({
			where: { is_available: true },
			orderBy: { id: 'desc' },
		});
		res.status(200).json({ success: true, data: mechanics });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to fetch available mechanics' });
	}
});

router.use(protect);
router.use(authorizeRole('ADMIN'));

router.get('/', async (req, res) => {
	try {
		const mechanics = await prisma.mechanic.findMany({ orderBy: { id: 'desc' } });
		res.status(200).json({ success: true, data: mechanics });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to fetch mechanics' });
	}
});

router.put('/:id/availability', async (req, res) => {
	try {
		const id = Number.parseInt(req.params.id, 10);
		const { is_available } = req.body;
		if (!Number.isInteger(id) || id <= 0 || typeof is_available !== 'boolean') {
			return res.status(400).json({ success: false, message: 'Invalid payload' });
		}

		const mechanic = await prisma.mechanic.update({
			where: { id },
			data: { is_available },
		});

		res.status(200).json({ success: true, data: mechanic });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Failed to update mechanic availability' });
	}
});

module.exports = router;
