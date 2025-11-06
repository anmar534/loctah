'use client';

import { useEffect, useState } from 'react';
import { listProducts } from '@/lib/api/products';
import type { PaginatedResponse, Product } from '@/types';

export function useProducts(params?: { page?: number; query?: string; category?: string }) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listProducts(params)
      .then((response) => {
        if (!active) return;
        setData(response);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError((err as Error).message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params?.page, params?.query, params?.category]);

  return { data, loading, error } as const;
}
