import { Router } from 'express';
import storesController from '../controllers/stores.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createStoreSchema, updateStoreSchema } from '../validators/store.validator';

const router = Router();

/**
 * @route   GET /api/v1/stores
 * @desc    Get all stores (with optional city filter)
 * @access  Public
 */
router.get('/', storesController.getStores);

/**
 * @route   GET /api/v1/stores/:id
 * @desc    Get store by ID
 * @access  Public
 */
router.get('/:id', storesController.getStore);

/**
 * @route   POST /api/v1/stores
 * @desc    Create new store
 * @access  Private (Vendor, Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(createStoreSchema),
  storesController.createStore
);

/**
 * @route   PUT /api/v1/stores/:id
 * @desc    Update store
 * @access  Private (Vendor owner, Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('VENDOR', 'ADMIN'),
  validate(updateStoreSchema),
  storesController.updateStore
);

/**
 * @route   DELETE /api/v1/stores/:id
 * @desc    Delete store
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  storesController.deleteStore
);

export default router;
