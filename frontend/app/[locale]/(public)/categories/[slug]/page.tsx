'use client';

import { useEffect, useState } from 'react';
import CategoryBreadcrumb from '@/components/categories/CategoryBreadcrumb';
import ProductGrid from '@/components/products/ProductGrid';
import { useTranslations } from 'next-intl';
import { useProducts } from '@/lib/hooks/useProducts';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('categories');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, loading, error } = useProducts({ 
    category: params.slug, 
    page: currentPage 
  });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [params.slug]);

  const products = data?.data ?? [];
  const totalPages = data?.pageCount;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <CategoryBreadcrumb slug={params.slug} />
      <header>
        <h1 className="text-2xl font-semibold tracking-tight capitalize">
          {params.slug.replace(/[-_]/g, ' ')}
        </h1>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </header>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading products...</p>
      ) : (
        <ProductGrid 
          products={products}
          categorySlug={params.slug}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
