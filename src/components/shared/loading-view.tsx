import { cn } from '@/lib/utils';

export function LoadingView({ full = false, label = 'Loading...' }: { full?: boolean; label?: string }) {
  return (
    <div className={cn('grid place-items-center', full ? 'min-h-screen' : 'min-h-64')}>
      <div className="text-center">
        <span className="loading loading-ring loading-lg text-brand-600" />
        <p className="mt-3 text-sm text-base-content/60">{label}</p>
      </div>
    </div>
  );
}
