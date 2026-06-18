'use client';

export function ErrorView({ message = 'Unable to load content' }: { message?: string }) {
  return (
    <div className="rounded-3xl border border-error/20 bg-error/5 p-8 text-center">
      <h3 className="text-lg font-bold text-error">{message}</h3>
      <button className="btn btn-sm mt-4" onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  );
}
