import prisma from '../config/database';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../validators/product.validator';
import { Prisma } from '@prisma/client';

export class ProductsService {
  /**
   * Get all products with filters and pagination
   */
  async getProducts(query: GetProductsQuery) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { nameEn: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.status) {
      where.status = query.status;
    }

    // Execute query
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
              slug: true,
            },
          },
          offers: {
            where: { isActive: true },
            include: {
              store: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  logoUrl: true,
                },
              },
            },
            orderBy: {
              discountedPrice: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        offers: {
          where: { isActive: true },
          include: {
            store: true,
          },
          orderBy: {
            discountedPrice: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        offers: {
          where: { isActive: true },
          include: {
            store: true,
          },
          orderBy: {
            discountedPrice: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Create new product (Admin only)
   */
  async createProduct(data: CreateProductInput) {
    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      throw new Error('Product with this SKU already exists');
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new Error('Product with this slug already exists');
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
      },
    });

    return product;
  }

  /**
   * Update product (Admin only)
   */
  async updateProduct(id: string, data: UpdateProductInput) {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Check if new SKU already exists
    if (data.sku && data.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        throw new Error('Product with this SKU already exists');
      }
    }

    // Check if new slug already exists
    if (data.slug && data.slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new Error('Product with this slug already exists');
      }
    }

    // Verify category exists if being updated
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new Error('Category not found');
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return product;
  }

  /**
   * Delete product (Admin only)
   */
  async deleteProduct(id: string) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}

export default new ProductsService();
