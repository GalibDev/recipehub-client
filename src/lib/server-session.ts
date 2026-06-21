import { redirect } from 'next/navigation';
import { getCurrentUser, serializeUser } from '@/server/auth';
import type { User } from '@/types';

export async function getServerSession(): Promise<User | null> {
  const user = await getCurrentUser();
  return user ? serializeUser(user) : null;
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
    redirect('/');
  }
}
