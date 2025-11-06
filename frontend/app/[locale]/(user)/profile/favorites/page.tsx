'use client';

import ProductGrid from '@/components/products/ProductGrid';
import EmptyState from '@/components/shared/EmptyState';
import { useFavorites } from '@/lib/hooks/useFavorites';

export default function FavoritesPage() {
  const { products, loading, error } = useFavorites();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Favorites</h2>
        <p className="text-sm text-slate-600">Keep track of products you love.</p>
      </header>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">Loading favorites...</p>
      ) : (
        <ProductGrid 
          products={products}
          emptyFallback={
            <EmptyState
              title="No favorites yet"
              description="Start adding your favorite products to see them here."
            />
          }
        />
      )}
    </div>
  );
}
