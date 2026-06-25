'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ChefHat, Clock, Flag, Globe2, Heart, ShoppingBag, Star, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { reportReasons } from '@/lib/constants';
import { formatCurrency, avatarFromName, cn, imageOrFallback } from '@/lib/utils';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { useAuth } from '@/providers';
import type { Recipe } from '@/types';

export const dynamic = 'force-dynamic';

export default function RecipeDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [reportReason, setReportReason] = useState<(typeof reportReasons)[number]>(reportReasons[0]);
  const [reportOpen, setReportOpen] = useState(false);

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', params.id],
    queryFn: async () => {
        const response = await api.get(`/recipes/${params.id}`);
      return response.data as Recipe;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/recipes/${params.id}/like`);
      return response.data as { likesCount: number; liked: boolean };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['recipe', params.id], (current: Recipe | undefined) =>
        current ? { ...current, likesCount: data.likesCount, liked: data.liked } : current
      );
      toast.success(data.liked ? 'Recipe liked' : 'Like removed');
    },
    onError: (mutationError) => {
      toast.error(messageOf(mutationError));
    },
  });

  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const response = await api.post(`/recipes/${params.id}/rating`, { rating });
      return response.data as { ratingAverage: number; ratingCount: number; userRating: number };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['recipe', params.id], (current: Recipe | undefined) =>
        current ? { ...current, ...data } : current
      );
      toast.success('Rating saved');
    },
    onError: (mutationError) => {
      toast.error(messageOf(mutationError));
    },
  });

  function ensureUser(action: () => void) {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/recipes/${params.id}`)}`);
      return;
    }

    action();
  }

  async function toggleFavorite() {
    ensureUser(async () => {
      try {
        const response = await api.post(`/favorites/${params.id}`);
        toast.success(response.data.favorite ? 'Added to favorites' : 'Removed from favorites');
      } catch (favoriteError) {
        toast.error(messageOf(favoriteError));
      }
    });
  }

  async function reportRecipe() {
    ensureUser(async () => {
      try {
        await api.post('/reports', {
          recipeId: params.id,
          reason: reportReason,
        });
        toast.success('Report submitted');
        setReportOpen(false);
      } catch (reportError) {
        toast.error(messageOf(reportError));
      }
    });
  }

  async function purchaseRecipe() {
    ensureUser(async () => {
      try {
        const response = await api.post('/payments/checkout', { recipeId: params.id });
        window.location.href = response.data.url;
      } catch (purchaseError) {
        toast.error(messageOf(purchaseError));
      }
    });
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (error || !recipe) {
    return (
      <div className="shell section">
        <ErrorView message={error ? messageOf(error) : 'Recipe not found'} />
      </div>
    );
  }

  return (
    <div className="shell section">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/recipes">Browse Recipes</Link>
          </li>
          <li>{recipe.recipeName}</li>
        </ul>
      </div>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <img className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft" src={imageOrFallback(recipe.recipeImage)} alt={recipe.recipeName} />
        </div>
        <div className="py-3">
          <span className="badge badge-success badge-outline">{recipe.category}</span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{recipe.recipeName}</h1>
          <div className="mt-5 flex items-center gap-3">
            <img className="size-9 rounded-full" src={avatarFromName(recipe.authorName)} alt={recipe.authorName} />
            <p className="text-sm">
              By <b>{recipe.authorName}</b>
            </p>
            {user?.isPremium ? <span className="badge badge-info badge-sm">Premium</span> : null}
          </div>
          <p className="mt-5 leading-7 text-base-content/65">
            A beautifully crafted recipe designed to turn everyday cooking into something memorable.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-3xl border border-base-300 p-4 text-center text-sm sm:grid-cols-4">
            <div>
              <Globe2 className="mx-auto mb-2 text-brand-600" size={19} />
              <b>{recipe.cuisineType}</b>
              <small className="block opacity-50">Cuisine</small>
            </div>
            <div>
              <Clock className="mx-auto mb-2 text-brand-600" size={19} />
              <b>{recipe.preparationTime} mins</b>
              <small className="block opacity-50">Time</small>
            </div>
            <div>
              <ChefHat className="mx-auto mb-2 text-brand-600" size={19} />
              <b>{recipe.difficultyLevel}</b>
              <small className="block opacity-50">Difficulty</small>
            </div>
            <div>
              <Heart className="mx-auto mb-2 text-brand-600" size={19} />
              <b>{recipe.likesCount}</b>
              <small className="block opacity-50">Likes</small>
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-amber-800">Rate this recipe</p>
                <p className="text-sm text-amber-700/70">
                  Average {recipe.ratingAverage?.toFixed(1) || '0.0'} from {recipe.ratingCount || 0} ratings
                </p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    disabled={ratingMutation.isPending}
                    onClick={() => ensureUser(() => ratingMutation.mutate(rating))}
                    className="rounded-full p-1 text-amber-500 transition hover:scale-110"
                    aria-label={`Rate ${rating} stars`}
                  >
                    <Star size={26} fill={(recipe.userRating || 0) >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <b className="text-2xl">{formatCurrency(recipe.price || 2.99)}</b>
            <button onClick={purchaseRecipe} className="btn-brand">
              <ShoppingBag size={18} />
              Purchase Recipe
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              onClick={() => ensureUser(() => likeMutation.mutate())}
              disabled={likeMutation.isPending}
              className={cn(
                'btn border-2 font-bold',
                recipe.liked
                  ? 'border-rose-500 bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'btn-outline'
              )}
            >
              <Heart size={18} fill={recipe.liked ? 'currentColor' : 'none'} />
              {recipe.liked ? 'Liked' : 'Like'}
            </button>
            <button onClick={toggleFavorite} className="btn btn-outline">
              <Star size={18} />
              Favorite
            </button>
            <button onClick={() => ensureUser(() => setReportOpen(true))} className="btn btn-outline">
              <Flag size={18} />
              Report
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-7">
          <h2 className="text-xl font-bold text-brand-600">Ingredients</h2>
          <ul className="mt-5 space-y-3">
            {recipe.ingredients?.map((item, index) => (
              <li className="flex gap-3" key={`${item}-${index}`}>
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-premium p-7">
          <h2 className="text-xl font-bold text-brand-600">Instructions</h2>
          <ol className="mt-5 space-y-5">
            {recipe.instructions?.map((item, index) => (
              <li className="flex gap-4" key={`${item}-${index}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 font-bold text-brand-600">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {reportOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Report Recipe</h2>
                <p className="mt-2 text-sm text-base-content/60">Choose a reason and submit it for admin review.</p>
              </div>
              <button className="btn btn-ghost btn-circle" onClick={() => setReportOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <label className="mt-6 block">
              <span className="label-text-strong">Reason</span>
              <select
                className="select select-bordered w-full"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value as (typeof reportReasons)[number])}
              >
                {reportReasons.map((reason) => (
                  <option key={reason}>{reason}</option>
                ))}
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setReportOpen(false)}>
                Cancel
              </button>
              <button className="btn-brand" onClick={reportRecipe}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
