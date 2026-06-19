import { Suspense } from 'react';
import { PurchasesClient } from '@/components/dashboard/purchases-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function PurchasesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading purchases..." />}>
      <PurchasesClient />
    </Suspense>
  );
}
