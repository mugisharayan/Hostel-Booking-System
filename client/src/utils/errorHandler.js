// Error handling utility
import { logger } from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error, context = '') => {
  const errorMessage = error?.message || 'Unknown error occurred';
  const errorCode = error?.statusCode || error?.status || 500;
  
  logger.error(`${context}: ${errorMessage}`, {
    statusCode: errorCode,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });

  return {
    message: errorCode >= 500 ? 'Something went wrong. Please try again.' : errorMessage,
    statusCode: errorCode
  };
};

export const asyncErrorHandler = (fn) => {
  return (...args) => {
    Promise.resolve(fn(...args)).catch((error) => {
      handleError(error, 'Async operation failed');
    });
  };
};