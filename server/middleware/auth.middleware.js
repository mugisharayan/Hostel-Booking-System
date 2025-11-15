import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { asyncMiddleware, createErrorResponse } from '../utils/middleware.helpers.js';

/**
 * @desc    Protect routes - Authentication middleware
 * @access  Private routes
 */
export const protect = asyncMiddleware(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return createErrorResponse(res, 401, 'User not found');
      }
      
      // Check if user is active
      if (req.user.isActive === false) {
        return createErrorResponse(res, 401, 'User account is deactivated');
      }
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return createErrorResponse(res, 401, 'Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        return createErrorResponse(res, 401, 'Invalid token');
      }
      
      return createErrorResponse(res, 401, 'Not authorized');
    }
  }

  if (!token) {
    return createErrorResponse(res, 401, 'Not authorized, no token provided');
  }
});

/**
 * @desc    Optional authentication middleware
 * @access  Public routes that can benefit from user context
 */
export const optionalAuth = asyncMiddleware(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Silently fail for optional auth
      console.warn('Optional auth failed:', error.message);
    }
  }

  next();
});

/**
 * @desc    Check if user owns the resource
 * @param   {string} resourceField - Field name to check ownership
 */
export const checkOwnership = (resourceField = 'user') => {
  return asyncMiddleware(async (req, res, next) => {
    const resourceId = req.params.id;
    
    // This would need to be customized based on the resource model
    // For now, we'll check if the user ID matches
    if (req.user._id.toString() !== resourceId) {
      return createErrorResponse(res, 403, 'Access denied - not resource owner');
    }
    
    next();
  });
};

/**
 * @desc    Rate limiting for authentication attempts
 */
const authAttempts = new Map();

export const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip + req.body.email;
    const now = Date.now();
    
    if (!authAttempts.has(key)) {
      authAttempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const attempts = authAttempts.get(key);
    
    if (now > attempts.resetTime) {
      authAttempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (attempts.count >= maxAttempts) {
      return createErrorResponse(
        res, 
        429, 
        `Too many authentication attempts. Try again in ${Math.ceil((attempts.resetTime - now) / 60000)} minutes.`
      );
    }
    
    attempts.count++;
    next();
  };
};

/**
 * @desc    Clean up expired rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of authAttempts.entries()) {
    if (now > value.resetTime) {
      authAttempts.delete(key);
    }
  }
}, 60000); // Clean up every minute
