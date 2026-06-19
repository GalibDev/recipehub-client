import { Suspense } from 'react';
import { BrowseRecipesClient } from '@/components/recipes/browse-recipes-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function BrowseRecipesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading recipes..." />}>
      <BrowseRecipesClient />
    </Suspense>
  );
}
