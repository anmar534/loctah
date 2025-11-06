'use client';

import { useEffect, useState } from 'react';
import { listOffers } from '@/lib/api/offers';
import type { Offer, PaginatedResponse } from '@/types';

export function useOffers(params?: { page?: number }) {
  const [data, setData] = useState<PaginatedResponse<Offer> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listOffers(params)
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
  }, [params?.page]);

  return { data, loading, error } as const;
}
