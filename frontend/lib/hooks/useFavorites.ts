'use client';

import { useEffect, useState } from 'react';
import { listFavorites, toggleFavorite } from '@/lib/api/favorites';
import type { Favorite } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listFavorites()
      .then((response) => {
        if (!active) return;
        setFavorites(response);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggle = async (productId: string) => {
    const response = await toggleFavorite(productId);
    setFavorites((state) => {
      const exists = state.some((item) => item.productId === productId);
      if (exists) {
        return state.filter((item) => item.productId !== productId);
      }
      return [...state, response];
    });
  };

  return { favorites, loading, toggle } as const;
}
