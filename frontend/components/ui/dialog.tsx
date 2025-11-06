'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DialogContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function Dialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  const context = useDialogContext();

  return (
    <button onClick={() => context.setOpen(true)} type="button">
      {children}
    </button>
  );
}

export function DialogContent({ className, children }: { className?: string; children: ReactNode }) {
  const context = useDialogContext();

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className={cn('max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg', className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogClose({ children }: { children: ReactNode }) {
  const context = useDialogContext();

  return (
    <button onClick={() => context.setOpen(false)} type="button">
      {children}
    </button>
  );
}

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog components must be used within <Dialog>.');
  }

  return context;
}
