'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Flame, Globe2, Heart, Leaf, ShieldCheck, Star, TrendingUp, Users, Utensils } from 'lucide-react';
import { api } from '@/lib/api';
import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/recipes/recipe-card';
import { SectionHeading } from '@/components/shared/section-heading';

export default function HomePage() {
  const featureItems = [
    { icon: Utensils, title: 'Easy to cook', description: 'Simple ingredients and clear steps' },
    { icon: Heart, title: 'Healthy and delicious', description: 'Balanced meals for every table' },
    { icon: Globe2, title: 'Global cuisine', description: 'Explore recipes from around the world' },
    { icon: ShieldCheck, title: 'Trusted community', description: 'Moderated by food lovers and admins' },
  ];

  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      const response = await api.get('/recipes?featured=true&limit=5');
      return response.data.items as Recipe[];
    },
  });

  const { data: popular } = useQuery({
    queryKey: ['popular-recipes'],
    queryFn: async () => {
      const response = await api.get('/recipes?sort=popular&limit=5');
      return response.data.items as Recipe[];
    },
  });

  const tasteTrendStats = [
    {
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=200&q=80',
      recipe: 'Creamy Garlic Pasta',
      growth: '32%',
    },
    {
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=200&q=80',
      recipe: 'Korean Corn Cheese',
      growth: '21%',
    },
    {
      image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=200&q=80',
      recipe: 'Matcha Desserts',
      growth: '18%',
    },
    {
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4f6?auto=format&fit=crop&w=200&q=80',
      recipe: 'Chicken Biryani',
      growth: '16%',
    },
  ];

  const cravingItems = [
    { icon: '\u{1F35C}', label: 'Comfort Food', tone: 'bg-amber-50 text-amber-700' },
    { icon: '\u{1F957}', label: 'Healthy Meals', tone: 'bg-emerald-50 text-emerald-700' },
    { icon: '\u{1F354}', label: 'Fast Food', tone: 'bg-orange-50 text-orange-700' },
    { icon: '\u{1F370}', label: 'Desserts', tone: 'bg-rose-50 text-rose-700' },
    { icon: '\u{1F969}', label: 'High Protein Recipes', tone: 'bg-sky-50 text-sky-700' },
    { icon: '\u{1F336}\u{FE0F}', label: 'Spicy Bowls', tone: 'bg-red-50 text-red-700' },
    { icon: '\u{1F364}', label: 'Seafood Picks', tone: 'bg-cyan-50 text-cyan-700' },
    { icon: '\u{1F95E}', label: 'Breakfast Bites', tone: 'bg-yellow-50 text-yellow-700' },
    { icon: '\u{1F951}', label: 'Vegan Plates', tone: 'bg-lime-50 text-lime-700' },
    { icon: '\u{1F355}', label: 'Party Snacks', tone: 'bg-orange-50 text-orange-700' },
    { icon: '\u{1F958}', label: 'Family Dinners', tone: 'bg-violet-50 text-violet-700' },
  ];

  const heroStats = [
    { icon: Users, value: '10K+', label: 'Happy Users', className: 'left-[55%] top-[8%] sm:left-[62%] sm:top-[7%]' },
    { icon: Utensils, value: '25K+', label: 'Recipe Lovers', className: 'left-[0%] top-[55%] sm:left-[1%]' },
    { icon: Star, value: '4.8', label: 'User Rating', className: 'left-[55%] top-[72%] sm:left-[65%] sm:top-[70%]' },
  ];

  const heroLeaves = [
    'left-[16%] top-[6%] -rotate-12',
    'left-[6%] top-[37%] rotate-12',
    'right-[5%] top-[28%] rotate-[28deg]',
    'right-[16%] bottom-[7%] -rotate-[18deg]',
    'left-[36%] bottom-[3%] rotate-[20deg]',
  ];

  const heroDots = [
    'left-[28%] top-[18%]',
    'left-[14%] top-[68%]',
    'right-[12%] top-[15%]',
    'right-[1%] top-[52%]',
    'left-[49%] bottom-[7%]',
  ];

  const [cravingIndex, setCravingIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCravingIndex((current) => (current + 1) % cravingItems.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [cravingItems.length]);

  const visibleCravings = Array.from({ length: 4 }, (_, offset) => cravingItems[(cravingIndex + offset) % cravingItems.length]);

  return (
    <>
      <section className="hero-glow overflow-hidden">
        <div className="shell grid min-h-[560px] items-center gap-8 py-10 sm:py-16 lg:min-h-[620px] lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">
              Cook <span>*</span> Share <span>*</span> Inspire
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:mt-6 sm:text-6xl">
              Share Recipes.
              <br />
              <span className="text-brand-600">Inspire</span> the World.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-base-content/65 sm:mt-6 sm:text-lg sm:leading-8">
              Join a thriving cooking community to discover beautiful recipes, save your favorites, and unlock premium
              culinary content.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-brand" href="/recipes">
                Explore Recipes
              </Link>
              <Link className="btn btn-outline" href="/register">
                Join Community
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative mx-auto min-h-[360px] w-full max-w-xl sm:min-h-[520px]"
          >
            <div className="absolute inset-10 rounded-full bg-amber-200/25 blur-3xl" />
            {heroDots.map((position, index) => (
              <motion.span
                key={position}
                animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.35, 0.95, 0.35] }}
                transition={{ duration: 2.6, delay: index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute z-10 size-2 rounded-full bg-amber-400 ${position}`}
              />
            ))}
            {heroLeaves.map((position, index) => (
              <motion.span
                key={position}
                animate={{ y: [0, -10, 0], rotate: [0, index % 2 ? 8 : -8, 0] }}
                transition={{ duration: 3.4 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute z-20 grid size-8 place-items-center rounded-full bg-white/75 text-brand-700 shadow-sm backdrop-blur sm:size-10 ${position}`}
              >
                <Leaf className="size-5 sm:size-[22px]" fill="currentColor" />
              </motion.span>
            ))}
            <img
              className="absolute left-1/2 top-1/2 z-10 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-white object-cover shadow-2xl sm:w-[82%] sm:border-[14px]"
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
              alt="Hero dish"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 z-30"
            >
              {heroStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className={`absolute flex min-w-28 items-center gap-2 rounded-2xl border border-base-300 bg-base-100/95 p-2.5 shadow-soft backdrop-blur sm:min-w-36 sm:gap-3 sm:p-4 ${stat.className}`}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 sm:size-11">
                      <StatIcon className="size-5 sm:size-[22px]" fill={stat.label === 'User Rating' ? 'currentColor' : 'none'} />
                    </span>
                    <span>
                      <b className="block text-base leading-none sm:text-lg">{stat.value}</b>
                      <span className="text-[11px] font-medium text-base-content/55 sm:text-xs">{stat.label}</span>
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading title="Featured Recipes" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-3xl bg-base-200" />)
              : featured?.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} compact />)}
          </div>
        </div>
      </section>

      <section className="section bg-base-200">
        <div className="shell">
          <SectionHeading title="Popular Recipes" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {popular?.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Taste Trends This Week</h2>
                <p className="mt-2 text-sm text-base-content/60">See what recipes are trending</p>
              </div>
              <Flame className="text-orange-500" size={24} fill="currentColor" />
            </div>
            <div className="mt-2 divide-y divide-base-300">
              {tasteTrendStats.map((stat, index) => (
                <motion.div
                  key={stat.recipe}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between gap-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img className="size-12 rounded-xl object-cover shadow-sm" src={stat.image} alt={stat.recipe} />
                    <div>
                      <p className="font-bold">{stat.recipe}</p>
                      <p className="text-sm text-base-content/50">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                    <TrendingUp size={15} />
                    {stat.growth}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Community Cravings</h2>
                <p className="mt-2 text-sm text-base-content/60">Most loved food styles</p>
              </div>
              <span className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-500">
                <Heart size={22} fill="currentColor" />
              </span>
            </div>
            <motion.div
              key={cravingIndex}
              initial={{ opacity: 0, x: -34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              {visibleCravings.map((item) => (
                <div key={`${item.label}-${cravingIndex}`} className={`rounded-2xl p-4 text-center ${item.tone}`}>
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/70 text-3xl shadow-sm">
                    {item.icon}
                  </span>
                  <p className="mt-3 text-sm font-extrabold leading-tight">{item.label}</p>
                </div>
              ))}
            </motion.div>
            <div className="mt-5 flex justify-center gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === cravingIndex % 4 ? 'w-6 bg-brand-600' : 'w-2 bg-base-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-6 lg:grid-cols-2">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#073421] to-brand-600 p-8 text-white"
          >
            <Crown className="text-amber-400" size={38} />
            <h2 className="mt-5 text-3xl font-bold">Go Premium</h2>
            <p className="mt-3 text-white/70">
              Unlock unlimited recipe uploads, premium badges, and exclusive culinary content.
            </p>
            <Link href="/dashboard/profile" className="btn mt-7 border-amber-400 bg-transparent text-amber-300 hover:bg-amber-400 hover:text-black">
              Upgrade Now
            </Link>
          </motion.div>
          <div className="rounded-3xl bg-[#fff5df] p-8 text-[#1a2a20]">
            <Users size={38} className="text-brand-600" />
            <h2 className="mt-5 text-3xl font-bold">Join Our Community</h2>
            <p className="mt-3 opacity-65">Share your recipes, get feedback, and build a kitchen brand people remember.</p>
            <Link href="/register" className="btn-brand mt-7">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-base-300">
        <div className="shell grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div className="flex items-center gap-4" key={item.title}>
                <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <ItemIcon />
                </span>
                <div>
                  <b>{item.title}</b>
                  <p className="text-sm opacity-60">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
