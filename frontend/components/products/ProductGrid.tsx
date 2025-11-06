import type { ReactNode } from 'react';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import ProductCard from './ProductCard';

const mockProducts = Array.from({ length: 6 }).map((_, index) => ({
  id: `product-${index + 1}`,
  title: `Product ${index + 1}`,
  description: 'High quality product description placeholder.',
  price: 19.99 + index,
}));

type ProductGridProps = {
  emptyFallback?: ReactNode;
  categorySlug?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function ProductGrid({ 
  emptyFallback,
  categorySlug,
  currentPage,
  totalPages,
  onPageChange
}: ProductGridProps) {
  if (!mockProducts.length) {
    return emptyFallback ?? <EmptyState title="No products yet" description="Check back soon." />;
  }

  const shouldShowPagination = totalPages && totalPages > 1 && currentPage && onPageChange;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {shouldShowPagination && (
        <Pagination page={currentPage} pageCount={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
