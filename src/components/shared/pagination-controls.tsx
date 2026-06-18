'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PaginationControls({ page, pages }: { page: number; pages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (pages <= 1) {
    return null;
  }

  const visiblePages = Array.from({ length: Math.min(pages, 5) }, (_, index) => index + 1);

  return (
    <div className="mt-10 flex justify-center gap-2">
      <button className="btn btn-square" disabled={page <= 1} onClick={() => goTo(page - 1)}>
        <ChevronLeft size={18} />
      </button>
      {visiblePages.map((value) => (
        <button
          key={value}
          className={cn('btn btn-square', value === page && 'btn-brand')}
          onClick={() => goTo(value)}
        >
          {value}
        </button>
      ))}
      <button className="btn btn-square" disabled={page >= pages} onClick={() => goTo(page + 1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
