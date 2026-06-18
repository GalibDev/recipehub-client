import type { ReactNode } from 'react';

export function EmptyView({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
      {icon ? <div className="mx-auto mb-4 flex justify-center text-brand-300">{icon}</div> : null}
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-base-content/60">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
