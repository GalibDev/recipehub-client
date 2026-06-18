import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { AuthHydrator } from '@/components/shared/auth-hydrator';
import { getServerSession } from '@/lib/server-session';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerSession();

  return (
    <>
      <AuthHydrator user={user} />
      <SiteHeader initialUser={user} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
