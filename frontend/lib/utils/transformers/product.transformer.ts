/**
 * Product Transformer
 * 
 * Transform product data between form and API formats.
 */

import type { Product } from '@/types';

export interface ProductFormData {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  brand?: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
}

export interface Specification {
  key: string;
  value: string;
}

/**
 * Transform product form data to API format
 * 
 * @param formData - Form data from user input
 * @param images - Array of image URLs
 * @param specifications - Array of specifications
 * @returns Data ready for API submission
 */
export function transformProductFormData(
  formData: ProductFormData,
  images: string[],
  specifications: Specification[]
): any {
  // Convert specifications array to attributes object
  const attributes: Record<string, string> = {};
  specifications.forEach((spec) => {
    if (spec.key && spec.value) {
      attributes[spec.key.trim()] = spec.value.trim();
    }
  });

  return {
    title: formData.title.trim(),
    slug: formData.slug.trim().toLowerCase(),
    shortDescription: formData.shortDescription?.trim() || undefined,
    description: formData.description?.trim() || undefined,
    categoryId: formData.categoryId,
    brand: formData.brand?.trim() || undefined,
    sku: formData.sku.trim().toUpperCase(),
    price: parseFloat(formData.price.toString()),
    currency: formData.currency || 'SAR',
    stock: parseInt(formData.stock.toString()),
    image: images[0] || undefined,
    images: images.map((url) => ({
      url,
      alt: formData.title,
    })),
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  };
}

/**
 * Transform API product data to form format
 * 
 * @param product - Product from API
 * @returns Form data
 */
export function transformProductToForm(product: Product): {
  formData: ProductFormData;
  images: string[];
  specifications: Specification[];
} {
  // Convert attributes object to specifications array
  const specifications: Specification[] = [];
  if (product.attributes) {
    Object.entries(product.attributes).forEach(([key, value]) => {
      specifications.push({ key, value: value as string });
    });
  }

  // Extract image URLs
  const images: string[] = [];
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      if (typeof img === 'string') {
        images.push(img);
      } else if (img.url) {
        images.push(img.url);
      }
    });
  } else if (product.image) {
    images.push(product.image);
  }

  return {
    formData: {
      title: product.title,
      slug: product.slug,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      categoryId: product.categoryId,
      brand: product.brand || '',
      sku: product.sku,
      price: product.price,
      currency: product.currency || 'SAR',
      stock: product.stock || 0,
    },
    images,
    specifications,
  };
}

/**
 * Transform product for display
 * 
 * @param product - Product from API
 * @returns Display-ready product
 */
export function transformProductForDisplay(product: Product): Product {
  return {
    ...product,
    price: parseFloat(product.price.toString()),
    stock: parseInt(product.stock?.toString() || '0'),
  };
}

