'use client';

import { useEffect, useState } from 'react';
import { listOffers } from '@/lib/api/offers';
import type { Offer, PaginatedResponse } from '@/types';

export function useOffers(params?: { page?: number }) {
  const [data, setData] = useState<PaginatedResponse<Offer> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = params?.page;

  useEffect(() => {
    let active = true;
    setLoading(true);

    listOffers({ page })
      .then((response) => {
        if (!active) return;
        setData(response || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  return { data, loading, error } as const;
}
