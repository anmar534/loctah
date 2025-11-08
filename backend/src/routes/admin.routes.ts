import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /admin/stats - Dashboard statistics
router.get('/stats', async (_req, res) => {
  try {
    const [storesCount, productsCount, offersCount, usersCount] = await Promise.all([
      prisma.store.count(),
      prisma.product.count(),
      prisma.offer.count(),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        stores: storesCount,
        products: productsCount,
        offers: offersCount,
        users: usersCount,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
});

// ==================== STORES ====================

// GET /admin/stores - List stores with pagination
router.get('/stores', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.city) where.city = req.query.city;
    if (req.query.status) where.status = req.query.status;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.store.count({ where }),
    ]);

    res.json({ stores, total, page, limit });
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// GET /admin/stores/:id - Get single store
router.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
    });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    return res.json(store);
  } catch (error) {
    console.error('Failed to fetch store:', error);
    return res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// POST /admin/stores - Create store
router.post('/stores', async (req, res) => {
  try {
    const store = await prisma.store.create({
      data: req.body,
    });
    res.status(201).json(store);
  } catch (error) {
    console.error('Failed to create store:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// PUT /admin/stores/:id - Update store
router.put('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(store);
  } catch (error) {
    console.error('Failed to update store:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

// DELETE /admin/stores/:id - Delete store
router.delete('/stores/:id', async (req, res) => {
  try {
    await prisma.store.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete store:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
});

// PATCH /admin/stores/:id/toggle - Toggle store status
router.patch('/stores/:id/toggle', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
    });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const updated = await prisma.store.update({
      where: { id: req.params.id },
      data: { isActive: !store.isActive },
    });
    return res.json(updated);
  } catch (error) {
    console.error('Failed to toggle store status:', error);
    return res.status(500).json({ error: 'Failed to toggle store status' });
  }
});

// ==================== CATEGORIES ====================

// GET /admin/categories - List categories
router.get('/categories', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.category.count(),
    ]);

    res.json({ categories, total, page, limit });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /admin/categories/tree - Get category tree
router.get('/categories/tree', async (req, res) => {
  try {
    const lang = (req.query.lang as string) || 'ar'; // Default to Arabic
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    
    // Transform to include 'name' field based on language
    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: lang === 'ar' ? cat.nameAr : cat.nameEn,
      description: cat.nameEn, // Use English as description for now
      parentId: cat.parentId,
      image: cat.imageUrl,
      productCount: cat._count?.products || 0,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
      isActive: cat.isActive,
    }));
    
    res.json(transformedCategories);
  } catch (error) {
    console.error('Failed to fetch category tree:', error);
    res.status(500).json({ error: 'Failed to fetch category tree' });
  }
});

// GET /admin/categories/:id - Get single category
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /admin/categories - Create category
router.post('/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Failed to create category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /admin/categories/:id - Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /admin/categories/:id - Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ==================== PRODUCTS ====================

// GET /admin/products - List products
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.brand) where.brand = req.query.brand;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page, limit });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /admin/products/:id - Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /admin/products - Create product
router.post('/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==================== OFFERS ====================

// GET /admin/offers - List offers with pagination
router.get('/offers', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.storeId) where.storeId = req.query.storeId;

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              images: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.offer.count({ where }),
    ]);

    res.json({ offers, total, page, limit });
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// GET /admin/offers/:id - Get single offer
router.get('/offers/:id', async (req, res) => {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id: req.params.id },
      include: {
        product: true,
        store: true,
      },
    });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    return res.json(offer);
  } catch (error) {
    console.error('Failed to fetch offer:', error);
    return res.status(500).json({ error: 'Failed to fetch offer' });
  }
});

// POST /admin/offers - Create offer
router.post('/offers', async (req, res) => {
  try {
    const offer = await prisma.offer.create({
      data: req.body,
    });
    res.status(201).json(offer);
  } catch (error) {
    console.error('Failed to create offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// PUT /admin/offers/:id - Update offer
router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await prisma.offer.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(offer);
  } catch (error) {
    console.error('Failed to update offer:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

// DELETE /admin/offers/:id - Delete offer
router.delete('/offers/:id', async (req, res) => {
  try {
    await prisma.offer.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete offer:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

// ==================== USERS ====================

// GET /admin/users - List users
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.role) where.role = req.query.role;
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    
    // Transform isActive to status for frontend compatibility
    const transformedUsers = users.map(user => ({
      ...user,
      status: user.isActive ? 'active' as const : 'disabled' as const,
    }));

    res.json({ users: transformedUsers, total, page, limit });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /admin/users/:id - Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /admin/users/:id - Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// PATCH /admin/users/:id/toggle - Toggle user status
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json(updated);
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    return res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

export default router;
