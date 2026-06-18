import { AuthForm } from '@/components/auth/auth-form';
import { redirectIfAuthenticated } from '@/lib/server-session';

export default async function RegisterPage() {
  await redirectIfAuthenticated();
  return <AuthForm registerMode />;
}
