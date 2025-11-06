'use client';

import { useState, useEffect, useRef } from 'react';
import { checkFavorite, toggleFavorite } from '@/lib/api/favorites';

type FavoriteButtonProps = {
  productId: string;
};

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Fetch initial favorite status
  useEffect(() => {
    isMountedRef.current = true;
    let active = true;

    const fetchFavoriteStatus = async () => {
      try {
        const response = await checkFavorite(productId);
        if (!active || !isMountedRef.current) return;

        if (response) {
          setFavorite(response.isFavorite);
        }
      } catch (err) {
        console.error('Failed to fetch favorite status:', err);
        if (isMountedRef.current) {
          setError('Failed to load favorite status');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchFavoriteStatus();

    return () => {
      active = false;
      isMountedRef.current = false;
    };
  }, [productId]);

  const handleToggle = async () => {
    if (loading || toggling) return;

    // Optimistic update
    const previousState = favorite;
    setFavorite((prev) => !prev);
    setToggling(true);
    setError(null);

    try {
      await toggleFavorite(productId);
      
      if (!isMountedRef.current) return;
      
      // Success - state already updated optimistically
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      
      if (!isMountedRef.current) return;
      
      // Revert optimistic update on failure
      setFavorite(previousState);
      setError('Failed to update favorite');
    } finally {
      if (isMountedRef.current) {
        setToggling(false);
      }
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      {loading ? (
        <button
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-400 disabled:cursor-not-allowed"
          disabled
          type="button"
        >
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></span>
          Loading...
        </button>
      ) : (
        <button
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
            favorite ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
          onClick={handleToggle}
          disabled={toggling}
          type="button"
        >
          {favorite ? '★' : '☆'} {toggling ? 'Updating...' : 'Favorite'}
        </button>
      )}
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
