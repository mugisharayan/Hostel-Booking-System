import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Constants
export const TOKEN_EXPIRY = '30d';
export const DEFAULT_PASSWORD = 'defaultPassword123';

// JWT utilities
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Password utilities
export const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// User data transformation
export const transformUserResponse = (user) => {
  return {
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
  };
};

export const transformAuthResponse = (user, token) => {
  return {
    ...transformUserResponse(user),
    token,
  };
};

// Input validation
export const validateRegistrationData = (data) => {
  const { fullName, name, email, role } = data;
  const userName = name || fullName;
  
  const errors = [];
  
  if (!userName) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (!role) errors.push('Role is required');
  
  if (email && !isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    userName
  };
};

export const validateLoginData = (data) => {
  const { email, password } = data;
  const errors = [];
  
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePasswordChange = (data) => {
  const { currentPassword, newPassword } = data;
  const errors = [];
  
  if (!currentPassword) errors.push('Current password is required');
  if (!newPassword) errors.push('New password is required');
  if (newPassword && newPassword.length < 6) {
    errors.push('New password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

export const updateUserFields = (user, updateData) => {
  const fieldsToUpdate = [
    'name', 'fullName', 'email', 'phone', 'course', 'gender', 
    'dateOfBirth', 'yearOfStudy', 'studentNumber', 'residence',
    'nextOfKinName', 'nextOfKinContact', 'guardianName', 'guardianContact',
    'profilePicture'
  ];
  
  fieldsToUpdate.forEach(field => {
    if (updateData[field] !== undefined) {
      if (field === 'name') {
        user.name = updateData.fullName || updateData.name || user.name;
      } else {
        user[field] = updateData[field] || user[field];
      }
    }
  });
  
  if (updateData.profileCompleted !== undefined) {
    user.profileCompleted = updateData.profileCompleted;
  }
  
  return user;
};