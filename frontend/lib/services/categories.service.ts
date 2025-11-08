/**
 * Categories Service
 * 
 * Business logic for categories management.
 */

import type { Category } from '@/types';

/**
 * Build category tree from flat array
 * 
 * @param categories - Flat array of categories
 * @returns Hierarchical tree structure
 */
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // Create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build the tree
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!;

    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        // Parent not found, treat as root
        rootCategories.push(node);
      }
    } else {
      rootCategories.push(node);
    }
  });

  return rootCategories;
}

/**
 * Check if category can be deleted
 * 
 * @param category - Category to check
 * @returns true if can be deleted
 */
export function canDeleteCategory(category: Category): boolean {
  // Cannot delete if has children
  if (category.children && category.children.length > 0) {
    return false;
  }

  // Cannot delete if has products (check _count)
  if (category._count?.products && category._count.products > 0) {
    return false;
  }

  return true;
}

/**
 * Get category path (breadcrumb)
 * 
 * @param categoryId - Category ID
 * @param categories - All categories
 * @returns Array of categories from root to current
 */
export function getCategoryPath(
  categoryId: string,
  categories: Category[]
): Category[] {
  const path: Category[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categories.find((c) => c.id === currentId);
    if (!category) break;

    path.unshift(category);
    currentId = category.parentId;
  }

  return path;
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
 * Get all descendant category IDs
 * 
 * @param categoryId - Parent category ID
 * @param categories - All categories
 * @returns Array of descendant IDs
 */
export function getDescendantIds(
  categoryId: string,
  categories: Category[]
): string[] {
  const descendants: string[] = [];

  function findDescendants(parentId: string) {
    const children = categories.filter((c) => c.parentId === parentId);
    children.forEach((child) => {
      descendants.push(child.id);
      findDescendants(child.id);
    });
  }

  findDescendants(categoryId);
  return descendants;
}

/**
 * Check for circular reference
 * 
 * @param categoryId - Category ID
 * @param newParentId - New parent ID
 * @param categories - All categories
 * @returns true if circular reference detected
 */
export function hasCircularReference(
  categoryId: string,
  newParentId: string | null,
  categories: Category[]
): boolean {
  if (!newParentId) return false;
  if (categoryId === newParentId) return true;

  // Check if newParentId is a descendant of categoryId
  const descendants = getDescendantIds(categoryId, categories);
  return descendants.includes(newParentId);
}

/**
 * Get category level (depth in tree)
 * 
 * @param categoryId - Category ID
 * @param categories - All categories
 * @returns Level (0 for root, 1 for first level, etc.)
 */
export function getCategoryLevel(
  categoryId: string,
  categories: Category[]
): number {
  let level = 0;
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = categories.find((c) => c.id === currentId);
    if (!category || !category.parentId) break;

    level++;
    currentId = category.parentId;
  }

  return level;
}

/**
 * Sort categories by name
 * 
 * @param categories - Categories to sort
 * @param locale - Locale for sorting (ar or en)
 * @returns Sorted categories
 */
export function sortCategories(
  categories: Category[],
  locale: string = 'ar'
): Category[] {
  return [...categories].sort((a, b) => {
    return a.name.localeCompare(b.name, locale);
  });
}

