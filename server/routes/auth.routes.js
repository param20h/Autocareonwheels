const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');
const router = express.Router();

const registerValidation = [
	body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('phone').optional({ values: 'falsy' }).isLength({ min: 8, max: 20 }).withMessage('Phone must be 8-20 characters'),
	body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
	body('role').optional().isIn(['CUSTOMER', 'WORKER']).withMessage('Role must be CUSTOMER or WORKER'),
	validateRequest,
];

const loginValidation = [
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('password').isString().notEmpty().withMessage('Password is required'),
	validateRequest,
];

const googleValidation = [
	body('token').isString().notEmpty().withMessage('Google token is required'),
	validateRequest,
];

const updateProfileValidation = [
	body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
	body('phone').optional({ values: 'falsy' }).isLength({ min: 8, max: 20 }).withMessage('Phone must be 8-20 characters'),
	validateRequest,
];

const changePasswordValidation = [
	body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
	body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
	validateRequest,
];

// Existing Auth
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/password', protect, changePasswordValidation, changePassword);

// Google OAuth
router.post('/google', googleValidation, googleLogin);

module.exports = router;
