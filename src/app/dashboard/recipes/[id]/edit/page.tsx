'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api, messageOf } from '@/lib/api';
import type { Recipe } from '@/types';
import { RecipeForm } from '@/components/recipes/recipe-form';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';

export default function EditRecipePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', params.id],
    queryFn: async () => {
      const response = await api.get(`/recipes/${params.id}`);
      return response.data as Recipe;
    },
  });

  if (isLoading) {
    return <LoadingView label="Loading recipe..." />;
  }

  if (error || !data) {
    return <ErrorView message={error ? messageOf(error) : 'Recipe not found'} />;
  }

  return (
    <>
      <h1 className="page-title">Edit Recipe</h1>
      <p className="mt-2 text-base-content/55">Update your recipe details and save the latest version.</p>
      <RecipeForm recipe={data} />
    </>
  );
}
