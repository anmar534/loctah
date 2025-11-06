'use client';

import { useState } from 'react';

type FavoriteButtonProps = {
  productId: string;
};

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);

  return (
    <button
      aria-pressed={favorite}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
        favorite ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600'
      }`}
      onClick={() => setFavorite((state) => !state)}
      type="button"
    >
      {favorite ? '★' : '☆'} Favorite
    </button>
  );
}
