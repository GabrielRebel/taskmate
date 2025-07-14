// TaskMate Error Handling Middleware
// Centralized error handling for consistent error responses and logging

const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.details : undefined
    });
  }

  if (err.name === 'ApiError') {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.response : undefined
    });
  }

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      success: false,
      error: 'Database Constraint Error',
      message: 'The operation violates a database constraint'
    });
  }

  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'External service is currently unavailable'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// 404 handler for unmatched routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
};

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError
}; 