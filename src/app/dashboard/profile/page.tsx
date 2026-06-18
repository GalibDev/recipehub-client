'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { avatarFromName } from '@/lib/utils';
import { useAuth } from '@/providers';

type ProfileValues = {
  name: string;
  image: string;
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
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

  return (
    <>
      <h1 className="page-title">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="dashboard-card mt-8 max-w-2xl">
        <div className="flex items-center gap-5">
          <img
            className="size-24 rounded-full object-cover ring-4 ring-brand-100"
            src={user?.image || avatarFromName(user?.name || 'RecipeHub')}
            alt={user?.name || 'Profile'}
          />
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-base-content/55">{user?.email}</p>
            {user?.isPremium ? <span className="badge badge-warning mt-2">Premium</span> : null}
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
    </>
  );
}
