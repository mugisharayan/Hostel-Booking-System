import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';
import { validateBookingData, sanitizeInput } from '../utils/validation.js';
import { 
  resolveHostelReference, 
  resolveRoomReference, 
  checkExistingBooking 
} from '../utils/booking.helpers.js';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const bookingData = {
    hostel: sanitizeInput(req.body.hostel),
    room: sanitizeInput(req.body.room),
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalAmount: req.body.totalAmount,
    paymentMethod: req.body.paymentMethod
  };

  // Validate input data
  const validation = validateBookingData(bookingData);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  // Check for existing active bookings
  const existingBooking = await checkExistingBooking(req.user._id);
  if (existingBooking) {
    res.status(400);
    throw new Error('You already have an active booking. Please cancel or wait for it to expire before booking again.');
  }

  // Resolve hostel and room references
  const [hostelRef, roomRef] = await Promise.all([
    resolveHostelReference(bookingData.hostel),
    Promise.resolve(resolveRoomReference(bookingData.room))
  ]);

  // Create booking
  const booking = new Booking({
    student: req.user._id,
    hostel: hostelRef.id,
    room: roomRef.id,
    hostelName: hostelRef.name,
    roomName: roomRef.name,
    totalAmount: bookingData.totalAmount,
    paymentMethod: bookingData.paymentMethod,
    startDate: new Date(bookingData.startDate),
    endDate: new Date(bookingData.endDate),
  });

  const createdBooking = await booking.save();
  await createdBooking.populate('student', 'name email phone');
  
  res.status(201).json(createdBooking);
});

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id })
    .populate('payment', 'amount paymentMethod status')
    .sort({ createdAt: -1 });
  
  // Enrich bookings with hostel and room details
  const { enrichBookingWithHostelData } = await import('../utils/booking.helpers.js');
  const enrichedBookings = await Promise.all(
    bookings.map(enrichBookingWithHostelData)
  );
  
  res.json(enrichedBookings);
});

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const bookingId = sanitizeInput(req.params.id);
  
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  // Check authorization
  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  
  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }
  
  // Update booking status
  Object.assign(booking, {
    status: 'cancelled',
    cancellationReason: sanitizeInput(reason) || 'No reason provided',
    cancelledAt: new Date()
  });
  
  await booking.save();
  
  res.json({ 
    message: 'Booking cancelled successfully',
    booking: {
      id: booking._id,
      status: booking.status,
      cancelledAt: booking.cancelledAt
    }
  });
});

export { createBooking, getMyBookings, cancelBooking };