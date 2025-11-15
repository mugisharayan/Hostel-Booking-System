import bcrypt from 'bcryptjs';

// Constants for models
export const GENDER_TYPES = ['male', 'female'];
export const USER_ROLES = ['student', 'custodian'];
export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
export const PAYMENT_METHODS = ['cash', 'card', 'mobile_money', 'bank_transfer'];

// Password utilities
export const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Schema field definitions
export const createEmailField = () => ({
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  validate: {
    validator: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    message: 'Please provide a valid email address'
  }
});

export const createRequiredStringField = (options = {}) => ({
  type: String,
  required: true,
  trim: true,
  ...options
});

export const createOptionalStringField = (options = {}) => ({
  type: String,
  trim: true,
  ...options
});

export const createEnumField = (enumValues, required = false) => ({
  type: String,
  enum: enumValues,
  required,
  lowercase: true
});

// Pre-save middleware factory
export const createPasswordHashMiddleware = () => {
  return async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    
    try {
      this.password = await hashPassword(this.password);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Instance methods factory
export const createPasswordMatchMethod = () => {
  return async function(enteredPassword) {
    return await comparePassword(enteredPassword, this.password);
  };
};