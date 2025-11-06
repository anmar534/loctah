import { Request, Response } from 'express';
import categoriesService from '../services/categories.service';
import { sendSuccess, sendError } from '../utils/response.util';

export class CategoriesController {
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoriesService.getCategories();
      sendSuccess(res, categories);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get categories';
      sendError(res, message);
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoriesService.getCategoryById(req.params.id);
      sendSuccess(res, category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get category';
      sendError(res, message, 404);
    }
  }

  async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoriesService.getCategoryBySlug(req.params.slug);
      sendSuccess(res, category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get category';
      sendError(res, message, 404);
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoriesService.createCategory(req.body);
      sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      sendError(res, message, 400);
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await categoriesService.updateCategory(req.params.id, req.body);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update category';
      sendError(res, message, 400);
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const result = await categoriesService.deleteCategory(req.params.id);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
      sendError(res, message, 400);
    }
  }
}

export default new CategoriesController();
