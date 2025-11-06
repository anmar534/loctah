'use client';

import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSort from '@/components/products/ProductSort';
import ProductSearch from '@/components/products/ProductSearch';
import { useTranslations } from 'next-intl';
import { useProducts } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
  const t = useTranslations('products');
  const { data, loading, error } = useProducts();

  const products = data?.data ?? [];
  const currentPage = data?.page;
  const totalPages = data?.pageCount;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('pageTitle')}</h1>
          <p className="text-sm text-slate-600">{t('pageSubtitle')}</p>
        </div>
        <ProductSearch />
      </header>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <ProductFilters />
        <div className="flex flex-col gap-4">
          <ProductSort />
          {loading ? (
            <p className="text-sm text-slate-500">Loading products...</p>
          ) : (
            <ProductGrid 
              products={products}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
