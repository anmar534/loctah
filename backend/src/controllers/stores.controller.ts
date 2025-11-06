import { Request, Response } from 'express';
import storesService from '../services/stores.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class StoresController {
  async getStores(req: Request, res: Response): Promise<void> {
    try {
      const city = req.query.city as string | undefined;
      const stores = await storesService.getStores(city);
      sendSuccess(res, stores);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get stores';
      sendError(res, message);
    }
  }

  async getStore(req: Request, res: Response): Promise<void> {
    try {
      const store = await storesService.getStoreById(req.params.id);
      sendSuccess(res, store);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get store';
      sendError(res, message, 404);
    }
  }

  async createStore(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const store = await storesService.createStore(req.user.id, req.body);
      sendSuccess(res, store, 'Store created successfully', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create store';
      sendError(res, message, 400);
    }
  }

  async updateStore(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const store = await storesService.updateStore(
        req.params.id,
        req.user.id,
        req.user.role,
        req.body
      );
      sendSuccess(res, store, 'Store updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update store';
      sendError(res, message, 400);
    }
  }

  async deleteStore(req: Request, res: Response): Promise<void> {
    try {
      const result = await storesService.deleteStore(req.params.id);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete store';
      sendError(res, message, 400);
    }
  }
}

export default new StoresController();
