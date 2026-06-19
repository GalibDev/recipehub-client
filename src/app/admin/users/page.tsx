import { Suspense } from 'react';
import { ManageUsersClient } from '@/components/admin/manage-users-client';
import { LoadingView } from '@/components/shared/loading-view';

export default function ManageUsersPage() {
  return (
    <Suspense fallback={<LoadingView label="Loading users..." />}>
      <ManageUsersClient />
    </Suspense>
  );
}
