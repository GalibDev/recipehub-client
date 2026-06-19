import { Suspense } from 'react';
import { ReportsClient } from '@/components/admin/reports-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function ReportsPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading reports..." />}>
      <ReportsClient />
    </Suspense>
  );
}
