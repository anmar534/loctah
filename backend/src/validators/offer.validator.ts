import { z } from 'zod';

/**
 * Create offer validation schema
 */
export const createOfferSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    storeId: z.string().uuid('Invalid store ID'),
    originalPrice: z.number().positive('Original price must be positive'),
    discountedPrice: z.number().positive('Discounted price must be positive'),
    validUntil: z.string().datetime().optional(),
  }).refine((data) => data.discountedPrice < data.originalPrice, {
    message: 'Discounted price must be less than original price',
  }),
});

/**
 * Update offer validation schema
 */
export const updateOfferSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid offer ID'),
  }),
  body: z.object({
    originalPrice: z.number().positive().optional(),
    discountedPrice: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    validUntil: z.string().datetime().optional(),
  }),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>['body'];
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>['body'];
