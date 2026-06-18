'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Crown, Heart, ShoppingBag, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types';
import { StatCard } from '@/components/dashboard/stat-card';

export default function DashboardOverviewPage() {
  const { data } = useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => {
      const response = await api.get('/me/stats');
      return response.data as DashboardStats;
    },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="mt-2 text-base-content/55">Track your recipes, favorites, purchases, and growth at a glance.</p>
        </div>
        <span className="badge h-10 gap-2 border-amber-300 bg-amber-50 px-4 text-amber-800">
          <Crown size={17} />
          Member workspace
        </span>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Total Recipes" value={data?.recipes} />
        <StatCard icon={Heart} label="Total Favorites" value={data?.favorites} />
        <StatCard icon={TrendingUp} label="Total Likes Received" value={data?.likes} />
        <StatCard icon={ShoppingBag} label="Total Purchases" value={data?.purchases} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold">Kitchen activity</h2>
          <div className="mt-8 flex h-48 items-end gap-3">
            {[32, 58, 44, 78, 61, 89, 72, 97].map((value, index) => (
              <div key={index} className="flex-1 rounded-t-lg bg-brand-100" style={{ height: `${value}%` }}>
                <div className="h-full rounded-t-lg bg-brand-600/75" style={{ height: `${44 + index * 6}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card bg-gradient-to-br from-brand-900 to-brand-600 text-white">
          <Crown className="text-amber-300" size={38} />
          <h2 className="mt-4 text-2xl font-bold">Grow your culinary brand</h2>
          <p className="mt-2 text-white/65">
            Keep publishing recipes and building trust with home cooks around the world.
          </p>
          <Link className="btn mt-7 bg-white text-brand-800" href="/dashboard/add">
            Add a recipe
          </Link>
        </div>
      </div>
    </>
  );
}
