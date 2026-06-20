'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { imageOrFallback } from '@/lib/utils';
import type { Favorite, Paginated } from '@/types';
import { EmptyView } from '@/components/shared/empty-view';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function FavoritesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites', page],
    queryFn: async () => {
      const response = await api.get(`/me/favorites?page=${page}&limit=6`);
      return response.data as Paginated<Favorite>;
    },
  });

  async function removeFavorite(recipeId: string) {
    try {
      await api.post(`/favorites/${recipeId}`);
      toast.success('Removed from favorites');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (removeError) {
      toast.error(messageOf(removeError));
    }
  }

  return (
    <>
      <h1 className="page-title">My Favorites</h1>
      {error ? (
        <div className="mt-8">
          <ErrorView message={messageOf(error)} />
        </div>
      ) : isLoading ? (
        <LoadingView />
      ) : data?.items.length ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((item) =>
              item.recipeId ? (
                <div className="card-premium overflow-hidden" key={item._id}>
                  <img className="h-48 w-full object-cover" src={imageOrFallback(item.recipeId.recipeImage)} alt={item.recipeId.recipeName} />
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{item.recipeId.recipeName}</h3>
                    <div className="mt-5 flex gap-2">
                      <Link className="btn-brand btn-sm flex-1" href={`/recipes/${item.recipeId._id}`}>
                        View Details
                      </Link>
                      <button onClick={() => removeFavorite(item.recipeId!._id)} className="btn btn-sm text-error">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <PaginationControls page={data.page} pages={data.pages} />
        </>
      ) : (
        <div className="mt-8">
          <EmptyView
            icon={<Heart size={64} />}
            title="No favorites yet"
            description="Save recipes you love so they are easy to revisit later."
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
