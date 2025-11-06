import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      sendError(res, message, 400);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      sendError(res, message, 401);
    }
  }

  /**
   * Get current user
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }

      const user = await authService.getMe(req.user.id);
      sendSuccess(res, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      sendError(res, message, 400);
    }
  }
}

export default new AuthController();
