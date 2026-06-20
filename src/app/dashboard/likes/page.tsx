import { Suspense } from 'react';
import { LikedRecipesClient } from '@/components/dashboard/liked-recipes-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function LikedRecipesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading liked recipes..." />}>
      <LikedRecipesClient />
    </Suspense>
  );
}
