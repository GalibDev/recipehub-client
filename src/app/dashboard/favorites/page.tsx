import { Suspense } from 'react';
import { FavoritesClient } from '@/components/dashboard/favorites-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function FavoritesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading favorites..." />}>
      <FavoritesClient />
    </Suspense>
  );
}
