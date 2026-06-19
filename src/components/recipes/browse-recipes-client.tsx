'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChefHat, Search } from 'lucide-react';
import { api, messageOf } from '@/lib/api';
import { categories, cuisines, difficulties } from '@/lib/constants';
import type { Paginated, Recipe } from '@/types';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ErrorView } from '@/components/shared/error-view';
import { RecipeCard } from './recipe-card';

export function BrowseRecipesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== 'page') {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  const queryString = searchParams.toString() || 'page=1';

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', queryString],
    queryFn: async () => {
      const response = await api.get(`/recipes?${queryString}`);
      return response.data as Paginated<Recipe>;
    },
  });

  return (
    <div className="shell section">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>Browse Recipes</li>
        </ul>
      </div>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">Browse Recipes</h1>
        <label className="flex w-full items-center rounded-2xl border border-base-300 px-3 sm:w-80">
          <Search size={17} />
          <input
            defaultValue={searchParams.get('search') || ''}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateParam('search', event.currentTarget.value);
              }
            }}
            className="h-11 flex-1 bg-transparent px-2 outline-none"
            placeholder="Search recipes..."
          />
        </label>
      </div>
      <div className="my-8 grid gap-4 rounded-3xl border border-base-300 bg-base-200 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <select className="select-clean" defaultValue={searchParams.get('category') || ''} onChange={(event) => updateParam('category', event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select className="select-clean" defaultValue={searchParams.get('cuisine') || ''} onChange={(event) => updateParam('cuisine', event.target.value)}>
          <option value="">All Cuisine</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select className="select-clean" defaultValue={searchParams.get('difficulty') || ''} onChange={(event) => updateParam('difficulty', event.target.value)}>
          <option value="">All Levels</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty}>{difficulty}</option>
          ))}
        </select>
        <select className="select-clean" defaultValue={searchParams.get('sort') || 'latest'} onChange={(event) => updateParam('sort', event.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Most Popular</option>
        </select>
        <button className="btn-brand" onClick={() => router.push(`${pathname}?${searchParams.toString()}`)}>
          <Search size={17} />
          Apply Filters
        </button>
      </div>
      {error ? (
        <ErrorView message={messageOf(error)} />
      ) : isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-3xl bg-base-200" />
          ))}
        </div>
      ) : data?.items.length ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
          <PaginationControls page={data.page} pages={data.pages} />
        </>
      ) : (
        <div className="py-24 text-center">
          <ChefHat size={64} className="mx-auto text-brand-200" />
          <h2 className="mt-4 text-2xl font-bold">No recipes found</h2>
          <p className="mt-2 text-base-content/60">Try broadening your filters.</p>
        </div>
      )}
    </div>
  );
}
