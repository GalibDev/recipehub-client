import { createAuthClient } from 'better-auth/react';
const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const authClient = createAuthClient({ baseURL: apiRoot.replace(/\/api$/, '') + '/api/auth/better' });
