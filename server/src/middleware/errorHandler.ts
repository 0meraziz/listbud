import { Request, Response, NextFunction } from 'express';
import { logError, logWarn } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string | number;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

// Error handler middleware
export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // Log error details
  if (statusCode >= 500) {
    logError(`${req.method} ${req.path} - ${message}`, {
      error: error.stack,
      userId: (req as any).user?.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  } else {
    logWarn(`${req.method} ${req.path} - ${message}`, {
      statusCode,
      userId: (req as any).user?.id,
      ip: req.ip,
    });
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Send error response
  const errorResponse: any = {
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
  };

  // Add more details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = error;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Unhandled promise rejection handler
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logError('Unhandled Rejection at:', { promise, reason });
    // Close server & exit process
    process.exit(1);
  });
};

// Uncaught exception handler
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    logError('Uncaught Exception:', error);
    // Close server & exit process
    process.exit(1);
  });
};

export default errorHandler;
