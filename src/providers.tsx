'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { api } from '@/lib/api';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside Providers');
  }

  return ctx;
}

function ThemeBoot() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { data } = await api.get('/auth/session');
      setUser(data.user);
      return data.user as User;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, loading, setUser, refresh }}>
        <ThemeBoot />
        {children}
        <Toaster position="top-center" />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export function AuthHydrator({ user }: { user: User | null }) {
  const { user: currentUser, setUser } = useAuth();

  useEffect(() => {
    if (user && currentUser?._id !== user._id) {
      setUser(user);
    }

    if (!user && currentUser) {
      setUser(null);
    }
  }, [currentUser, setUser, user]);

  return null;
}
