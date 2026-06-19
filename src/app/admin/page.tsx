'use client';

import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, BookOpen, Crown, Flag, TrendingUp, Users } from 'lucide-react';
import { api } from '@/lib/api';
import type { AdminStats } from '@/types';
import { StatCard } from '@/components/dashboard/stat-card';

export default function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data as AdminStats;
    },
  });

  return (
    <>
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={data?.users} />
        <StatCard icon={BookOpen} label="Total Recipes" value={data?.recipes} />
        <StatCard icon={Crown} label="Premium Members" value={data?.premium} tone="text-amber-500" />
        <StatCard icon={Flag} label="Pending Reports" value={data?.reports} tone="text-error" />
      </div>
      <div className="dashboard-card mt-6">
        <h2 className="text-xl font-bold">Platform health</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-success/10 p-5">
            <BadgeCheck className="text-success" />
            <b className="mt-3 block">Systems operational</b>
          </div>
          <div className="rounded-2xl bg-info/10 p-5">
            <TrendingUp className="text-info" />
            <b className="mt-3 block">Engagement growing</b>
          </div>
          <div className="rounded-2xl bg-warning/10 p-5">
            <Flag className="text-warning" />
            <b className="mt-3 block">Moderation active</b>
          </div>
        </div>
      </div>
    </>
  );
}
