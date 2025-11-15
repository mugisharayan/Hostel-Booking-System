import { createErrorResponse } from '../utils/middleware.helpers.js';
import { validateObjectId } from '../utils/validation.js';

/**
 * @desc    Validate request body against schema
 * @param   {Object} schema - Validation schema
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    // Check required fields
    if (schema.required) {
      schema.required.forEach(field => {
        if (!req.body[field]) {
          errors.push(`${field} is required`);
        }
      });
    }
    
    // Check field types and formats
    if (schema.fields) {
      Object.entries(schema.fields).forEach(([field, rules]) => {
        const value = req.body[field];
        
        if (value !== undefined) {
          // Type validation
          if (rules.type && typeof value !== rules.type) {
            errors.push(`${field} must be of type ${rules.type}`);
          }
          
          // String length validation
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must not exceed ${rules.maxLength} characters`);
          }
          
          // Number range validation
          if (rules.min && value < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
          
          if (rules.max && value > rules.max) {
            errors.push(`${field} must not exceed ${rules.max}`);
          }
          
          // Pattern validation
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${field} format is invalid`);
          }
          
          // Custom validation
          if (rules.validate && !rules.validate(value)) {
            errors.push(rules.message || `${field} is invalid`);
          }
        }
      });
    }
    
    if (errors.length > 0) {
      return createErrorResponse(res, 400, 'Validation failed', errors);
    }
    
    next();
  };
};

/**
 * @desc    Validate MongoDB ObjectId parameters
 * @param   {string[]} params - Parameter names to validate
 */
export const validateObjectIds = (params = ['id']) => {
  return (req, res, next) => {
    const errors = [];
    
    params.forEach(param => {
      const value = req.params[param];
      if (value && !validateObjectId(value)) {
        errors.push(`Invalid ${param} format`);
      }
    });
    
    if (errors.length > 0) {
      return createErrorResponse(res, 400, 'Invalid parameters', errors);
    }
    
    next();
  };
};

/**
 * @desc    Sanitize request data
 */
export const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]*>/g, '')
              .trim();
  };
  
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    });
    
    return sanitized;
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

// Common validation schemas
export const schemas = {
  user: {
    register: {
      required: ['name', 'email', 'role'],
      fields: {
        name: { type: 'string', minLength: 2, maxLength: 50 },
        email: { 
          type: 'string', 
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please provide a valid email address'
        },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', validate: (val) => ['student', 'custodian'].includes(val.toLowerCase()) }
      }
    }
  },
  
  booking: {
    create: {
      required: ['hostel', 'room', 'startDate', 'endDate'],
      fields: {
        hostel: { type: 'string', minLength: 1 },
        room: { type: 'string', minLength: 1 },
        totalAmount: { type: 'number', min: 0 }
      }
    }
  }
};