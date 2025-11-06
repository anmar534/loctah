'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getStore } from '@/lib/api/stores';
import type { Store } from '@/types';

export function useStore(id?: string | null) {
  const [data, setData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStore = useCallback(async () => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await getStore(id, { signal: controller.signal });
      // Only update state if request wasn't aborted
      if (!controller.signal.aborted) {
        setData(response || null);
      }
    } catch (err) {
      // Ignore AbortError, don't update state for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      // Handle other errors
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load store.');
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    void fetchStore();

    // Cleanup: abort on unmount or when id changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStore]);

  return {
    data,
    loading,
    error,
    refresh: fetchStore,
  } as const;
}
