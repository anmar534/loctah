/**
 * Products Service
 * 
 * Business logic for products management.
 */

import type { Product } from '@/types';

/**
 * Validate product images
 * 
 * @param images - Array of image URLs
 * @returns Validation result
 */
export function validateProductImages(images: string[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (images.length === 0) {
    errors.push('At least one image is required');
  }

  if (images.length > 5) {
    errors.push('Maximum 5 images allowed');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Prepare specifications for API
 * 
 * @param specs - Array of key-value specifications
 * @returns Prepared specifications object
 */
export function prepareSpecifications(
  specs: Array<{ key: string; value: string }>
): Record<string, string> | undefined {
  const attributes: Record<string, string> = {};

  specs.forEach((spec) => {
    if (spec.key && spec.value) {
      attributes[spec.key.trim()] = spec.value.trim();
    }
  });

  return Object.keys(attributes).length > 0 ? attributes : undefined;
}

/**
 * Calculate product score based on various factors
 * 
 * @param product - Product to score
 * @returns Score (0-100)
 */
export function calculateProductScore(product: Partial<Product>): number {
  let score = 0;

  // Has title
  if (product.title) score += 10;

  // Has description
  if (product.description) score += 10;

  // Has short description
  if (product.shortDescription) score += 5;

  // Has images
  if (product.images && product.images.length > 0) {
    score += Math.min(product.images.length * 10, 30); // Max 30 for images
  }

  // Has category
  if (product.categoryId) score += 10;

  // Has brand
  if (product.brand) score += 10;

  // Has price
  if (product.price && product.price > 0) score += 10;

  // Has stock
  if (product.stock !== undefined && product.stock >= 0) score += 5;

  // Has specifications
  if (product.attributes && Object.keys(product.attributes).length > 0) {
    score += Math.min(Object.keys(product.attributes).length * 2, 10); // Max 10 for specs
  }

  return Math.min(score, 100);
}

/**
 * Validate product price
 * 
 * @param price - Price to validate
 * @returns true if valid
 */
export function validateProductPrice(price: number): boolean {
  return price > 0 && price < 1000000; // Max 1 million SAR
}

/**
 * Validate product stock
 * 
 * @param stock - Stock quantity
 * @returns true if valid
 */
export function validateProductStock(stock: number): boolean {
  return stock >= 0 && stock < 100000; // Max 100k units
}

/**
 * Get product availability status
 * 
 * @param stock - Stock quantity
 * @returns Availability status
 */
export function getProductAvailability(stock: number): {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  label: string;
} {
  if (stock === 0) {
    return { status: 'out_of_stock', label: 'نفذت الكمية' };
  } else if (stock < 10) {
    return { status: 'low_stock', label: 'كمية محدودة' };
  } else {
    return { status: 'in_stock', label: 'متوفر' };
  }
}

/**
 * Validate SKU format
 * 
 * @param sku - SKU to validate
 * @returns true if valid
 */
export function validateSKU(sku: string): boolean {
  // SKU should be alphanumeric with hyphens, 3-50 characters
  const skuRegex = /^[A-Z0-9\-]{3,50}$/;
  return skuRegex.test(sku);
}

