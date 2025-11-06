import { z } from 'zod';

/**
 * Create product validation schema
 */
export const createProductSchema = z.object({
  body: z.object({
    nameAr: z.string().min(2, 'Arabic name must be at least 2 characters'),
    nameEn: z.string().min(2, 'English name must be at least 2 characters'),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    slug: z.string().min(1, 'Slug is required'),
    brand: z.string().optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

/**
 * Update product validation schema
 */
export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    nameAr: z.string().min(2).optional(),
    nameEn: z.string().min(2).optional(),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    sku: z.string().optional(),
    slug: z.string().optional(),
    brand: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

/**
 * Get products query validation
 */
export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>['query'];
