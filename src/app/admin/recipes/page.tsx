import { Suspense } from 'react';
import { ManageRecipesClient } from '@/components/admin/manage-recipes-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function ManageRecipesPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading recipes..." />}>
      <ManageRecipesClient />
    </Suspense>
  );
}
