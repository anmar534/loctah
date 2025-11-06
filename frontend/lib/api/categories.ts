import { apiFetch } from './client';
import type { Category } from '@/types';

export async function listCategories() {
  return apiFetch<Category[]>('/categories');
}

export async function getCategory(slug: string) {
  return apiFetch<Category>(`/categories/${slug}`);
}

export async function createCategory(payload: Partial<Category>) {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: string, payload: Partial<Category>) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
