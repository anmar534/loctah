import prisma from '../config/database';
import { CreateStoreInput, UpdateStoreInput } from '../validators/store.validator';

export class StoresService {
  /**
   * Get all stores
   */
  async getStores(city?: string) {
    const where: any = { isActive: true };
    
    if (city) {
      where.city = city;
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            offers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return stores;
  }

  /**
   * Get store by ID
   */
  async getStoreById(id: string) {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        offers: {
          where: { isActive: true },
          include: {
            product: {
              select: {
                id: true,
                nameAr: true,
                nameEn: true,
                slug: true,
                images: true,
              },
            },
          },
          take: 10,
        },
      },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }

  /**
   * Create store (Vendor only)
   */
  async createStore(userId: string, data: CreateStoreInput) {
    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId },
    });

    if (existingStore) {
      throw new Error('User already has a store');
    }

    // Check if slug already exists
    const existingSlug = await prisma.store.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new Error('Store with this slug already exists');
    }

    const store = await prisma.store.create({
      data: {
        ...data,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }

  /**
   * Update store
   */
  async updateStore(id: string, userId: string, userRole: string, data: UpdateStoreInput) {
    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Only owner or admin can update
    if (store.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Not authorized to update this store');
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedStore;
  }

  /**
   * Delete store (Admin only)
   */
  async deleteStore(id: string) {
    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    await prisma.store.delete({
      where: { id },
    });

    return { message: 'Store deleted successfully' };
  }
}

export default new StoresService();
