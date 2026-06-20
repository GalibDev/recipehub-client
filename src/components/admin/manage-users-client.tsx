'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, Crown, MoreVertical, Plus, Search, ShieldCheck, UserRound, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { avatarFromName, cn } from '@/lib/utils';
import type { Paginated, User } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

type UsersResponse = Paginated<User> & {
  summary: {
    totalUsers: number;
    adminUsers: number;
    premiumUsers: number;
    freeUsers: number;
  };
};

function formatJoined(value?: string) {
  if (!value) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-GB').format(new Date(value));
}

export function ManageUsersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const status = searchParams.get('status') || '';
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page, search, role, status],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams.toString());
      if (!params.get('page')) {
        params.set('page', '1');
      }
      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data as UsersResponse;
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

  function updateFilter(key: 'search' | 'role' | 'status', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  const summaryCards = [
    { label: 'Total Users', value: data?.summary.totalUsers ?? 0 },
    { label: 'Admin', value: data?.summary.adminUsers ?? 0 },
    { label: 'Premium', value: data?.summary.premiumUsers ?? 0 },
    { label: 'Free Users', value: data?.summary.freeUsers ?? 0 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Manage Users</h1>
            <Users className="text-brand-600" size={30} />
          </div>
          <p className="mt-2 text-base-content/60">Block users, review plans, and keep admin accounts protected.</p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-base-300 bg-base-100 px-6 py-4 shadow-sm">
              <p className="text-sm text-base-content/60">{card.label}</p>
              <p className="mt-2 text-2xl font-extrabold">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mt-8">
          <ErrorView message={messageOf(error)} />
        </div>
      ) : isLoading ? (
        <LoadingView />
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-soft">
          <div className="flex flex-wrap items-center gap-4 border-b border-base-300 p-5">
            <label className="relative min-w-[260px] flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={19} />
              <input
                className="input-clean pl-12"
                placeholder="Search by name or email..."
                defaultValue={search}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    updateFilter('search', event.currentTarget.value);
                  }
                }}
              />
            </label>
            <select className="select select-bordered h-12 min-w-44 rounded-lg" value={role} onChange={(event) => updateFilter('role', event.target.value)}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select className="select select-bordered h-12 min-w-44 rounded-lg" value={status} onChange={(event) => updateFilter('status', event.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <Link className="btn-brand ml-auto h-12 rounded-lg" href="/register">
              <Plus size={18} />
              Add New User
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50 text-sm text-base-content/70">
                <tr>
                  <th className="px-6 py-5">User</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((user) => (
                  <tr key={user._id} className="border-base-300">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img className="size-12 rounded-full object-cover" src={user.image || avatarFromName(user.name)} alt={user.name} />
                        <div>
                          <b>{user.name}</b>
                          <small className="block text-base-content/50">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold',
                          user.role === 'admin'
                            ? 'border-violet-200 bg-violet-50 text-violet-700'
                            : 'border-orange-200 bg-orange-50 text-orange-700'
                        )}
                      >
                        {user.role === 'admin' ? <ShieldCheck size={15} /> : <UserRound size={15} />}
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold',
                          user.isPremium ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-base-200 text-base-content/60'
                        )}
                      >
                        {user.isPremium ? <Crown size={14} fill="currentColor" /> : null}
                        {user.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold',
                          user.isBlocked
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        )}
                      >
                        {user.isBlocked ? <span className="size-2 rounded-full bg-current" /> : <Check size={14} />}
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="text-base-content/70">{formatJoined(user.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {user.role === 'admin' ? (
                          <span className="rounded-lg bg-base-200 px-3 py-2 text-sm font-semibold text-base-content/50">Protected</span>
                        ) : (
                          <button
                            onClick={() => toggleBlock(user._id, Boolean(user.isBlocked))}
                            className={cn(
                              'rounded-lg px-4 py-2 text-sm font-bold',
                              user.isBlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            )}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                        <button className="btn btn-outline btn-sm rounded-lg" aria-label={`More actions for ${user.name}`}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-base-300 px-5 py-4">
            <PaginationControls page={page} pages={data?.pages || 1} />
          </div>
        </div>
      )}
    </>
  );
}
