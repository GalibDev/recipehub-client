import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 font-display text-xl font-extrabold tracking-tight',
        light && 'text-white'
      )}
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <ChefHat size={24} />
      </span>
      Recipe<span className="text-brand-500">Hub</span>
    </Link>
  );
}
