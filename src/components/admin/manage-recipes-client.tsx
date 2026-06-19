'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import type { Paginated, Recipe } from '@/types';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function ManageRecipesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-recipes', page],
    queryFn: async () => {
      const response = await api.get(`/admin/recipes?page=${page}&limit=10`);
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
      <h1 className="page-title">Manage Recipes</h1>
      {error ? (
        <div className="mt-8">
          <ErrorView message={messageOf(error)} />
        </div>
      ) : isLoading ? (
        <LoadingView />
      ) : (
        <>
          <div className="dashboard-card mt-8 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Recipe</th>
                  <th>Author</th>
                  <th>Featured</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data?.items.map((recipe) => (
                  <tr key={recipe._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img className="size-12 rounded-lg object-cover" src={recipe.recipeImage} alt={recipe.recipeName} />
                        <b>{recipe.recipeName}</b>
                      </div>
                    </td>
                    <td>{recipe.authorName}</td>
                    <td>{recipe.isFeatured ? 'Yes' : 'No'}</td>
                    <td className="space-x-2">
                      <button onClick={() => toggleFeature(recipe._id, recipe.isFeatured)} className="btn btn-sm">
                        {recipe.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button onClick={() => deleteRecipe(recipe._id)} className="btn btn-sm text-error">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={page} pages={data?.pages || 1} />
        </>
      )}
    </>
  );
}
