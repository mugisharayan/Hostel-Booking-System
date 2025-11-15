// Middleware helper utilities

// Error response helper
export const createErrorResponse = (res, statusCode, message, errors = []) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

// Success response helper
export const createSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Async middleware wrapper
export const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Rate limiting helper
export const createRateLimitConfig = (windowMs, max, message) => {
  return {
    windowMs,
    max,
    message: {
      success: false,
      message,
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false
  };
};

// CORS configuration helper
export const createCorsConfig = (allowedOrigins = []) => {
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
};

// Request logging helper
export const createRequestLogger = (options = {}) => {
  const { includeBody = false, excludePaths = [] } = options;
  
  return (req, res, next) => {
    // Skip logging for excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }
    
    const start = Date.now();
    const { method, url, ip } = req;
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip}`);
    
    if (includeBody && req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    
    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  };
};

// Security headers helper
export const addSecurityHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CSP header for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
  }
  
  next();
};

// Request validation helper
export const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next();
    }
    
    const contentType = req.get('Content-Type');
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return createErrorResponse(res, 400, 'Invalid Content-Type header');
    }
    
    next();
  };
};