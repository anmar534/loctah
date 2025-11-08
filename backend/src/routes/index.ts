import { Router } from 'express';
import authRoutes from './auth.routes';
import productsRoutes from './products.routes';
import categoriesRoutes from './categories.routes';
import storesRoutes from './stores.routes';
import offersRoutes from './offers.routes';
import favoritesRoutes from './favorites.routes';
import adminRoutes from './admin.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/stores', storesRoutes);
router.use('/offers', offersRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
