'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle navigation"
        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200"
        onClick={() => setOpen((state) => !state)}
        type="button"
      >
        ☰
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-16 z-30 border-b border-slate-200 bg-white px-4 py-4 shadow-md">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600">
            <Link className="hover:text-slate-900" href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>
            <Link className="hover:text-slate-900" href="/categories" onClick={() => setOpen(false)}>
              Categories
            </Link>
            <Link className="hover:text-slate-900" href="/stores" onClick={() => setOpen(false)}>
              Stores
            </Link>
            <Link className="hover:text-slate-900" href="/search" onClick={() => setOpen(false)}>
              Search
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
