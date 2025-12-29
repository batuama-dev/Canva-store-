const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/checkoutController');

// @route   POST /api/checkout/create-checkout-session
// @desc    Créer une session de paiement Stripe
// @access  Public
router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
