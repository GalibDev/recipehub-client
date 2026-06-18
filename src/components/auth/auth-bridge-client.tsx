'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { LoadingView } from '@/components/shared/loading-view';
import { useAuth } from '@/providers';

export function AuthBridgeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    api
      .post('/auth/exchange')
      .then((response) => {
        setUser(response.data.user);
        router.replace(searchParams.get('next') || '/dashboard');
        router.refresh();
      })
      .catch((error) => {
        toast.error(messageOf(error));
        router.replace('/login');
      });
  }, [router, searchParams, setUser]);

  return <LoadingView full label="Finishing your sign in..." />;
}
