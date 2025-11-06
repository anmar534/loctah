import { Router } from 'express';
import productsController from '../controllers/products.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from '../validators/product.validator';

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filters
 * @access  Public
 */
router.get('/', validate(getProductsQuerySchema), productsController.getProducts);

/**
 * @route   GET /api/v1/products/slug/:slug
 * @desc    Get product by slug
 * @access  Public
 */
router.get('/slug/:slug', productsController.getProductBySlug);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productsController.getProduct);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  productsController.createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  productsController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  productsController.deleteProduct
);

export default router;
