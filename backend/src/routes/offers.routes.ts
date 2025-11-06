import { Router } from 'express';
import offersController from '../controllers/offers.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createOfferSchema, updateOfferSchema } from '../validators/offer.validator';

const router = Router();

/**
 * @route   GET /api/v1/products/:productId/offers
 * @desc    Get all offers for a product
 * @access  Public
 */
router.get('/products/:productId/offers', offersController.getProductOffers);

/**
 * @route   POST /api/v1/offers
 * @desc    Create new offer
 * @access  Private (Vendor only)
 */
router.post(
  '/',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(createOfferSchema),
  offersController.createOffer
);

/**
 * @route   PUT /api/v1/offers/:id
 * @desc    Update offer
 * @access  Private (Vendor owner only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(updateOfferSchema),
  offersController.updateOffer
);

/**
 * @route   DELETE /api/v1/offers/:id
 * @desc    Delete offer
 * @access  Private (Vendor owner only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  offersController.deleteOffer
);

export default router;
