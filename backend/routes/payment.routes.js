import express from 'express';
import { createPaymentForBooking, getPaymentByTransaction } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/booking/:bookingId').post(protect, createPaymentForBooking);
router.route('/transaction/:transactionId').get(protect, getPaymentByTransaction);

export default router;