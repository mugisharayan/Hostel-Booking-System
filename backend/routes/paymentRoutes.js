

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const auth = require('../middleware/auth');

const paymentController = new PaymentController();

// Payment initiation
router.post('/initiate', auth, (req, res) => paymentController.initiatePayment(req, res));

// Payment processing
router.post('/process', auth, (req, res) => paymentController.processPayment(req, res));

// Get payment details
router.get('/:paymentId', auth, (req, res) => paymentController.getPaymentDetails(req, res));

module.exports = router;