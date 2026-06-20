'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarDays, ChefHat, Clock, Crown, Flame, Globe2, Heart, Leaf, ShieldCheck, Sparkles, TrendingUp, Users, Utensils } from 'lucide-react';
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

  const { data: statRecipes = [] } = useQuery({
    queryKey: ['home-stat-recipes'],
    queryFn: async () => {
      const response = await api.get('/recipes?limit=24');
      return response.data.items as Recipe[];
    },
  });

  const thisMonth = new Date();
  const recipesThisMonth = statRecipes.filter((recipe) => {
    if (!recipe.createdAt) {
      return false;
    }

    const createdAt = new Date(recipe.createdAt);
    return createdAt.getMonth() === thisMonth.getMonth() && createdAt.getFullYear() === thisMonth.getFullYear();
  }).length;
  const quickRecipes = statRecipes.filter((recipe) => recipe.preparationTime <= 30).length;
  const comfortRecipes = statRecipes.filter((recipe) =>
    ['dinner', 'main course', 'indian', 'italian'].some((keyword) =>
      `${recipe.category} ${recipe.cuisineType}`.toLowerCase().includes(keyword)
    )
  ).length;
  const dessertRecipes = statRecipes.filter((recipe) => recipe.category.toLowerCase().includes('dessert')).length;
  const categoryCounts = statRecipes.reduce<Record<string, number>>((counts, recipe) => {
    counts[recipe.category] = (counts[recipe.category] || 0) + 1;
    return counts;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Global';
  const totalLikes = statRecipes.reduce((total, recipe) => total + (recipe.likesCount || 0), 0);
  const mostLovedRecipe = [...statRecipes].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))[0]?.recipeName || 'New favorites';
  const cuisineSpread = new Set(statRecipes.map((recipe) => recipe.cuisineType).filter(Boolean)).size;
  const featuredCount = statRecipes.filter((recipe) => recipe.isFeatured).length;

  const flavorCalendarStats = [
    { icon: CalendarDays, label: 'New this month', value: recipesThisMonth || statRecipes.length, note: 'Fresh kitchen drops' },
    { icon: Clock, label: 'Quick plates', value: quickRecipes, note: 'Ready in 30 minutes' },
    { icon: Flame, label: 'Comfort picks', value: comfortRecipes, note: 'Dinner-ready ideas' },
    { icon: Sparkles, label: 'Sweet moments', value: dessertRecipes, note: 'Dessert inspiration' },
  ];

  const tasteTrendStats = [
    { icon: TrendingUp, label: 'Top category', value: topCategory, note: 'Most represented' },
    { icon: Heart, label: 'Community likes', value: totalLikes, note: 'Across recent recipes' },
    { icon: Globe2, label: 'Cuisine spread', value: cuisineSpread, note: 'Styles to explore' },
    { icon: Crown, label: 'Featured picks', value: featuredCount, note: 'Curated by admins' },
  ];

  return (
    <>
      <section className="hero-glow overflow-hidden">
        <div className="shell grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">
              Cook <span>•</span> Share <span>•</span> Inspire
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] sm:text-6xl">
              Share Recipes.
              <br />
              <span className="text-brand-600">Inspire</span> the World.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-base-content/65">
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
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-8 rounded-full bg-amber-200/20 blur-3xl" />
            <img
              className="relative aspect-square w-full rounded-full border-[14px] border-white object-cover shadow-2xl"
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
              alt="Hero dish"
            />
            <div className="absolute -left-3 top-1/2 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-soft">
              <Users className="mb-1 text-brand-600" />
              <b>25K+</b>
              <p className="text-xs opacity-60">Recipe lovers</p>
            </div>
            <div className="absolute right-0 top-12 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-soft">
              <ChefHat className="mb-1 text-brand-600" />
              <b>10K+</b>
              <p className="text-xs opacity-60">Happy cooks</p>
            </div>
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
        <div className="shell">
          <SectionHeading title="Flavor Calendar" subtitle="Season-ready cooking signals from the RecipeHub kitchen." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flavorCalendarStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-soft"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-brand-600">
                    <Icon size={22} />
                  </span>
                  <p className="mt-5 text-sm font-semibold text-base-content/55">{stat.label}</p>
                  <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
                  <p className="mt-2 text-sm text-base-content/55">{stat.note}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-base-200">
        <div className="shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="eyebrow">Taste signals</span>
            <h2 className="mt-4 text-4xl font-extrabold">Taste Trends</h2>
            <p className="mt-4 max-w-xl text-base-content/65">
              See what cooks are loving right now, from rising categories to the most-loved recipe momentum.
            </p>
            <div className="mt-7 rounded-2xl border border-base-300 bg-base-100 p-5">
              <Leaf className="text-brand-600" size={26} />
              <p className="mt-3 text-sm text-base-content/55">Most loved recipe</p>
              <h3 className="mt-1 text-2xl font-bold">{mostLovedRecipe}</h3>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {tasteTrendStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Icon size={21} />
                    </span>
                    <p className="text-right text-sm font-semibold text-base-content/50">{stat.label}</p>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold">{stat.value}</p>
                  <p className="mt-2 text-sm text-base-content/55">{stat.note}</p>
                </motion.div>
              );
            })}
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
            <Link href="/dashboard" className="btn mt-7 border-amber-400 bg-transparent text-amber-300 hover:bg-amber-400 hover:text-black">
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
