import { Suspense } from 'react';
import { MyRecipesClient } from '@/components/dashboard/my-recipes-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function MyRecipesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading recipes..." />}>
      <MyRecipesClient />
    </Suspense>
  );
}
