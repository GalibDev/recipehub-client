'use client';

import { motion } from 'framer-motion';
import { Clock, Eye, Heart, UserRound } from 'lucide-react';
import Link from 'next/link';
import type { Recipe } from '@/types';
import { cn, imageOrFallback } from '@/lib/utils';

export function RecipeCard({ recipe, compact = false }: { recipe: Recipe; compact?: boolean }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="card-premium group overflow-hidden">
      <Link href={`/recipes/${recipe._id}`} className="relative block overflow-hidden">
        <img
          className={cn('w-full object-cover transition duration-500 group-hover:scale-105', compact ? 'h-40' : 'h-52')}
          src={imageOrFallback(recipe.recipeImage)}
          alt={recipe.recipeName}
        />
        {recipe.isFeatured ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        ) : null}
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow">
          <Heart size={16} />
        </span>
      </Link>
      <div className="p-4">
        <Link href={`/recipes/${recipe._id}`}>
          <h3 className="truncate font-display text-lg font-bold hover:text-brand-600">{recipe.recipeName}</h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-base-content/60">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">{recipe.category}</span>
          <span className="truncate">{recipe.cuisineType}</span>
          <span>&bull;</span>
          <Clock size={13} className="shrink-0" />
          <span className="shrink-0">{recipe.preparationTime} mins</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-base-content/65">
          <span className="flex min-w-0 items-center gap-1.5">
            <UserRound size={14} className="shrink-0" />
            <span className="truncate">{recipe.authorName}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-bold text-rose-500">
            <Heart size={14} fill="currentColor" />
            {recipe.likesCount || 0}
          </span>
        </div>
        <Link href={`/recipes/${recipe._id}`} className="btn btn-outline btn-sm mt-4 w-full rounded-xl">
          <Eye size={15} />
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
