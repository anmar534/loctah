import { Request, Response } from 'express';
import offersService from '../services/offers.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class OffersController {
  async getProductOffers(req: Request, res: Response): Promise<void> {
    try {
      const offers = await offersService.getProductOffers(req.params.productId);
      sendSuccess(res, offers);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get offers';
      sendError(res, message);
    }
  }

  async createOffer(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const offer = await offersService.createOffer(req.user.id, req.body);
      sendSuccess(res, offer, 'Offer created successfully', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create offer';
      sendError(res, message, 400);
    }
  }

  async updateOffer(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const offer = await offersService.updateOffer(req.params.id, req.user.id, req.body);
      sendSuccess(res, offer, 'Offer updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update offer';
      sendError(res, message, 400);
    }
  }

  async deleteOffer(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const result = await offersService.deleteOffer(req.params.id, req.user.id);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete offer';
      sendError(res, message, 400);
    }
  }
}

export default new OffersController();
