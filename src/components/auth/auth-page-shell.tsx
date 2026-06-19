'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingView } from '@/components/shared/loading-view';
import { AuthFormInner } from './auth-form';

function AuthSearchParamsBridge({ registerMode = false }: { registerMode?: boolean }) {
  const searchParams = useSearchParams();
  return <AuthFormInner registerMode={registerMode} nextPath={searchParams.get('next')} />;
}

export function AuthPageShell({ registerMode = false }: { registerMode?: boolean }) {
  return (
    <Suspense fallback={<LoadingView full label="Loading..." />}>
      <AuthSearchParamsBridge registerMode={registerMode} />
    </Suspense>
  );
}
