const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();
const dealalertRoutes = require('./dealalert');

// Health endpoint
router.get('/', healthController.check.bind(healthController));

// Main API routes
router.use('/api', dealalertRoutes);

module.exports = router;
