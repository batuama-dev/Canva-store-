// backend/routes/sales.js
const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.createSale);

// Nouvelle route pour le téléchargement via le proxy backend
router.get('/download/:saleId', saleController.downloadProduct);

router.post('/confirm-stripe-session', saleController.confirmStripeSession);

module.exports = router;