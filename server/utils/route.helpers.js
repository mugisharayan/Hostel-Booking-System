import express from 'express';

// Route creation utilities
export const createRouter = () => express.Router();

// Route grouping utilities
export const createProtectedRoute = (router, path, controller, middleware = []) => {
  return router.route(path).all(...middleware, controller);
};

export const createPublicRoute = (router, method, path, controller, middleware = []) => {
  return router[method](path, ...middleware, controller);
};

// Route validation middleware factory
export const validateRouteParams = (paramValidators) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.entries(paramValidators).forEach(([param, validator]) => {
      const value = req.params[param];
      if (!validator(value)) {
        errors.push(`Invalid ${param} parameter`);
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    next();
  };
};

// Common route patterns
export const createCRUDRoutes = (router, basePath, controller, middleware = []) => {
  router.route(basePath)
    .get(...middleware, controller.getAll)
    .post(...middleware, controller.create);
    
  router.route(`${basePath}/:id`)
    .get(...middleware, controller.getById)
    .put(...middleware, controller.update)
    .delete(...middleware, controller.delete);
    
  return router;
};

// Response utilities
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Internal server error', statusCode = 500, errors = []) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

// Route documentation helper
export const routeDoc = (description, method, path, access = 'Public') => {
  return {
    description,
    method: method.toUpperCase(),
    path,
    access
  };
};

// Common middleware combinations
export const publicRoutes = [];
export const protectedRoutes = (middleware) => [middleware];
export const adminRoutes = (authMiddleware, adminMiddleware) => [authMiddleware, adminMiddleware];