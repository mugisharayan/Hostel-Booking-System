import { createErrorResponse } from '../utils/middleware.helpers.js';

/**
 * @desc    Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return createErrorResponse(res, 404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return createErrorResponse(res, 400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return createErrorResponse(res, 400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return createErrorResponse(res, 401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return createErrorResponse(res, 401, message);
  }

  // Default error
  createErrorResponse(
    res,
    error.statusCode || 500,
    error.message || 'Server Error'
  );
};

/**
 * @desc    Handle 404 errors for undefined routes
 */
export const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  createErrorResponse(res, 404, message);
};

/**
 * @desc    Development error handler with stack trace
 */
export const developmentErrorHandler = (err, req, res, next) => {
  console.error('Development Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
    timestamp: new Date().toISOString()
  });
};

/**
 * @desc    Production error handler (no stack trace)
 */
export const productionErrorHandler = (err, req, res, next) => {
  // Log error but don't expose details
  console.error('Production Error:', err.message);

  // Only send error details for operational errors
  if (err.isOperational) {
    return createErrorResponse(res, err.statusCode || 500, err.message);
  }

  // For programming errors, send generic message
  createErrorResponse(res, 500, 'Something went wrong');
};

/**
 * @desc    Async error catcher wrapper
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * @desc    Create operational error
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}