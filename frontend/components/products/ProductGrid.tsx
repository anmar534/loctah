import type { ReactNode } from 'react';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

type ProductGridProps = {
  products?: Product[];
  emptyFallback?: ReactNode;
  categorySlug?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function ProductGrid({ 
  products = [],
  emptyFallback,
  categorySlug,
  currentPage,
  totalPages,
  onPageChange
}: ProductGridProps) {
  if (!products.length) {
    return emptyFallback ?? <EmptyState title="No products yet" description="Check back soon." />;
  }

  const shouldShowPagination = totalPages && totalPages > 1 && currentPage && onPageChange;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            title={product.name ?? product.title}
            description={product.shortDescription ?? product.description}
            image={product.image ?? undefined}
            price={product.price ?? 0}
            currency={product.currency}
          />
        ))}
      </div>
      {shouldShowPagination && (
        <Pagination page={currentPage} pageCount={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
