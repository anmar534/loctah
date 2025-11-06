import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { config } from '../config/env';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    sendError(res, 'Database error occurred', 500);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    sendError(res, 'Invalid or expired token', 401);
    return;
  }

  // Default error
  const message = config.isDevelopment ? err.message : 'Internal server error';
  sendError(res, message, 500);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
