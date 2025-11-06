import prisma from '../config/database';
import { CreateOfferInput, UpdateOfferInput } from '../validators/offer.validator';

export class OffersService {
  /**
   * Get product offers
   */
  async getProductOffers(productId: string) {
    const offers = await prisma.offer.findMany({
      where: {
        productId,
        isActive: true,
      },
      include: {
        store: true,
        product: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            images: true,
          },
        },
      },
      orderBy: {
        discountedPrice: 'asc',
      },
    });

    return offers;
  }

  /**
   * Create offer (Vendor only)
   */
  async createOffer(userId: string, data: CreateOfferInput) {
    // Verify user owns the store
    const store = await prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    if (store.userId !== userId) {
      throw new Error('Not authorized to create offer for this store');
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate discount percentage
    const discountPercent = Math.round(
      ((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100
    );

    const offer = await prisma.offer.create({
      data: {
        ...data,
        discountPercent,
      },
      include: {
        product: true,
        store: true,
      },
    });

    return offer;
  }

  /**
   * Update offer (Vendor only)
   */
  async updateOffer(id: string, userId: string, data: UpdateOfferInput) {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.store.userId !== userId) {
      throw new Error('Not authorized to update this offer');
    }

    // Recalculate discount percentage if prices changed
    let discountPercent = offer.discountPercent;
    if (data.originalPrice || data.discountedPrice) {
      const originalPrice = data.originalPrice || offer.originalPrice.toNumber();
      const discountedPrice = data.discountedPrice || offer.discountedPrice.toNumber();
      discountPercent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        ...data,
        discountPercent,
      },
      include: {
        product: true,
        store: true,
      },
    });

    return updatedOffer;
  }

  /**
   * Delete offer (Vendor only)
   */
  async deleteOffer(id: string, userId: string) {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.store.userId !== userId) {
      throw new Error('Not authorized to delete this offer');
    }

    await prisma.offer.delete({
      where: { id },
    });

    return { message: 'Offer deleted successfully' };
  }
}

export default new OffersService();
