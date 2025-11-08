/**
 * Category Transformer
 * 
 * Transform category data between form and API formats.
 */

import type { Category } from '@/types';

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

/**
 * Transform category form data to API format
 * 
 * @param formData - Form data from user input
 * @param imageUrl - Uploaded image URL
 * @returns Data ready for API submission
 */
export function transformCategoryFormData(
  formData: CategoryFormData,
  imageUrl?: string
): any {
  return {
    name: formData.name.trim(),
    slug: formData.slug.trim().toLowerCase(),
    description: formData.description?.trim() || undefined,
    parentId: formData.parentId || null,
    image: imageUrl || undefined,
  };
}

/**
 * Transform API category data to form format
 * 
 * @param category - Category from API
 * @returns Form data and image URL
 */
export function transformCategoryToForm(category: Category): {
  formData: CategoryFormData;
  imageUrl?: string;
} {
  return {
    formData: {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || undefined,
    },
    imageUrl: category.image || undefined,
  };
}

/**
 * Flatten category tree to array
 * 
 * @param tree - Category tree
 * @returns Flat array of categories
 */
export function flattenCategoryTree(tree: Category[]): Category[] {
  const result: Category[] = [];

  function traverse(categories: Category[]) {
    categories.forEach((category) => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        traverse(category.children);
      }
    });
  }

  traverse(tree);
  return result;
}

/**
 * Transform category for display
 * 
 * @param category - Category from API
 * @returns Display-ready category
 */
export function transformCategoryForDisplay(category: Category): Category {
  return {
    ...category,
    // Add any display-specific transformations here
  };
}

