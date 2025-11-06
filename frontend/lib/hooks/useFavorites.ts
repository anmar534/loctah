'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { listFavorites, toggleFavorite } from '@/lib/api/favorites';
import type { Favorite, Product } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let active = true;
    setLoading(true);

    listFavorites()
      .then((response) => {
        if (!active || !isMountedRef.current) return;
        if (response) {
          setFavorites(response);
        }
        setError(null);
      })
      .catch((err) => {
        if (!active || !isMountedRef.current) return;
        setError((err as Error).message || 'Failed to load favorites');
      })
      .finally(() => {
        if (!active || !isMountedRef.current) return;
        setLoading(false);
      });

    return () => {
      active = false;
      isMountedRef.current = false;
    };
  }, []);

  const toggle = useCallback(async (productId: string) => {
    try {
      const response = await toggleFavorite(productId);
      
      if (!isMountedRef.current) return;
      
      if (!response) {
        console.error('Toggle favorite returned undefined response');
        return;
      }

      setFavorites((prevState) => {
        const exists = prevState.some((item) => item.productId === productId);
        if (exists) {
          return prevState.filter((item) => item.productId !== productId);
        }
        return [...prevState, response];
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Optionally: show error toast or set error state
    }
  }, []);

  // Extract products from favorites (only those with product data)
  const products: Product[] = favorites
    .map((fav) => fav.product)
    .filter((product): product is Product => product !== undefined);

  return { favorites, products, loading, error, toggle } as const;
}
