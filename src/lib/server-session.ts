import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@/types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getServerSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${apiBaseUrl}/auth/session`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user: User };
  return data.user;
}

export async function requireUser(nextPath = '/dashboard') {
  const user = await getServerSession();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireAdmin(nextPath = '/admin') {
  const user = await getServerSession();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getServerSession();

  if (user) {
    redirect(user.role === 'admin' ? '/admin' : '/dashboard');
  }
}
