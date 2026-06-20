'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api, messageOf } from '@/lib/api';
import { categories, difficulties } from '@/lib/constants';
import type { Recipe } from '@/types';

type RecipeFormValues = {
  recipeName: string;
  recipeImage: string;
  category: string;
  cuisineType: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  preparationTime: number;
  price: number;
  ingredients: string;
  instructions: string;
};

export function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router = useRouter();
  const editing = Boolean(recipe);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      recipeName: recipe?.recipeName || '',
      recipeImage: recipe?.recipeImage || '',
      category: recipe?.category || categories[0],
      cuisineType: recipe?.cuisineType || '',
      difficultyLevel: recipe?.difficultyLevel || 'Easy',
      preparationTime: recipe?.preparationTime || 30,
      price: recipe?.price || 2.99,
      ingredients: recipe?.ingredients?.join('\n') || '',
      instructions: recipe?.instructions?.join('\n') || '',
    },
  });

  async function onSubmit(values: RecipeFormValues) {
    try {
      const payload = {
        ...values,
        preparationTime: Number(values.preparationTime),
        price: Number(values.price),
        ingredients: values.ingredients
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        instructions: values.instructions
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (recipe?._id) {
        await api.patch(`/recipes/${recipe._id}`, payload);
      } else {
        await api.post('/recipes', payload);
      }

      toast.success(editing ? 'Recipe updated' : 'Recipe published');
      router.push('/dashboard/recipes');
      router.refresh();
    } catch (error) {
      toast.error(messageOf(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6 xl:grid-cols-2">
      <div className="dashboard-card space-y-5">
        <label className="block">
          <span className="label-text-strong">Recipe Name</span>
          <input className="input-clean" {...register('recipeName', { required: true })} />
        </label>
        <label className="block">
          <span className="label-text-strong">Recipe Image URL</span>
          <input className="input-clean" {...register('recipeImage', { required: true })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-text-strong">Category</span>
            <select className="select-clean" {...register('category', { required: true })}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-text-strong">Cuisine Type</span>
            <input className="input-clean" {...register('cuisineType', { required: true })} />
          </label>
        </div>
      </div>
      <div className="dashboard-card space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="label-text-strong">Difficulty</span>
            <select className="select-clean" {...register('difficultyLevel')}>
              {difficulties.map((difficulty) => (
                <option key={difficulty}>{difficulty}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label-text-strong">Prep Time</span>
            <input type="number" className="input-clean" {...register('preparationTime', { required: true })} />
          </label>
          <label className="block">
            <span className="label-text-strong">Price</span>
            <input type="number" step="0.01" className="input-clean" {...register('price', { required: true })} />
          </label>
        </div>
        <label className="block">
          <span className="label-text-strong">Ingredients (one per line)</span>
          <textarea className="textarea textarea-bordered h-32 w-full" {...register('ingredients', { required: true })} />
        </label>
        <label className="block">
          <span className="label-text-strong">Instructions (one step per line)</span>
          <textarea className="textarea textarea-bordered h-40 w-full" {...register('instructions', { required: true })} />
        </label>
        <button disabled={isSubmitting} className="btn-brand w-full">
          {editing ? 'Save Recipe' : 'Publish Recipe'}
        </button>
      </div>
    </form>
  );
}
