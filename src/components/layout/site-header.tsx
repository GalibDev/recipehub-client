'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Menu, MoonStar, Search, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { avatarFromName, cn } from '@/lib/utils';
import type { User } from '@/types';
import { useAuth } from '@/providers';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

const links = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Browse Recipes' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/#about', label: 'About Us' },
];

export function SiteHeader({ initialUser }: { initialUser?: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser = user || initialUser || null;

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
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-xl">
      <div className="shell flex h-20 items-center gap-4">
        <Logo />
        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-semibold transition hover:text-brand-600',
                pathname === link.href && 'text-brand-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <label className="ml-auto hidden w-72 items-center rounded-2xl border border-base-300 bg-base-200 px-3 lg:flex">
          <Search size={17} />
          <input
            className="h-11 w-full bg-transparent px-2 text-sm outline-none"
            placeholder="Search recipes..."
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                router.push(`/recipes?search=${encodeURIComponent(event.currentTarget.value)}`);
              }
            }}
          />
        </label>
        <ThemeToggle />
        {currentUser ? (
          <div className="dropdown dropdown-end hidden sm:block">
            <button tabIndex={0} className="avatar">
              <div className="size-10 rounded-full ring-2 ring-brand-100">
                <img src={currentUser.image || avatarFromName(currentUser.name)} alt={currentUser.name} />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <li className="menu-title">
                <span>{currentUser.name}</span>
                <span className="text-xs text-base-content/50">{currentUser.email}</span>
              </li>
              {currentUser.isPremium ? (
                <li className="px-2 py-1 text-xs font-semibold text-amber-600">
                  <span className="inline-flex items-center gap-1">
                    <MoonStar size={14} />
                    Premium member
                  </span>
                </li>
              ) : null}
              <li>
                <Link href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={logout}>
                  <LogOut size={16} />
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn-brand hidden sm:inline-flex">
            Login
          </Link>
        )}
        <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen ? (
        <div className="shell border-t border-base-300 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-2xl px-3 py-3 font-semibold hover:bg-base-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!currentUser ? (
            <Link href="/login" className="btn-brand mt-3 w-full" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
