'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BadgeCheck, Check, Crown } from 'lucide-react';
import { api, messageOf } from '@/lib/api';
import { avatarFromName } from '@/lib/utils';
import { useAuth } from '@/providers';

type ProfileValues = {
  name: string;
  image: string;
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileValues>({
    values: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  async function onSubmit(values: ProfileValues) {
    try {
      const response = await api.patch('/me/profile', values);
      setUser(response.data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(messageOf(error));
    }
  }

  async function upgradeToPremium() {
    try {
      setIsUpgrading(true);
      const response = await api.post('/payments/checkout', {});
      window.location.href = response.data.url;
    } catch (error) {
      toast.error(messageOf(error));
      setIsUpgrading(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Profile</h1>
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="dashboard-card">
          <div className="flex items-center gap-5">
            <img
              className="size-24 rounded-full object-cover ring-4 ring-brand-100"
              src={user?.image || avatarFromName(user?.name || 'RecipeHub')}
              alt={user?.name || 'Profile'}
            />
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                {user?.name}
                {user?.isPremium ? <BadgeCheck className="text-amber-500" size={22} /> : null}
              </h2>
              <p className="text-base-content/55">{user?.email}</p>
              {user?.isPremium ? (
                <span className="badge badge-warning mt-2 gap-1">
                  <Crown size={14} />
                  Premium Member
                </span>
              ) : (
                <span className="badge mt-2">Free Member</span>
              )}
            </div>
          </div>
          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="label-text-strong">Name</span>
              <input className="input-clean" {...register('name', { required: true })} />
            </label>
            <label className="block">
              <span className="label-text-strong">Image URL</span>
              <input className="input-clean" {...register('image')} />
            </label>
            <button disabled={isSubmitting} className="btn-brand">
              Save Changes
            </button>
          </div>
        </form>

        <section className="dashboard-card text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-100 text-amber-600">
            <Crown size={38} fill="currentColor" />
          </div>
          <h2 className="mt-5 text-2xl font-bold">{user?.isPremium ? 'Premium Active' : 'Go Premium'}</h2>
          <p className="mx-auto mt-3 max-w-xs text-base-content/60">
            {user?.isPremium
              ? 'Your account can publish unlimited recipes with the premium badge.'
              : 'Unlock unlimited recipe uploads and a premium badge for your profile.'}
          </p>
          <div className="mx-auto mt-8 max-w-xs space-y-4 text-left">
            {[
              'Unlimited recipe uploads',
              'Premium profile badge',
              'Priority visibility',
              'Exclusive features',
              'Priority support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="text-brand-600" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="my-8 border-t border-base-300" />
          <p className="text-sm text-base-content/55">
            {user?.isPremium ? 'Membership status' : 'Free members can publish up to 2 recipes.'}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-brand-700">
            {user?.isPremium ? 'Unlimited' : '$9.99'}
            {!user?.isPremium ? <span className="text-base font-medium text-base-content/50"> / lifetime</span> : null}
          </p>
          {user?.isPremium ? (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-bold text-amber-700">
              <BadgeCheck className="mx-auto mb-2" size={24} />
              Already Premium Member
            </div>
          ) : (
            <button
              type="button"
              disabled={isUpgrading}
              onClick={upgradeToPremium}
              className="btn-brand mt-7 w-full"
            >
              {isUpgrading ? 'Redirecting...' : 'Upgrade Now'}
            </button>
          )}
        </section>
      </div>
    </>
  );
}
