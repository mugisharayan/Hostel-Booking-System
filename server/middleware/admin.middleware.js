import { asyncMiddleware, createErrorResponse } from '../utils/middleware.helpers.js';

// Role constants
export const ROLES = {
  STUDENT: 'student',
  CUSTODIAN: 'custodian',
  ADMIN: 'admin'
};

/**
 * @desc    Check if user has admin/custodian role
 * @access  Private routes requiring admin access
 */
export const admin = asyncMiddleware((req, res, next) => {
  if (!req.user) {
    return createErrorResponse(res, 401, 'Authentication required');
  }

  const userRole = req.user.role?.toLowerCase();
  const allowedRoles = ['custodian', 'admin'];
  
  if (!allowedRoles.includes(userRole)) {
    return createErrorResponse(
      res, 
      403, 
      'Access denied - Admin or Custodian role required'
    );
  }

  next();
});

/**
 * @desc    Check if user has custodian role specifically
 * @access  Private routes requiring custodian access
 */
export const custodian = asyncMiddleware((req, res, next) => {
  if (!req.user) {
    return createErrorResponse(res, 401, 'Authentication required');
  }

  const userRole = req.user.role?.toLowerCase();
  
  if (userRole !== ROLES.CUSTODIAN) {
    return createErrorResponse(
      res, 
      403, 
      'Access denied - Custodian role required'
    );
  }

  next();
});

/**
 * @desc    Check if user has student role
 * @access  Private routes requiring student access
 */
export const student = asyncMiddleware((req, res, next) => {
  if (!req.user) {
    return createErrorResponse(res, 401, 'Authentication required');
  }

  const userRole = req.user.role?.toLowerCase();
  
  if (userRole !== ROLES.STUDENT) {
    return createErrorResponse(
      res, 
      403, 
      'Access denied - Student role required'
    );
  }

  next();
});

/**
 * @desc    Check if user has any of the specified roles
 * @param   {string[]} allowedRoles - Array of allowed roles
 */
export const hasRole = (allowedRoles = []) => {
  return asyncMiddleware((req, res, next) => {
    if (!req.user) {
      return createErrorResponse(res, 401, 'Authentication required');
    }

    const userRole = req.user.role?.toLowerCase();
    const normalizedRoles = allowedRoles.map(role => role.toLowerCase());
    
    if (!normalizedRoles.includes(userRole)) {
      return createErrorResponse(
        res, 
        403, 
        `Access denied - Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  });
};

/**
 * @desc    Check if user has permission for specific resource
 * @param   {string} permission - Permission name
 */
export const hasPermission = (permission) => {
  return asyncMiddleware((req, res, next) => {
    if (!req.user) {
      return createErrorResponse(res, 401, 'Authentication required');
    }

    // This would be expanded based on a more complex permission system
    const userPermissions = getUserPermissions(req.user.role);
    
    if (!userPermissions.includes(permission)) {
      return createErrorResponse(
        res, 
        403, 
        `Access denied - Missing permission: ${permission}`
      );
    }

    next();
  });
};

/**
 * @desc    Get permissions based on user role
 * @param   {string} role - User role
 * @returns {string[]} Array of permissions
 */
const getUserPermissions = (role) => {
  const permissions = {
    [ROLES.ADMIN]: [
      'read:all',
      'write:all',
      'delete:all',
      'manage:users',
      'manage:hostels',
      'manage:bookings'
    ],
    [ROLES.CUSTODIAN]: [
      'read:hostels',
      'write:hostels',
      'read:bookings',
      'write:bookings',
      'manage:rooms'
    ],
    [ROLES.STUDENT]: [
      'read:hostels',
      'write:bookings',
      'read:own-bookings',
      'write:reviews'
    ]
  };

  return permissions[role?.toLowerCase()] || [];
};
