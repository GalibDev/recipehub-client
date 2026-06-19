import { Suspense } from 'react';
import { LoadingView } from '@/components/shared/loading-view';
import { PaymentSuccessClient } from '@/components/recipes/payment-success-client';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingView label="Verifying payment..." />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
