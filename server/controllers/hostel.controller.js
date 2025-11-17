import Hostel from '../models/hostel.model.js';
import Review from '../models/review.model.js';
import { AppError, catchAsync } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * @desc    Fetch all hostels
 * @route   GET /api/hostels
 * @access  Public
 */
const getHostels = catchAsync(async (req, res) => {
  logger.info('Fetching all hostels');
  
  // Only return active hostels with custodian populated
  const hostels = await Hostel.find({ isActive: true })
    .populate('custodian', 'name email phone')
    .sort({ createdAt: -1 });
  
  if (!hostels) {
    throw new AppError('No hostels found', 404);
  }
  
  // Calculate real ratings for each hostel
  const hostelsWithRatings = await Promise.all(
    hostels.map(async (hostel) => {
      const reviews = await Review.find({ hostel: hostel._id });
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...hostel.toObject(),
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
      };
    })
  );
  
  logger.info('Hostels fetched successfully', { count: hostelsWithRatings.length });
  
  res.status(200).json({
    status: 'success',
    results: hostelsWithRatings.length,
    data: hostelsWithRatings
  });
});

/**
 * @desc    Fetch single hostel
 * @route   GET /api/hostels/:id
 * @access  Public
 */
const getHostelById = catchAsync(async (req, res) => {
  const { id } = req.params;
  logger.info('Fetching hostel by ID', { hostelId: id });
  
  const hostel = await Hostel.findById(id)
    .populate('custodian', 'name email phone');
    
  if (!hostel || !hostel.isActive) {
    throw new AppError('Hostel not found', 404);
  }
  
  logger.info('Hostel fetched successfully', { hostelId: id, hostelName: hostel.name });
  
  res.status(200).json({
    status: 'success',
    data: hostel
  });
});

/**
 * @desc    Fetch single hostel by slug
 * @route   GET /api/hostels/slug/:slug
 * @access  Public
 */
const getHostelBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  logger.info('Fetching hostel by slug', { slug });
  
  const hostel = await Hostel.findOne({ slug, isActive: true })
    .populate('custodian', 'name email phone');
    
  if (!hostel) {
    throw new AppError('Hostel not found', 404);
  }
  
  logger.info('Hostel fetched by slug successfully', { slug, hostelName: hostel.name });
  
  res.status(200).json({
    status: 'success',
    data: hostel
  });
});

/**
 * @desc    Create a new review
 * @route   POST /api/hostels/:id/reviews
 * @access  Private
 */
const createHostelReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  logger.info('Creating hostel review', { hostelId: id, userId: req.user?._id });
  
  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }
  
  const hostel = await Hostel.findById(id);
  if (!hostel) {
    throw new AppError('Hostel not found', 404);
  }
  
  // Check if user has already reviewed this hostel
  const existingReview = await Review.findOne({
    student: req.user._id,
    hostel: id
  });
  
  if (existingReview) {
    throw new AppError('You have already reviewed this hostel', 400);
  }
  
  const review = new Review({
    rating: Number(rating),
    comment,
    student: req.user._id,
    hostel: id,
  });
  
  await review.save();
  
  logger.info('Review created successfully', { 
    reviewId: review._id, 
    hostelId: id, 
    rating 
  });
  
  res.status(201).json({
    status: 'success',
    message: 'Review added successfully',
    data: review
  });
});

export { getHostels, getHostelById, getHostelBySlug, createHostelReview };