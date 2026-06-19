import { Suspense } from 'react';
import { TransactionsClient } from '@/components/admin/transactions-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading transactions..." />}>
      <TransactionsClient />
    </Suspense>
  );
}
