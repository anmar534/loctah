import { Request, Response } from 'express';
import favoritesService from '../services/favorites.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class FavoritesController {
  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const favorites = await favoritesService.getFavorites(req.user.id);
      sendSuccess(res, favorites);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get favorites';
      sendError(res, message);
    }
  }

  async addToFavorites(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const favorite = await favoritesService.addToFavorites(req.user.id, req.body.productId);
      sendSuccess(res, favorite, 'Added to favorites', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add to favorites';
      sendError(res, message, 400);
    }
  }

  async removeFromFavorites(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const result = await favoritesService.removeFromFavorites(req.user.id, req.params.productId);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove from favorites';
      sendError(res, message, 400);
    }
  }

  async checkFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const result = await favoritesService.isFavorited(req.user.id, req.params.productId);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check favorite';
      sendError(res, message);
    }
  }
}

export default new FavoritesController();
