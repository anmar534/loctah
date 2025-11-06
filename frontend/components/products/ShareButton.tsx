'use client';

import { useState } from 'react';

export type ShareButtonProps = {
  productId: string;
};

export default function ShareButton({ productId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${productId}`;

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
      onClick={() => {
        navigator.clipboard?.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      type="button"
    >
      🔗 {copied ? 'Copied' : 'Share'}
    </button>
  );
}
