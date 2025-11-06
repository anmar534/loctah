'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/api/products';
import type { Product } from '@/types';

export function useProduct(slug: string) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let active = true;
    setLoading(true);

    getProduct(slug)
      .then((response) => {
        if (!active) return;
        setData(response || null);
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
  }, [slug]);

  return { data, loading, error } as const;
}
