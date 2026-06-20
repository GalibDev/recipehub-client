'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart3, BookOpen, Eye, Heart, Pencil, Plus, Trash2, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { cn, imageOrFallback } from '@/lib/utils';
import type { Paginated, Recipe } from '@/types';
import { EmptyView } from '@/components/shared/empty-view';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

function formatDate(value?: string) {
  if (!value) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('en-GB').format(new Date(value));
}

function difficultyTone(difficulty: Recipe['difficultyLevel']) {
  if (difficulty === 'Hard') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (difficulty === 'Medium') {
    return 'bg-amber-50 text-amber-700';
  }

  return 'bg-sky-50 text-sky-700';
}

export function MyRecipesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-recipes', page],
    queryFn: async () => {
      const response = await api.get(`/me/recipes?page=${page}&limit=8`);
      return response.data as Paginated<Recipe>;
    },
  });

  async function deleteRecipe(recipeId: string) {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/recipes/${recipeId}`);
      toast.success('Recipe deleted');
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    } catch (deleteError) {
      toast.error(messageOf(deleteError));
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">My Recipes</h1>
            <BookOpen className="text-base-content/60" size={31} />
          </div>
          <p className="mt-2 text-lg text-base-content/60">{data?.total || 0} recipe published</p>
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
      ) : data?.items.length ? (
        <>
          <div className="mt-8 overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-soft">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200/40 text-sm text-base-content/70">
                  <tr>
                    <th className="px-6 py-5">Recipe</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Likes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((recipe) => (
                    <tr key={recipe._id} className="border-base-300">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            className="size-16 rounded-lg object-cover shadow-sm"
                            src={imageOrFallback(recipe.recipeImage)}
                            alt={recipe.recipeName}
                          />
                          <div>
                            <b className="text-lg">{recipe.recipeName}</b>
                            <small className="block text-base-content/50">{formatDate(recipe.createdAt)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700">
                          <Utensils size={16} />
                          {recipe.category}
                        </span>
                      </td>
                      <td>
                        <span className={cn('inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold', difficultyTone(recipe.difficultyLevel))}>
                          <BarChart3 size={16} />
                          {recipe.difficultyLevel}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2 font-semibold text-base-content/70">
                          <Heart className="text-rose-500" size={18} fill="currentColor" />
                          {recipe.likesCount}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600">
                          <span className="size-2.5 rounded-full bg-slate-500" />
                          {recipe.isFeatured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap items-center gap-3">
                          <Link className="btn btn-outline btn-sm h-11 rounded-lg px-5" href={`/recipes/${recipe._id}`}>
                            <Eye size={17} />
                            View
                          </Link>
                          <Link className="btn btn-outline btn-sm h-11 rounded-lg border-orange-300 px-5 text-orange-600" href={`/dashboard/recipes/${recipe._id}/edit`}>
                            <Pencil size={17} />
                            Edit
                          </Link>
                          <button onClick={() => deleteRecipe(recipe._id)} className="btn btn-outline btn-sm h-11 rounded-lg border-rose-300 px-5 text-rose-600">
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
          </div>
          <PaginationControls page={data.page} pages={data.pages} />
        </>
      ) : (
        <div className="mt-8">
          <EmptyView
            icon={<BookOpen size={64} />}
            title="No recipes yet"
            description="Publish your first recipe and start building your RecipeHub profile."
            action={
              <Link className="btn-brand" href="/dashboard/add">
                Add Recipe
              </Link>
            }
          />
        </div>
      )}
    </>
  );
}
