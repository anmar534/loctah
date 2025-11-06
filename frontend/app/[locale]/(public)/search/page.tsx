'use client';

import { useState } from 'react';
import EmptyState from '@/components/shared/EmptyState';
import ProductGrid from '@/components/products/ProductGrid';
import SearchBar from '@/components/shared/SearchBar';
import { useTranslations } from 'next-intl';
import { useProducts } from '@/lib/hooks/useProducts';

export default function SearchPage() {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');
  const { data, loading, error } = useProducts({ query });

  const products = data?.data ?? [];
  const currentPage = data?.page;
  const totalPages = data?.pageCount;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <SearchBar placeholder={t('placeholder')} onSearch={setQuery} />
      </header>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">{t('loading')}</p>
      ) : (
        <ProductGrid 
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          emptyFallback={
            <EmptyState 
              title={t('empty.title')} 
              description={t('empty.description')} 
            />
          } 
        />
      )}
    </div>
  );
}
