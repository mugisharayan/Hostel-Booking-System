// server/controllers/user.controller.js
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import {
  generateToken,
  comparePasswords,
  transformUserResponse,
  transformAuthResponse,
  validateRegistrationData,
  validateLoginData,
  validatePasswordChange,
  normalizeEmail,
  updateUserFields,
  DEFAULT_PASSWORD
} from '../utils/auth.helpers.js';
import { sanitizeInput } from '../utils/validation.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(transformUserResponse(user));
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const registrationData = {
    fullName: sanitizeInput(req.body.fullName),
    name: sanitizeInput(req.body.name),
    email: sanitizeInput(req.body.email),
    phone: sanitizeInput(req.body.phone),
    role: sanitizeInput(req.body.role),
    password: req.body.password
  };

  // Validate input data
  const validation = validateRegistrationData(registrationData);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  const normalizedEmail = normalizeEmail(registrationData.email);
  
  // Check if user already exists
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name: validation.userName,
    email: normalizedEmail,
    password: registrationData.password || DEFAULT_PASSWORD,
    phone: registrationData.phone || '',
    role: registrationData.role,
  });

  const token = generateToken(user._id);
  res.status(201).json(transformAuthResponse(user, token));
});

/**
 * @desc    Auth user & set token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const loginData = {
    email: sanitizeInput(req.body.email),
    password: req.body.password
  };

  // Validate input data
  const validation = validateLoginData(loginData);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  const user = await User.findOne({ 
    email: normalizeEmail(loginData.email) 
  });

  if (!user || !(await comparePasswords(loginData.password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  res.json(transformAuthResponse(user, token));
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user fields using helper function
  updateUserFields(user, req.body);
  const updatedUser = await user.save();

  res.json(transformUserResponse(updatedUser));
});

const changePassword = asyncHandler(async (req, res) => {
  const passwordData = {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword
  };

  // Validate input data
  const validation = validatePasswordChange(passwordData);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await comparePasswords(passwordData.currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = passwordData.newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

// Temporary debug endpoint - remove in production
const debugUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, 'email name createdAt');
  console.log('All users in database:', users);
  res.json(users);
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  debugUsers,
};
