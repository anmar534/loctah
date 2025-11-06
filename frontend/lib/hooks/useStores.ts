'use client';

import { useEffect, useState } from 'react';
import { listStores } from '@/lib/api/stores';
import type { PaginatedResponse, Store } from '@/types';

export function useStores(params?: { page?: number; query?: string }) {
  const [data, setData] = useState<PaginatedResponse<Store> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    listStores(params)
      .then((response) => {
        if (!active) return;
        setData(response ?? null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        const errorMessage = 
          typeof err === 'string' 
            ? err 
            : err instanceof Error 
            ? err.message 
            : String(err);
        setError(errorMessage);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params?.page, params?.query]);

  return { data, loading, error } as const;
}
