'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getStore } from '@/lib/api/stores';
import type { Store } from '@/types';

export function useStore(id?: string | null) {
  const [data, setData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchStore = useCallback(async () => {
    if (!id) {
      if (isMounted.current) {
        setData(null);
      }
      return;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await getStore(id);
      if (isMounted.current) {
        setData(response);
      }
    } catch (err) {
      if (isMounted.current) {
        setError((err as Error).message ?? 'Failed to load store.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    void fetchStore();
  }, [fetchStore]);

  return {
    data,
    loading,
    error,
    refresh: fetchStore,
  } as const;
}
