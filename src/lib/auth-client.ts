'use client';

import { createAuthClient } from 'better-auth/react';

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const authClient = createAuthClient({
  baseURL: `${appUrl}/api/auth/better`,
});
