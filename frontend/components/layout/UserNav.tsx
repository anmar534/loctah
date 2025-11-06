'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function UserNav() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
        onClick={() => setOpen((state) => !state)}
        type="button"
      >
        Account
      </button>
      {open ? (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
          role="menu"
        >
          <Link className={menuItem()} href="/profile" onClick={() => setOpen(false)} role="menuitem">
            Profile
          </Link>
          <Link className={menuItem()} href="/profile/favorites" onClick={() => setOpen(false)} role="menuitem">
            Favorites
          </Link>
          <Link className={menuItem()} href="/profile/settings" onClick={() => setOpen(false)} role="menuitem">
            Settings
          </Link>
          <button
            className={menuItem('text-red-600')}
            onClick={() => setOpen(false)}
            role="menuitem"
            type="button"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function menuItem(extra?: string) {
  return cn(
    'flex w-full items-center rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    extra
  );
}
