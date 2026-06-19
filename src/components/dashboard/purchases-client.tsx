'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag } from 'lucide-react';
import { api, messageOf } from '@/lib/api';
import type { Paginated, Payment } from '@/types';
import { EmptyView } from '@/components/shared/empty-view';
import { ErrorView } from '@/components/shared/error-view';
import { LoadingView } from '@/components/shared/loading-view';
import { PaginationControls } from '@/components/shared/pagination-controls';

export function PurchasesClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['purchases', page],
    queryFn: async () => {
      const response = await api.get(`/me/purchases?page=${page}&limit=6`);
      return response.data as Paginated<Payment>;
    },
  });

  return (
    <>
      <h1 className="page-title">My Purchased Recipes</h1>
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
                  <img className="h-48 w-full object-cover" src={item.recipeId.recipeImage} alt={item.recipeId.recipeName} />
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{item.recipeId.recipeName}</h3>
                    <Link className="btn-brand btn-sm mt-5 w-full" href={`/recipes/${item.recipeId._id}`}>
                      View Details
                    </Link>
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
            icon={<ShoppingBag size={64} />}
            title="No purchases yet"
            description="Purchase premium recipe content to unlock it here."
            action={
              <Link className="btn-brand" href="/recipes">
                Explore Recipes
              </Link>
            }
          />
        </div>
      )}
    </>
  );
}
