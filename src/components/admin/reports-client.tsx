'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import type { Paginated, Report } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function ReportsClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reports', page],
    queryFn: async () => {
      const response = await api.get(`/admin/reports?page=${page}&limit=10`);
      return response.data as Paginated<Report>;
    },
  });

  async function updateReport(reportId: string, status: Report['status']) {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status });
      toast.success('Report updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  async function removeRecipe(report: Report) {
    if (!report.recipeId?._id) {
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

  return (
    <>
      <h1 className="page-title">Reports</h1>
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
                  <th>Recipe</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.items.map((report) => (
                  <tr key={report._id}>
                    <td>{report.recipeId?.recipeName || 'Removed'}</td>
                    <td>{report.reporterEmail}</td>
                    <td>{report.reason}</td>
                    <td>
                      <span className="badge">{report.status}</span>
                    </td>
                    <td className="space-x-2">
                      <button onClick={() => updateReport(report._id, 'dismissed')} className="btn btn-sm">
                        Dismiss
                      </button>
                      <button onClick={() => removeRecipe(report)} className="btn btn-sm btn-error">
                        Remove recipe
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
