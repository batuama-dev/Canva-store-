// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getSalesStats);
router.get('/recent-sales', adminController.getRecentSales);
router.get('/activity-logs', adminController.getActivityLogs);

module.exports = router;