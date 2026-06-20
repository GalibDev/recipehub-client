'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpenText, Heart, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { cn, imageOrFallback } from '@/lib/utils';
import type { Paginated, Recipe } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

function categoryTone(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes('salad') || normalized.includes('healthy')) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  if (normalized.includes('seafood') || normalized.includes('sushi')) {
    return 'border-violet-200 bg-violet-50 text-violet-700';
  }

  return 'border-orange-200 bg-orange-50 text-orange-700';
}

export function ManageRecipesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-recipes', page],
    queryFn: async () => {
      const response = await api.get(`/admin/recipes?page=${page}&limit=8`);
      return response.data as Paginated<Recipe>;
    },
  });

  async function toggleFeature(recipeId: string, isFeatured: boolean) {
    try {
      await api.patch(`/admin/recipes/${recipeId}/feature`, { isFeatured: !isFeatured });
      toast.success(isFeatured ? 'Recipe unfeatured' : 'Recipe featured');
      queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  async function deleteRecipe(recipeId: string) {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    try {
      await api.delete(`/recipes/${recipeId}`);
      toast.success('Recipe deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-recipes'] });
    } catch (requestError) {
      toast.error(messageOf(requestError));
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Manage Recipes</h1>
            <BookOpenText className="text-base-content/60" size={31} />
          </div>
          <p className="mt-2 text-base-content/60">Delete recipes or toggle featured status</p>
        </div>
        <Link className="btn-brand h-12 rounded-lg px-6" href="/dashboard/add">
          <Plus size={19} />
          Add Recipe
        </Link>
      </div>

      {error ? (
        <div className="mt-8">
          <ErrorView message={messageOf(error)} />
        </div>
      ) : isLoading ? (
        <LoadingView />
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-soft">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/40 text-sm text-base-content/70">
                <tr>
                  <th className="px-6 py-5">Recipe</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Likes</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((recipe) => (
                  <tr key={recipe._id} className="border-base-300">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <img className="size-14 rounded-lg object-cover shadow-sm" src={imageOrFallback(recipe.recipeImage)} alt={recipe.recipeName} />
                        <b>{recipe.recipeName}</b>
                      </div>
                    </td>
                    <td className="font-medium text-base-content/80">{recipe.authorName}</td>
                    <td>
                      <span className={cn('inline-flex rounded-full border px-4 py-2 text-sm font-semibold', categoryTone(recipe.category))}>
                        {recipe.category}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 font-bold text-orange-600">
                        <Heart className="text-rose-500" size={17} fill="currentColor" />
                        {recipe.likesCount}
                      </span>
                    </td>
                    <td>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-4 py-2 text-sm font-semibold',
                          recipe.isFeatured
                            ? 'border-violet-200 bg-violet-50 text-violet-700'
                            : 'border-slate-200 bg-slate-100 text-slate-600'
                        )}
                      >
                        {recipe.isFeatured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => toggleFeature(recipe._id, recipe.isFeatured)}
                          className={cn(
                            'inline-flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-bold transition',
                            recipe.isFeatured
                              ? 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                              : 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100'
                          )}
                        >
                          <Star size={17} fill="currentColor" />
                          {recipe.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <Link
                          href={`/admin/recipes/${recipe._id}/edit`}
                          className="inline-flex h-11 items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-5 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                        >
                          <Pencil size={17} />
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteRecipe(recipe._id)}
                          className="inline-flex h-11 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 size={17} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 px-6 py-5 text-sm text-base-content/60">
            <span>
              Showing {data?.items.length ? (page - 1) * 8 + 1 : 0} to {Math.min(page * 8, data?.total || 0)} of {data?.total || 0} recipes
            </span>
            <PaginationControls page={page} pages={data?.pages || 1} />
          </div>
        </div>
      )}
    </>
  );
}
