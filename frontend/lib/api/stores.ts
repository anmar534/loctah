import { apiFetch } from './client';
import type { PaginatedResponse, Store } from '@/types';

export async function listStores(params?: { page?: number; query?: string }) {
  return apiFetch<PaginatedResponse<Store>>('/stores', {
    params,
  });
}

export async function getStore(id: string, options?: RequestInit) {
  return apiFetch<Store>(`/stores/${encodeURIComponent(id)}`, options);
}

export async function createStore(payload: Partial<Store>) {
  return apiFetch<Store>('/stores', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateStore(id: string, payload: Partial<Store>) {
  return apiFetch<Store>(`/stores/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
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
