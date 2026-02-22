import axios, { type AxiosInstance } from 'axios';

const baseURL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('fnb-auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      // Optionally clear auth: handled by caller (e.g. logout)
    }
    return Promise.reject(err);
  }
);
