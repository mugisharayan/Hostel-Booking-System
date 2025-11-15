// server/controllers/user.controller.js
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      course: user.course,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      yearOfStudy: user.yearOfStudy,
      studentNumber: user.studentNumber,
      residence: user.residence,
      nextOfKinName: user.nextOfKinName,
      nextOfKinContact: user.nextOfKinContact,
      guardianName: user.guardianName,
      guardianContact: user.guardianContact,
      profileCompleted: user.profileCompleted,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, name, email, phone, course, gender, dateOfBirth, yearOfStudy, studentNumber, residence, nextOfKin, guardian, notes, healthIssues, role, password } = req.body;

  console.log('Registration attempt:', { email, name: name || fullName, role });

  const userName = name || fullName;
  if (!userName || !email || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const normalizedEmail = email.toLowerCase().trim();
  console.log('Checking for existing user with email:', normalizedEmail);
  
  const userExists = await User.findOne({ email: normalizedEmail });
  console.log('User exists check result:', !!userExists);
  
  if (userExists) {
    console.log('Found existing user:', userExists._id, userExists.email);
    res.status(400);
    throw new Error('User already exists');
  }
  
  console.log('No existing user found, proceeding with registration');

  try {
    const user = await User.create({
      name: userName,
      email: normalizedEmail,
      password: password || 'defaultPassword123',
      phone: phone || '',
      role,
    });
    
    console.log('User created successfully:', user._id);

    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(201).json({
        _id: user._id,
        fullName: user.name,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (createError) {
    console.error('User creation error:', createError);
    res.status(500);
    throw new Error('Failed to create user: ' + createError.message);
  }
});

/**
 * @desc    Auth user & set token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  console.log('Login request:', req.body.email);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('User logged in successfully:', user.email);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      fullName: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      course: user.course,
      profilePicture: user.profilePicture,
      token: token,
    });
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.fullName || req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.course = req.body.course || user.course;
    user.gender = req.body.gender || user.gender;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.yearOfStudy = req.body.yearOfStudy || user.yearOfStudy;
    user.studentNumber = req.body.studentNumber || user.studentNumber;
    user.residence = req.body.residence || user.residence;
    user.nextOfKinName = req.body.nextOfKinName || user.nextOfKinName;
    user.nextOfKinContact = req.body.nextOfKinContact || user.nextOfKinContact;
    user.guardianName = req.body.guardianName || user.guardianName;
    user.guardianContact = req.body.guardianContact || user.guardianContact;
    user.profileCompleted = req.body.profileCompleted !== undefined ? req.body.profileCompleted : user.profileCompleted;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      fullName: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      course: updatedUser.course,
      gender: updatedUser.gender,
      dateOfBirth: updatedUser.dateOfBirth,
      yearOfStudy: updatedUser.yearOfStudy,
      studentNumber: updatedUser.studentNumber,
      residence: updatedUser.residence,
      nextOfKinName: updatedUser.nextOfKinName,
      nextOfKinContact: updatedUser.nextOfKinContact,
      guardianName: updatedUser.guardianName,
      guardianContact: updatedUser.guardianContact,
      profileCompleted: updatedUser.profileCompleted,
      profilePicture: updatedUser.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
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
