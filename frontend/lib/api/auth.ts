import { apiFetch } from './client';
import type { LoginCredentials, RegisterPayload, User } from '@/types';

export async function login(credentials: LoginCredentials) {
  return apiFetch<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
}
