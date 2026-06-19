'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api, messageOf } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Paginated, Payment } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function TransactionsClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payments', page],
    queryFn: async () => {
      const response = await api.get(`/admin/payments?page=${page}&limit=10`);
      return response.data as Paginated<Payment>;
    },
  });

  return (
    <>
      <h1 className="page-title">Transactions</h1>
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
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.userId?.name || payment.userEmail}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{formatDate(payment.paidAt)}</td>
                    <td>
                      <span className="badge badge-success">{payment.paymentStatus}</span>
                    </td>
                    <td className="font-mono text-xs">{payment.transactionId}</td>
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
