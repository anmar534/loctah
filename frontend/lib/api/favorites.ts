import { apiFetch } from './client';
import type { Favorite } from '@/types';

export async function listFavorites() {
  return apiFetch<Favorite[]>('/favorites');
}

export async function checkFavorite(productId: string) {
  return apiFetch<{ isFavorite: boolean }>(`/favorites/${productId}/status`);
}

export async function toggleFavorite(productId: string) {
  return apiFetch<Favorite>(`/favorites/${productId}`, {
    method: 'POST',
  });
}
