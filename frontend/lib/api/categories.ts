import { apiFetch } from './client';
import type { Category } from '@/types';

export async function listCategories() {
  return apiFetch<Category[]>('/categories');
}

export async function getCategory(slug: string) {
  return apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`);
}

export async function createCategory(payload: Partial<Category>) {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(slug: string, payload: Partial<Category>) {
  return apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
