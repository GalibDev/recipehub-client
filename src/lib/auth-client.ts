'use client';

import { createAuthClient } from 'better-auth/react';

const apiRoot = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authClient = createAuthClient({
  baseURL: apiRoot.replace(/\/api$/, '') + '/api/auth/better'
});
