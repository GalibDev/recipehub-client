'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

export function RecipeForm({ recipe, redirectTo = '/dashboard/recipes' }: { recipe?: Recipe; redirectTo?: string }) {
  const router = useRouter();
  const editing = Boolean(recipe);
  const [uploadingImage, setUploadingImage] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
  const imagePreview = watch('recipeImage');

  async function uploadImage(file?: File) {
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error('ImgBB key missing. Add NEXT_PUBLIC_IMGBB_API_KEY to env.');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result?.data?.url) {
        throw new Error(result?.error?.message || 'Image upload failed');
      }

      setValue('recipeImage', result.data.url, { shouldValidate: true, shouldDirty: true });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  }

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
      router.push(redirectTo);
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
        <label className="block">
          <span className="label-text-strong">Upload Image (ImgBB)</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            className="file-input file-input-bordered w-full"
            onChange={(event) => uploadImage(event.target.files?.[0])}
          />
          <small className="mt-2 block text-base-content/50">
            {uploadingImage ? 'Uploading image...' : 'Upload an image or paste a direct image URL above.'}
          </small>
        </label>
        {imagePreview ? (
          <img className="h-36 w-full rounded-2xl object-cover" src={imagePreview} alt="Recipe preview" />
        ) : null}
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
