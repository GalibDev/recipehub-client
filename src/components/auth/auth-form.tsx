'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe2, ChefHat, Crown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/providers';

type AuthValues = {
  name: string;
  image: string;
  email: string;
  password: string;
};

export function AuthForm({ registerMode = false }: { registerMode?: boolean }) {
  return <AuthFormInner registerMode={registerMode} nextPath={null} />;
}

export function AuthFormInner({
  registerMode = false,
  nextPath,
}: {
  registerMode?: boolean;
  nextPath: string | null;
}) {
  const router = useRouter();
  const { setUser } = useAuth();
  const next = nextPath || '/dashboard';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>();

  async function onSubmit(values: AuthValues) {
    try {
      const response = await api.post(registerMode ? '/auth/register' : '/auth/login', values);
      setUser(response.data.user);
      toast.success(registerMode ? 'Welcome to RecipeHub!' : 'Welcome back!');

      const destination =
        next || (response.data.user.role === 'admin' ? '/admin' : '/dashboard');

      router.replace(destination);
      router.refresh();
    } catch (error) {
      toast.error(messageOf(error));
    }
  }

  async function loginWithGoogle() {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth-bridge?next=${encodeURIComponent(next)}`,
    });

    if (result?.error) {
      toast.error(result.error.message || 'Google sign-in failed');
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-brand-900 to-brand-600 p-16 text-white lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-white">
            <ChefHat size={24} />
          </span>
          RecipeHub
        </Link>
        <div className="my-auto max-w-lg">
          <Crown size={56} className="text-amber-400" />
          <h1 className="mt-6 text-5xl font-extrabold">
            {registerMode ? 'Join the food lovers.' : 'Welcome back, chef.'}
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Discover standout recipes, share your own creations, and keep your culinary world in one place.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <span className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ChefHat size={24} />
            </span>
            RecipeHub
          </Link>
          <h2 className="mt-8 text-3xl font-bold">{registerMode ? 'Create your account' : 'Login'}</h2>
          <p className="mt-2 text-base-content/60">
            {registerMode ? 'Get started with RecipeHub today.' : 'Please login to continue.'}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {registerMode ? (
              <>
                <label className="block">
                  <span className="label-text-strong">Name</span>
                  <input className="input-clean" {...register('name', { required: 'Name is required' })} />
                </label>
                <label className="block">
                  <span className="label-text-strong">Image URL</span>
                  <input className="input-clean" {...register('image')} />
                </label>
              </>
            ) : null}
            <label className="block">
              <span className="label-text-strong">Email</span>
              <input
                type="email"
                className="input-clean"
                {...register('email', { required: 'Email is required' })}
              />
            </label>
            <label className="block">
              <span className="label-text-strong">Password</span>
              <input
                type="password"
                className="input-clean"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              {errors.password ? <small className="mt-2 block text-error">{errors.password.message}</small> : null}
            </label>
            <button disabled={isSubmitting} className="btn-brand w-full">
              {registerMode ? 'Register' : 'Login'}
            </button>
          </form>
          <button onClick={loginWithGoogle} className="btn btn-outline mt-4 w-full">
            <Globe2 size={18} />
            Continue with Google
          </button>
          <p className="mt-6 text-center text-sm">
            {registerMode ? 'Already have an account?' : 'New to RecipeHub?'}{' '}
            <Link className="font-bold text-brand-600" href={registerMode ? '/login' : '/register'}>
              {registerMode ? 'Login' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
