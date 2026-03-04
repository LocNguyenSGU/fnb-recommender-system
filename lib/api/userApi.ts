import { apiClient } from './client';
import type { User } from '@/store/authStore';

/**
 * Payload/response types khớp với spec backend:
 * Base URL: http://localhost:8080/api (NÊN cấu hình NEXT_PUBLIC_API_URL=http://localhost:8080/api)
 * Auth endpoints: /auth/register, /auth/login, /auth/refresh-token, ...
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser extends User {
  /** Full name từ backend (ánh xạ vào User.name ở frontend). */
  fullName?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface UpdateUserPayload {
  name?: string;
  avatar?: string;
}

/** Login: POST /auth/login */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
  return data;
}

/** Logout: POST /auth/logout với refreshToken trong body, Authorization header có accessToken. */
export async function logout(body: RefreshTokenPayload): Promise<void> {
  await apiClient.post('/auth/logout', body);
}

/** Get current user (e.g. sau reload trang, nếu backend có /auth/me). */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

/** Register: POST /auth/register – chỉ trả message, KHÔNG login auto. */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
  return data;
}

/** Refresh access token: POST /auth/refresh-token */
export async function refreshAccessToken(
  payload: RefreshTokenPayload,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/refresh-token', payload);
  return data;
}

/** Quên mật khẩu: POST /auth/forgot-password */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', payload);
  return data;
}

/** Đặt lại mật khẩu: POST /auth/reset-password */
export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', payload);
  return data;
}

/** Gửi lại email xác thực: POST /auth/resend-verification */
export async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/resend-verification',
    payload,
  );
  return data;
}

/** Xác thực email: GET /auth/verify-email?token=... */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  const { data } = await apiClient.get<{ message: string }>('/auth/verify-email', {
    params: { token },
  });
  return data;
}

/** Update current user profile. (Tùy vào backend path; ví dụ /users/me) */
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.patch<User>('/users/me', payload);
  return data;
}

/** Get user by id (admin or public profile). */
export async function getUserById(id: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}

