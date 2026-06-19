'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import type { Paginated, User } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function ManageUsersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page, searchParams.get('search') || ''],
    queryFn: async () => {
      const response = await api.get(`/admin/users?${searchParams.toString() || 'page=1'}`);
      return response.data as Paginated<User>;
    },
  });

  async function toggleBlock(userId: string, isBlocked: boolean) {
    try {
      await api.patch(`/admin/users/${userId}/block`, { isBlocked: !isBlocked });
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title">Manage Users</h1>
        <input
          className="input-clean w-full max-w-sm"
          placeholder="Search by name or email"
          defaultValue={searchParams.get('search') || ''}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateSearch(event.currentTarget.value);
            }
          }}
        />
      </div>
      {error ? (
        <div className="mt-8">
          <ErrorView message={messageOf(error)} />
        </div>
      ) : isLoading ? (
        <LoadingView />
      ) : (
        <>
          <div className="dashboard-card mt-8 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.items.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <b>{user.name}</b>
                      <small className="block text-base-content/50">{user.email}</small>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleBlock(user._id, Boolean(user.isBlocked))} className="btn btn-sm">
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={page} pages={data?.pages || 1} />
        </>
      )}
    </>
  );
}
