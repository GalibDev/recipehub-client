'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';
import { api, messageOf } from '@/lib/api';
import { LoadingView } from '@/components/shared/loading-view';
import { useAuth } from '@/providers';

export function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('Missing payment session');
      return;
    }

    api
      .post('/payments/confirm', { sessionId })
      .then(() => refresh())
      .then(() => setDone(true))
      .catch((requestError) => setError(messageOf(requestError)));
  }, [refresh, searchParams]);

  return (
    <div className="shell grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        {error ? (
          <>
            <X className="mx-auto text-error" size={76} />
            <h1 className="mt-5 text-3xl font-bold">Payment verification failed</h1>
            <p className="mt-3 text-error">{error}</p>
          </>
        ) : !done ? (
          <LoadingView label="Verifying payment..." />
        ) : (
          <>
            <CheckCircle2 className="mx-auto text-brand-600" size={84} />
            <h1 className="mt-5 text-4xl font-extrabold">Payment Successful!</h1>
            <p className="mt-3 text-base-content/60">Your RecipeHub benefits are now active.</p>
            <Link className="btn-brand mt-8" href="/dashboard">
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
