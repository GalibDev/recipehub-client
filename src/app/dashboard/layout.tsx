import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AuthHydrator } from '@/components/shared/auth-hydrator';
import { requireUser } from '@/lib/server-session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/dashboard');

  return (
    <>
      <AuthHydrator user={user} />
      <DashboardShell initialUser={user}>{children}</DashboardShell>
    </>
  );
}
