import { Router } from 'express';
import favoritesController from '../controllers/favorites.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/favorites
 * @desc    Get user favorites
 * @access  Private
 */
router.get('/', authenticate, favoritesController.getFavorites);

/**
 * @route   POST /api/v1/favorites
 * @desc    Add product to favorites
 * @access  Private
 */
router.post('/', authenticate, favoritesController.addToFavorites);

/**
 * @route   DELETE /api/v1/favorites/:productId
 * @desc    Remove product from favorites
 * @access  Private
 */
router.delete('/:productId', authenticate, favoritesController.removeFromFavorites);

/**
 * @route   GET /api/v1/favorites/check/:productId
 * @desc    Check if product is favorited
 * @access  Private
 */
router.get('/check/:productId', authenticate, favoritesController.checkFavorite);

export default router;
