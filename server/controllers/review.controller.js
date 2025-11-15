import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const { hostel, booking: bookingId, rating, comment } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to review this booking');
  }

  // Check if review already exists for this booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this booking');
  }

  const review = await Review.create({
    student: req.user._id,
    hostel,
    booking: bookingId,
    rating,
    comment,
  });

  const populatedReview = await Review.findById(review._id)
    .populate('student', 'name email');

  res.status(201).json(populatedReview);
});

/**
 * @desc    Get reviews for a hostel
 * @route   GET /api/reviews/hostel/:hostelId
 * @access  Public
 */
const getHostelReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ hostel: req.params.hostelId })
    .populate('student', 'name email')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ student: req.user._id })
    .populate('hostel', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export { createReview, getHostelReviews, getMyReviews };
