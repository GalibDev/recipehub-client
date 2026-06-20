'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, CreditCard, Download, DollarSign, Search, Users, WalletCards } from 'lucide-react';
import { api, messageOf } from '@/lib/api';
import { avatarFromName, cn, formatCurrency } from '@/lib/utils';
import type { Paginated, Payment } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

type PaymentsResponse = Paginated<Payment> & {
  summary: {
    totalTransactions: number;
    totalAmount: number;
    successful: number;
    thisMonthAmount: number;
  };
};

function formatDateTime(value?: string) {
  if (!value) {
    return { date: 'N/A', time: '' };
  }

  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat('en-GB').format(date),
    time: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

function shortId(payment: Payment) {
  const id = payment.checkoutSessionId || payment.transactionId;
  return id.length > 18 ? `${id.slice(0, 16)}...` : id;
}

function exportCsv(items: Payment[]) {
  const rows = [
    ['User', 'Email', 'Type', 'Amount', 'Status', 'Transaction ID', 'Date'],
    ...items.map((payment) => [
      payment.userId?.name || payment.userEmail,
      payment.userId?.email || payment.userEmail,
      payment.type || 'recipe',
      String(payment.amount),
      payment.paymentStatus,
      payment.transactionId,
      payment.paidAt,
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recipehub-transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function TransactionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const status = searchParams.get('status') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payments', page, search, type, status],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      params.set('limit', '10');
      const response = await api.get(`/admin/payments?${params.toString()}`);
      return response.data as PaymentsResponse;
    },
  });

  function updateFilter(key: 'search' | 'type' | 'status', value: string) {
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
    { label: 'Total Transactions', value: data?.summary.totalTransactions ?? 0, icon: Users },
    { label: 'Total Amount', value: formatCurrency(data?.summary.totalAmount || 0), icon: DollarSign },
    { label: 'Successful', value: data?.summary.successful ?? 0, icon: CheckCircle2 },
    { label: 'This Month', value: formatCurrency(data?.summary.thisMonthAmount || 0), icon: Clock3 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Transactions</h1>
            <CreditCard className="text-emerald-600" size={31} />
          </div>
          <p className="mt-2 text-base-content/60">All payment records on the platform</p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="flex min-w-48 items-center gap-4 rounded-lg border border-base-300 bg-base-100 px-5 py-4 shadow-sm">
                <div className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">{card.label}</p>
                  <p className="mt-1 text-xl font-extrabold">{card.value}</p>
                </div>
              </div>
            );
          })}
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
                placeholder="Search by user email..."
                defaultValue={search}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    updateFilter('search', event.currentTarget.value);
                  }
                }}
              />
            </label>
            <select className="select select-bordered h-12 min-w-52 rounded-lg" value={type} onChange={(event) => updateFilter('type', event.target.value)}>
              <option value="">All Types</option>
              <option value="premium">Premium</option>
              <option value="recipe">Recipe</option>
            </select>
            <select className="select select-bordered h-12 min-w-52 rounded-lg" value={status} onChange={(event) => updateFilter('status', event.target.value)}>
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button onClick={() => exportCsv(data?.items || [])} className="btn btn-outline ml-auto h-12 rounded-lg px-5">
              <Download size={18} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/40 text-sm text-base-content/70">
                <tr>
                  <th className="px-6 py-5">User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((payment) => {
                  const dateTime = formatDateTime(payment.paidAt);
                  const email = payment.userId?.email || payment.userEmail;
                  const displayName = payment.userId?.name || email;
                  return (
                    <tr key={payment._id} className="border-base-300">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img className="size-10 rounded-full object-cover" src={avatarFromName(displayName)} alt={displayName} />
                          <div>
                            <b>{displayName}</b>
                            <small className="block text-base-content/50">{email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold',
                            payment.type === 'premium'
                              ? 'border-violet-200 bg-violet-50 text-violet-700'
                              : 'border-orange-200 bg-orange-50 text-orange-700'
                          )}
                        >
                          {payment.type === 'premium' ? <WalletCards size={15} /> : <Search size={15} />}
                          {payment.type === 'premium' ? 'Premium' : 'Recipe'}
                        </span>
                      </td>
                      <td className="font-bold text-emerald-700">{formatCurrency(payment.amount)}</td>
                      <td>
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                          <CheckCircle2 size={15} fill="currentColor" />
                          {payment.paymentStatus === 'paid' ? 'Paid' : payment.paymentStatus}
                        </span>
                      </td>
                      <td className="font-mono text-sm text-base-content/70">{shortId(payment)}</td>
                      <td className="text-base-content/70">
                        <span className="block">{dateTime.date}</span>
                        <span className="text-sm text-base-content/45">{dateTime.time}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-5 text-sm text-base-content/60">
            <span>
              Showing {data?.items.length ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, data?.total || 0)} of {data?.total || 0} transactions
            </span>
            <PaginationControls page={page} pages={data?.pages || 1} />
          </div>
        </div>
      )}
    </>
  );
}
