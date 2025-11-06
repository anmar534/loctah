import prisma from '../config/database';

export class FavoritesService {
  /**
   * Get user favorites
   */
  async getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: {
              select: {
                nameAr: true,
                nameEn: true,
              },
            },
            offers: {
              where: { isActive: true },
              take: 1,
              orderBy: {
                discountedPrice: 'asc',
              },
              include: {
                store: {
                  select: {
                    name: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites;
  }

  /**
   * Add to favorites
   */
  async addToFavorites(userId: string, productId: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new Error('Product already in favorites');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    return favorite;
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { message: 'Removed from favorites' };
  }

  /**
   * Check if product is favorited
   */
  async isFavorited(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { isFavorited: !!favorite };
  }
}

export default new FavoritesService();
