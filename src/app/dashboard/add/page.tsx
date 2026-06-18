import { RecipeForm } from '@/components/recipes/recipe-form';

export default function AddRecipePage() {
  return (
    <>
      <h1 className="page-title">Add Recipe</h1>
      <p className="mt-2 text-base-content/55">Share your best dish with the RecipeHub community.</p>
      <RecipeForm />
    </>
  );
}
