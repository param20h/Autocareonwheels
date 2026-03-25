const express = require('express');
const { register, login, googleLogin, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

// Existing Auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth
router.post('/google', googleLogin);

module.exports = router;
