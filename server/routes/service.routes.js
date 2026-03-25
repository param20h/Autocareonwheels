const express = require('express');
const { getServices } = require('../controllers/service.controller');
const router = express.Router();

router.get('/', getServices);

module.exports = router;
