'use client';

import { useState, useRef, useEffect } from 'react';

export type ShareButtonProps = {
  productId: string;
};

export default function ShareButton({ productId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${productId}`;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
      onClick={async () => {
        if (!navigator.clipboard) {
          console.error('Clipboard API not available');
          return;
        }
        try {
          await navigator.clipboard.writeText(shareLink);
          setCopied(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => setCopied(false), 1500);
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
        }
      }}
      type="button"
    >
      🔗 {copied ? 'Copied' : 'Share'}
    </button>
  );
}
