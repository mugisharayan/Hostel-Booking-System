// Service utility functions

// API response handling
export const handleApiResponse = (response) => {
  if (response?.data) {
    return response.data;
  }
  throw new Error('Invalid API response format');
};

export const handleApiError = (error, context = '') => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  const errorContext = context ? ` in ${context}` : '';
  
  console.error(`API Error${errorContext}:`, errorMessage);
  
  // Create a standardized error object
  const standardError = new Error(errorMessage);
  standardError.status = error.response?.status;
  standardError.context = context;
  
  throw standardError;
};

// Service method wrapper
export const createServiceMethod = (apiCall, context = '') => {
  return async (...args) => {
    try {
      const response = await apiCall(...args);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error, context);
    }
  };
};

// Data validation utilities
export const validateRequired = (data, requiredFields) => {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

// Service configuration
export const SERVICE_CONTEXTS = {
  AUTH: 'authentication',
  BOOKING: 'booking',
  HOSTEL: 'hostel',
  USER: 'user profile',
  PAYMENT: 'payment'
};

// Common service patterns
export const createCRUDService = (apiService, context) => ({
  getAll: createServiceMethod(() => apiService.getAll(), `get all ${context}`),
  getById: createServiceMethod((id) => apiService.getById(id), `get ${context} by ID`),
  create: createServiceMethod((data) => apiService.create(data), `create ${context}`),
  update: createServiceMethod((id, data) => apiService.update(id, data), `update ${context}`),
  delete: createServiceMethod((id) => apiService.delete(id), `delete ${context}`)
});