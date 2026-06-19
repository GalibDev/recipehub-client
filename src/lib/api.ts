'use client';

import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin'))
    ) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/login?next=${next}`);
    }

    return Promise.reject(error);
  }
);

export const messageOf = (error: unknown) => {
  const e = error as AxiosError<{ message?: string }>;
  return e.response?.data?.message || e.message || 'Something went wrong';
};
