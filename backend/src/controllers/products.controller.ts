import { Request, Response } from 'express';
import productsService from '../services/products.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { GetProductsQuery } from '../validators/product.validator';

export class ProductsController {
  /**
   * Get all products
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const result = await productsService.getProducts(req.query as unknown as GetProductsQuery);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get products';
      sendError(res, message);
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productsService.getProductById(req.params.id);
      sendSuccess(res, product);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get product';
      sendError(res, message, 404);
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const product = await productsService.getProductBySlug(req.params.slug);
      sendSuccess(res, product);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get product';
      sendError(res, message, 404);
    }
  }

  /**
   * Create product
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productsService.createProduct(req.body);
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      sendError(res, message, 400);
    }
  }

  /**
   * Update product
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await productsService.updateProduct(req.params.id, req.body);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      sendError(res, message, 400);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const result = await productsService.deleteProduct(req.params.id);
      sendSuccess(res, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      sendError(res, message, 400);
    }
  }
}

export default new ProductsController();
