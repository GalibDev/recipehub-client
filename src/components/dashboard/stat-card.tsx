import type { LucideIcon } from 'lucide-react';

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'text-brand-600',
}: {
  icon: LucideIcon;
  label: string;
  value?: number;
  tone?: string;
}) {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-base-content/55">{label}</span>
        <Icon className={tone} size={21} />
      </div>
      <b className="mt-4 block text-3xl">{value ?? '—'}</b>
      <small className="mt-2 block text-success">Updated live</small>
    </div>
  );
}
