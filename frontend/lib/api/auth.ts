import { apiFetch } from './client';
import type { LoginCredentials, LoginResponse, RegisterPayload, User, UpdateProfilePayload } from '@/types';

export async function login(credentials: LoginCredentials) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  return apiFetch<User>('/auth/me');
}

// Update user profile with only user-editable fields
// Server-side validation must enforce the same whitelist: name, avatarUrl, phone
export async function updateProfile(payload: UpdateProfilePayload) {
  return apiFetch<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
