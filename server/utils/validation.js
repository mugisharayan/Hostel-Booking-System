import mongoose from 'mongoose';

// Validation utilities
export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const isObjectIdString = (str) => {
  return typeof str === 'string' && str.match(/^[0-9a-fA-F]{24}$/);
};

export const validateBookingData = (data) => {
  const { hostel, room, startDate, endDate } = data;
  const errors = [];

  if (!hostel) errors.push('Hostel is required');
  if (!room) errors.push('Room is required');
  if (!startDate) errors.push('Start date is required');
  if (!endDate) errors.push('End date is required');

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      errors.push('End date must be after start date');
    }
    
    if (start < new Date()) {
      errors.push('Start date cannot be in the past');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};