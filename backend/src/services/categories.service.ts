import prisma from '../config/database';

export class CategoriesService {
  /**
   * Get all categories
   */
  async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            slug: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            slug: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories;
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
        },
        products: {
          where: { status: 'ACTIVE' },
          take: 20,
          include: {
            offers: {
              where: { isActive: true },
              take: 1,
              orderBy: {
                discountedPrice: 'asc',
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Create category (Admin only)
   */
  async createCategory(data: any) {
    // Check if slug already exists
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new Error('Category with this slug already exists');
    }

    // Verify parent exists if provided
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const category = await prisma.category.create({
      data,
      include: {
        parent: true,
      },
    });

    return category;
  }

  /**
   * Update category (Admin only)
   */
  async updateCategory(id: string, data: any) {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if new slug already exists
    if (data.slug && data.slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new Error('Category with this slug already exists');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
      },
    });

    return category;
  }

  /**
   * Delete category (Admin only)
   */
  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category._count.products > 0) {
      throw new Error('Cannot delete category with products');
    }

    if (category._count.children > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    await prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}

export default new CategoriesService();
