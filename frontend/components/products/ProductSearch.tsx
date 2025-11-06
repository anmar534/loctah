'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import SearchBar from '@/components/shared/SearchBar';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { listProducts } from '@/lib/api/products';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductSearch() {
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const searchProducts = async () => {
      setLoading(true);

      try {
        const response = await listProducts({ query: debounced, signal: controller.signal });

        // Only update state if request wasn't aborted
        if (!controller.signal.aborted && response) {
          setResults(response.data);
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Search failed:', error);
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    searchProducts();

    // Cleanup: abort request on unmount or when debounced changes
    return () => {
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [debounced]);

  return (
    <div className="relative w-full max-w-md">
      <SearchBar
        placeholder="Search products"
        onSearch={setQuery}
        className="w-full"
      />
      {loading && (
        <div className="absolute top-full mt-2 w-full rounded-md border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm text-slate-500">Searching...</p>
        </div>
      )}
      {!loading && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border border-slate-200 bg-white shadow-lg">
          <ul className="divide-y divide-slate-100">
            {results.map((product) => (
              <li key={product.id} className="p-3 hover:bg-slate-50">
                <p className="font-medium text-slate-900">{product.title}</p>
                <p className="text-sm text-slate-600">
                  {formatCurrency(product.price, locale, product.currency)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && debounced && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm text-slate-500">No products found</p>
        </div>
      )}
    </div>
  );
}
