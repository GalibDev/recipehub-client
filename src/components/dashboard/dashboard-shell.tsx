'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  BadgeCheck,
  DollarSign,
  Flag,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingBag,
  User,
  Users,
  X,
  ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { avatarFromName, cn } from '@/lib/utils';
import type { User as AppUser } from '@/types';
import { useAuth } from '@/providers';
import { Logo } from '@/components/layout/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';

const userNav = [
  { href: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { href: '/dashboard/recipes', label: 'My Recipes', icon: BookOpen },
  { href: '/dashboard/add', label: 'Add Recipe', icon: PlusCircle },
  { href: '/dashboard/favorites', label: 'My Favorites', icon: Heart },
  { href: '/dashboard/likes', label: 'Liked Recipes', icon: ThumbsUp },
  { href: '/dashboard/purchases', label: 'My Purchased Recipes', icon: ShoppingBag },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/recipes', label: 'Manage Recipes', icon: BookOpen },
  { href: '/admin/reports', label: 'Reports', icon: Flag },
  { href: '/admin/transactions', label: 'Transactions', icon: DollarSign },
];

export function DashboardShell({
  children,
  initialUser,
  admin = false,
}: {
  children: React.ReactNode;
  initialUser: AppUser;
  admin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const currentUser = user || initialUser;
  const [open, setOpen] = useState(false);
  const items = admin ? adminNav : userNav;

  async function logout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Signed out');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(messageOf(error));
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-[#081d17] p-5 text-white transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <Logo light />
          <button className="btn btn-ghost btn-circle text-white lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <p className="mt-8 px-3 text-xs uppercase tracking-[0.2em] text-white/40">
          {admin ? 'Administration' : 'My kitchen'}
        </p>
        <nav className="mt-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white',
                  pathname === item.href && 'bg-brand-600 text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-white/60 transition hover:bg-white/10"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="flex h-20 items-center justify-between border-b border-base-300 bg-base-100 px-5 lg:px-8">
          <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-sm font-bold">
                {currentUser.name}
                {currentUser.isPremium ? <BadgeCheck className="text-amber-500" size={15} /> : null}
              </p>
              <p className="text-xs text-base-content/50">
                {admin ? 'Administrator' : currentUser.isPremium ? 'Premium Member' : 'Free Member'}
              </p>
            </div>
            <img
              className="size-10 rounded-full object-cover"
              src={currentUser.image || avatarFromName(currentUser.name)}
              alt={currentUser.name}
            />
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
