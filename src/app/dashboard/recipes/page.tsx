'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Eye, PlusCircle, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import type { Paginated, Recipe } from '@/types';
import { EmptyView } from '@/components/shared/empty-view';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export const dynamic = 'force-dynamic';

export default function MyRecipesPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-recipes', page],
    queryFn: async () => {
      const response = await api.get(`/me/recipes?page=${page}&limit=6`);
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
      <div className="flex items-center justify-between">
        <h1 className="page-title">My Recipes</h1>
        <Link className="btn-brand" href="/dashboard/add">
          <PlusCircle size={18} />
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
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((recipe) => (
              <div className="card-premium overflow-hidden" key={recipe._id}>
                <img className="h-48 w-full object-cover" src={recipe.recipeImage} alt={recipe.recipeName} />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{recipe.recipeName}</h3>
                  <p className="mt-2 text-sm text-base-content/55">
                    {recipe.category} · {recipe.likesCount} likes
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Link className="btn btn-sm flex-1" href={`/recipes/${recipe._id}`}>
                      <Eye size={16} />
                      View
                    </Link>
                    <button onClick={() => deleteRecipe(recipe._id)} className="btn btn-sm text-error">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
