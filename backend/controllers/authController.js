const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Authenticate a student
// @route   POST /api/auth/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for student email
  const student = await Student.findOne({ email });

  if (student && (await bcrypt.compare(password, student.password))) {
    res.json({
      _id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      role: student.role || 'student', // Default role to 'student' if not set
      token: generateToken(student._id, student.role || 'student'),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

module.exports = {
  loginStudent,
};