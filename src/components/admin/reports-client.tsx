'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, FileWarning, ShieldAlert, UserRound, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Paginated, Report } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

type ReportsResponse = Paginated<Report> & {
  summary: {
    pendingReports: number;
    reviewedReports: number;
    allReports: number;
  };
};

function formatReportDate(value?: string) {
  if (!value) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-GB').format(new Date(value));
}

function reportNumber(report: Report) {
  const date = report.createdAt ? new Date(report.createdAt) : new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `${stamp}-${report._id.slice(-4).toUpperCase()}`;
}

export function ReportsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || 'pending';
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reports', page, status],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      if (!params.get('status')) {
        params.set('status', 'pending');
      }
      const response = await api.get(`/admin/reports?${params.toString()}&limit=10`);
      return response.data as ReportsResponse;
    },
  });

  async function updateReport(reportId: string, nextStatus: Report['status']) {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status: nextStatus });
      toast.success('Report updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  async function removeRecipe(report: Report) {
    if (!report.recipeId?._id) {
      await updateReport(report._id, 'resolved');
      return;
    }

    try {
      await api.delete(`/recipes/${report.recipeId._id}`);
      await api.patch(`/admin/reports/${report._id}`, { status: 'resolved' });
      toast.success('Recipe removed');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  function updateStatus(nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextStatus === 'pending') {
      params.set('status', 'pending');
    } else if (nextStatus === 'reviewed') {
      params.set('status', 'reviewed');
    } else {
      params.set('status', 'all');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  const tabs = [
    { key: 'pending', label: 'Pending', count: data?.summary.pendingReports ?? 0 },
    { key: 'reviewed', label: 'Reviewed', count: data?.summary.reviewedReports ?? 0 },
    { key: 'all', label: 'All', count: data?.summary.allReports ?? 0 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Recipe Reports</h1>
            <FileWarning className="text-rose-500" size={30} />
          </div>
          <p className="mt-2 text-lg text-base-content/60">{data?.summary.pendingReports ?? 0} pending reports</p>
        </div>
        <div className="inline-flex rounded-lg border border-base-300 bg-base-100 p-1 shadow-sm">
          {tabs.map((tab) => {
            const active = (status || 'all') === tab.key || (!searchParams.get('status') && tab.key === 'pending');
            return (
              <button
                key={tab.key}
                onClick={() => updateStatus(tab.key)}
                className={cn(
                  'rounded-md px-5 py-3 text-sm font-bold transition',
                  active ? 'bg-orange-500 text-white shadow-sm' : 'text-base-content/70 hover:bg-base-200'
                )}
              >
                {tab.label}
                <span className={cn('ml-2 text-xs', active ? 'text-white/80' : 'text-base-content/45')}>{tab.count}</span>
              </button>
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
        <div className="mt-10 overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-soft">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50 text-sm text-base-content/70">
                <tr>
                  <th className="px-6 py-5">Report ID</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Description</th>
                  <th>Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((report) => (
                  <tr key={report._id} className="border-base-300">
                    <td className="px-6 py-6 font-semibold">{reportNumber(report)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <UserRound size={17} className="text-base-content/40" />
                        <span>{report.reporterEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold',
                          report.reason === 'Offensive Content'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : report.reason === 'Copyright Issue'
                              ? 'border-violet-200 bg-violet-50 text-violet-700'
                              : 'border-orange-200 bg-orange-50 text-orange-700'
                        )}
                      >
                        {report.reason === 'Offensive Content' ? <ShieldAlert size={15} /> : <AlertTriangle size={15} />}
                        {report.reason}
                      </span>
                    </td>
                    <td className="max-w-xs truncate text-base-content/60">{report.recipeId?.recipeName || 'Removed recipe'}</td>
                    <td className="text-base-content/70">{formatReportDate(report.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        {report.recipeId?._id ? (
                          <Link className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700" href={`/recipes/${report.recipeId._id}`}>
                            Review Report
                          </Link>
                        ) : (
                          <button onClick={() => updateReport(report._id, 'resolved')} className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                            Mark Resolved
                          </button>
                        )}
                        <button onClick={() => updateReport(report._id, 'dismissed')} className="btn btn-outline btn-sm h-11 rounded-lg">
                          <XCircle size={16} />
                          Dismiss
                        </button>
                        <button onClick={() => removeRecipe(report)} className="btn btn-outline btn-sm h-11 rounded-lg text-error">
                          <CheckCircle2 size={16} />
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-5 text-sm text-base-content/60">
            <span>
              Showing {data?.items.length ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, data?.total || 0)} of {data?.total || 0} reports
            </span>
            <PaginationControls page={page} pages={data?.pages || 1} />
          </div>
        </div>
      )}
    </>
  );
}
