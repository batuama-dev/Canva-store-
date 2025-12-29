// backend/routes/sales.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.createSale);

router.get('/download/:token', saleController.verifyDownload);
router.post('/confirm-stripe-session', saleController.confirmStripeSession);

module.exports = router;