import { Suspense } from 'react';
import { LoadingView } from '@/components/shared/loading-view';
import { AuthBridgeClient } from '@/components/auth/auth-bridge-client';

export default function AuthBridgePage() {
  return (
    <Suspense fallback={<LoadingView full label="Finishing your sign in..." />}>
      <AuthBridgeClient />
    </Suspense>
  );
}
