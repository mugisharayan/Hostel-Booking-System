import Payment from '../models/payment.model.js';
import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Create a payment for a booking
 * @route   POST /api/payments/booking/:bookingId
 * @access  Private
 */
const createPaymentForBooking = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, transactionId } = req.body;
  const { bookingId } = req.params;

  // Validate required fields
  if (!amount || !paymentMethod || !transactionId) {
    res.status(400);
    throw new Error('Please provide all payment details');
  }

  // Validate amount
  if (amount < 1000) {
    res.status(400);
    throw new Error('Minimum payment amount is UGX 1,000');
  }

  // Validate payment method
  const validMethods = ['Mobile Money', 'Credit Card', 'Bank Transfer'];
  if (!validMethods.includes(paymentMethod)) {
    res.status(400);
    throw new Error('Invalid payment method');
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verify booking belongs to authenticated user
  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to make payment for this booking');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({ booking: bookingId });
  if (existingPayment) {
    res.status(400);
    throw new Error('Payment already exists for this booking');
  }

  const payment = new Payment({
    booking: bookingId,
    student: req.user._id,
    amount,
    paymentMethod,
    transactionId,
    status: 'Completed',
  });

  const createdPayment = await payment.save();

  // Link payment to the booking
  booking.payment = createdPayment._id;
  await booking.save();

  res.status(201).json({
    _id: createdPayment._id,
    booking: bookingId,
    amount: createdPayment.amount,
    paymentMethod: createdPayment.paymentMethod,
    transactionId: createdPayment.transactionId,
    status: createdPayment.status,
    createdAt: createdPayment.createdAt
  });
});

/**
 * @desc    Get payment by transaction ID
 * @route   GET /api/payments/transaction/:transactionId
 * @access  Private
 */
const getPaymentByTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  
  const payment = await Payment.findOne({ transactionId })
    .populate('booking', 'hostel room')
    .populate('student', 'name email');
  
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }
  
  // Verify payment belongs to authenticated user
  if (payment.student._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this payment');
  }
  
  res.json(payment);
});

export { createPaymentForBooking, getPaymentByTransaction };