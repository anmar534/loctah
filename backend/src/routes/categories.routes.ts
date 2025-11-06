import { Router } from 'express';
import categoriesController from '../controllers/categories.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoriesController.getCategories);

/**
 * @route   GET /api/v1/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
router.get('/slug/:slug', categoriesController.getCategoryBySlug);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', categoriesController.getCategory);

/**
 * @route   POST /api/v1/categories
 * @desc    Create category
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  categoriesController.createCategory
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  categoriesController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  categoriesController.deleteCategory
);

export default router;
