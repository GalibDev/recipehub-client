'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, HeartOff, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { imageOrFallback } from '@/lib/utils';
import type { Paginated, Recipe } from '@/types';
import { EmptyView } from '@/components/shared/empty-view';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function LikedRecipesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['liked-recipes', page],
    queryFn: async () => {
      const response = await api.get(`/me/likes?page=${page}&limit=6`);
      return response.data as Paginated<Recipe>;
    },
  });

  async function removeLike(recipeId: string) {
    try {
      await api.post(`/recipes/${recipeId}/like`);
      toast.success('Removed from liked recipes');
      queryClient.invalidateQueries({ queryKey: ['liked-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['my-stats'] });
    } catch (removeError) {
      toast.error(messageOf(removeError));
    }
  }

  return (
    <>
      <h1 className="page-title">Liked Recipes</h1>
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
                <img className="h-48 w-full object-cover" src={imageOrFallback(recipe.recipeImage)} alt={recipe.recipeName} />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{recipe.recipeName}</h3>
                  <p className="mt-2 text-sm text-base-content/55">
                    {recipe.category} - {recipe.likesCount} likes
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Link className="btn btn-sm flex-1" href={`/recipes/${recipe._id}`}>
                      <Eye size={16} />
                      View
                    </Link>
                    <button onClick={() => removeLike(recipe._id)} className="btn btn-sm text-error">
                      <HeartOff size={16} />
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
            icon={<ThumbsUp size={64} />}
            title="No liked recipes yet"
            description="Recipes you like will appear here for quick access."
            action={
              <Link className="btn-brand" href="/recipes">
                Browse Recipes
              </Link>
            }
          />
        </div>
      )}
    </>
  );
}
