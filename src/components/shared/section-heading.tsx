import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeading({
  title,
  actionHref = '/recipes',
  actionLabel = 'View all',
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      <Link href={actionHref} className="inline-flex items-center gap-1 text-sm font-bold text-brand-600">
        {actionLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
