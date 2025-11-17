import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const { hostel, room, startDate, endDate, totalAmount, paymentMethod } = req.body;

  if (!hostel || !room || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  // Check for existing active bookings
  const existingBooking = await Booking.findOne({ 
    student: req.user._id,
    status: { $ne: 'cancelled' },
    endDate: { $gte: new Date() }
  });
  
  if (existingBooking) {
    res.status(400);
    throw new Error('You already have an active booking. Please cancel or wait for it to expire before booking again.');
  }

  // Handle both ObjectId and string inputs
  let hostelId = hostel;
  let roomId = room;
  let hostelName = hostel;
  let roomName = room;
  
  // If hostel is a string (name), try to find by name
  if (typeof hostel === 'string' && !hostel.match(/^[0-9a-fA-F]{24}$/)) {
    const Hostel = (await import('../models/hostel.model.js')).default;
    const hostelDoc = await Hostel.findOne({ name: new RegExp(hostel, 'i') });
    if (hostelDoc) {
      hostelId = hostelDoc._id;
      hostelName = hostelDoc.name;
    }
  }
  
  // If room is a string (name), store it directly
  if (typeof room === 'string' && !room.match(/^[0-9a-fA-F]{24}$/)) {
    roomId = room;
    roomName = room;
  }

  const booking = new Booking({
    student: req.user._id,
    hostel: hostelId,
    room: roomId,
    hostelName: hostelName,
    roomName: roomName,
    totalAmount: totalAmount,
    paymentMethod: paymentMethod,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  const createdBooking = await booking.save();
  
  // Populate user data for response
  await createdBooking.populate('student', 'name email phone');
  
  res.status(201).json(createdBooking);
});

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const Hostel = (await import('../models/hostel.model.js')).default;
  
  const bookings = await Booking.find({ student: req.user._id })
    .populate('payment', 'amount paymentMethod status')
    .sort({ createdAt: -1 });
  
  // Enrich bookings with hostel and room details
  const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
    const bookingObj = booking.toObject();
    
    // Handle hostel - could be ObjectId or string
    if (mongoose.Types.ObjectId.isValid(booking.hostel)) {
      const hostel = await Hostel.findById(booking.hostel);
      if (hostel) {
        bookingObj.hostelName = hostel.name;
        bookingObj.hostelLocation = hostel.location;
        
        // Handle room - could be ObjectId or string
        if (mongoose.Types.ObjectId.isValid(booking.room)) {
          const room = hostel.rooms.id(booking.room);
          if (room) {
            bookingObj.roomName = room.name;
            bookingObj.roomPrice = room.price;
            bookingObj.roomType = room.type;
          }
        } else {
          // Room is a string, try to find by name
          const room = hostel.rooms.find(r => r.name === booking.room);
          if (room) {
            bookingObj.roomName = room.name;
            bookingObj.roomPrice = room.price;
            bookingObj.roomType = room.type;
          } else {
            bookingObj.roomName = booking.room;
          }
        }
      }
    } else {
      // Hostel is a string (name)
      bookingObj.hostelName = booking.hostel;
      bookingObj.roomName = booking.room;
    }
    
    return bookingObj;
  }));
  
  res.json(enrichedBookings);
});

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  
  booking.status = 'cancelled';
  booking.cancellationReason = reason;
  booking.cancelledAt = new Date();
  await booking.save();
  
  res.json({ message: 'Booking cancelled successfully' });
});

export { createBooking, getMyBookings, cancelBooking };