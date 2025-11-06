import { apiFetch } from './client';
import type { Offer, PaginatedResponse } from '@/types';

export async function listOffers(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<Offer>>('/offers', {
    params,
  });
}

export async function getOffer(id: string) {
  return apiFetch<Offer>(`/offers/${id}`);
}

export async function createOffer(payload: Partial<Offer>) {
  return apiFetch<Offer>('/offers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateOffer(id: string, payload: Partial<Offer>) {
  return apiFetch<Offer>(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
