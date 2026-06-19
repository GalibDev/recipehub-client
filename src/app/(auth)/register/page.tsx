import { AuthPageShell } from '@/components/auth/auth-page-shell';
import { redirectIfAuthenticated } from '@/lib/server-session';

export default async function RegisterPage() {
  await redirectIfAuthenticated();
  return <AuthPageShell registerMode />;
}
