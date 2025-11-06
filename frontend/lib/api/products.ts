import { apiFetch } from './client';
import type { PaginatedResponse, Product } from '@/types';

export async function listProducts(params?: { page?: number; query?: string; category?: string }) {
  return apiFetch<PaginatedResponse<Product>>('/products', {
    params,
  });
}

export async function getProduct(slug: string) {
  return apiFetch<Product>(`/products/${slug}`);
}

export async function createProduct(payload: Partial<Product>) {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
