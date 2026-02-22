import { apiClient } from './client';
import type { User } from '@/store/authStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserPayload {
  name?: string;
  avatar?: string;
}

/** Login: returns user + accessToken. Store both in auth store (user.token = accessToken). */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
  return data;
}

/** Logout: call backend to invalidate session/token if your API supports it. */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Still clear client state even if backend fails
  }
}

/** Get current user (e.g. after page load to restore session). */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

/** Register a new user. */
export async function register(payload: RegisterPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/register', payload);
  return data;
}

/** Update current user profile. */
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.patch<User>('/users/me', payload);
  return data;
}

/** Get user by id (admin or public profile). */
export async function getUserById(id: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}
