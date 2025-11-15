import Favorite from '../models/favorite.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Get user's favorites
 * @route   GET /api/favorites
 * @access  Private
 */
const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ student: req.user._id })
    .populate('hostel')
    .sort({ createdAt: -1 });

  res.json(favorites);
});

/**
 * @desc    Add hostel to favorites
 * @route   POST /api/favorites/:hostelId
 * @access  Private
 */
const addFavorite = asyncHandler(async (req, res) => {
  const { hostelId } = req.params;

  // Check if already favorited
  const existingFavorite = await Favorite.findOne({
    student: req.user._id,
    hostel: hostelId,
  });

  if (existingFavorite) {
    res.status(400);
    throw new Error('Hostel already in favorites');
  }

  const favorite = await Favorite.create({
    student: req.user._id,
    hostel: hostelId,
  });

  const populatedFavorite = await Favorite.findById(favorite._id).populate('hostel');
  res.status(201).json(populatedFavorite);
});

/**
 * @desc    Remove hostel from favorites
 * @route   DELETE /api/favorites/:hostelId
 * @access  Private
 */
const removeFavorite = asyncHandler(async (req, res) => {
  const { hostelId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    student: req.user._id,
    hostel: hostelId,
  });

  if (!favorite) {
    res.status(404);
    throw new Error('Favorite not found');
  }

  res.json({ message: 'Favorite removed successfully' });
});

export { getMyFavorites, addFavorite, removeFavorite };
