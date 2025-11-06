import { z } from 'zod';

/**
 * Create store validation schema
 */
export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Store name must be at least 2 characters'),
    slug: z.string().min(1, 'Slug is required'),
    phone: z.string().min(10, 'Phone must be at least 10 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    logoUrl: z.string().url().optional(),
  }),
});

/**
 * Update store validation schema
 */
export const updateStoreSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid store ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    logoUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>['body'];
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>['body'];
