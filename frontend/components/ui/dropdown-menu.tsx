'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DropdownContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return <DropdownContext.Provider value={{ open, setOpen }}>{children}</DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ children }: { children: ReactNode }) {
  const context = useDropdownContext();

  return (
    <button onClick={() => context.setOpen(!context.open)} type="button">
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children }: { className?: string; children: ReactNode }) {
  const context = useDropdownContext();

  if (!context.open) return null;

  return (
    <div className={cn('mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg', className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, children, onSelect }: { className?: string; children: ReactNode; onSelect?: () => void }) {
  const context = useDropdownContext();

  return (
    <button
      className={cn('flex w-full items-center rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100', className)}
      onClick={() => {
        onSelect?.();
        context.setOpen(false);
      }}
      type="button"
    >
      {children}
    </button>
  );
}

function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown menu components must be used within <DropdownMenu>.');
  }

  return context;
}
