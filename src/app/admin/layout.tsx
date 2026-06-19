import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AuthHydrator } from '@/components/shared/auth-hydrator';
import { requireAdmin } from '@/lib/server-session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin('/admin');

  return (
    <>
      <AuthHydrator user={user} />
      <DashboardShell admin initialUser={user}>
        {children}
      </DashboardShell>
    </>
  );
}
