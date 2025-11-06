import { apiFetch } from './client';
import type { DashboardSummary, User } from '@/types';

export async function getDashboardSummary() {
  return apiFetch<DashboardSummary>('/admin/summary');
}

export async function listUsers() {
  return apiFetch<User[]>('/admin/users');
}

export async function getUser(id: string) {
  return apiFetch<User>(`/admin/users/${id}`);
}
