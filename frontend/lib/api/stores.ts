import { apiFetch } from './client';
import type { PaginatedResponse, Store } from '@/types';

export async function listStores(params?: { page?: number; query?: string }) {
  return apiFetch<PaginatedResponse<Store>>('/stores', {
    params,
  });
}

export async function getStore(id: string) {
  return apiFetch<Store>(`/stores/${id}`);
}

export async function verifyStore(id: string) {
  return apiFetch<Store>(`/stores/${id}/verify`, {
    method: 'POST',
  });
}

export async function rejectStoreVerification(id: string, payload?: { reason?: string }) {
  return apiFetch<Store>(`/stores/${id}/reject`, {
    method: 'POST',
    ...(payload?.reason ? { body: JSON.stringify(payload) } : {}),
  });
}
