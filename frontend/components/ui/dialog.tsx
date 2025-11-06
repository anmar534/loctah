'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Comprehensive selector for focusable elements
const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'audio[controls]:not([disabled])',
  'video[controls]:not([disabled])',
  '[contenteditable]:not([disabled])',
  'details:not([disabled])',
  'summary:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])'
].join(', ');

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

export function DialogContent({ 
  className, 
  children,
  ariaLabelledBy,
  ariaDescribedBy
}: { 
  className?: string; 
  children: ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}) {
  const context = useDialogContext();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!context.open) return;

    // Save currently focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into dialog after portal has rendered
    let rafId: number | null = null;
    const dialogElement = dialogRef.current;
    
    if (dialogElement) {
      // Use requestAnimationFrame to ensure portal child is mounted
      rafId = requestAnimationFrame(() => {
        // Find first focusable element or focus the dialog itself
        const focusableElements = dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          dialogElement.focus();
        }
      });
    }

    // Keyboard handler for Escape and focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        context.setOpen(false);
        return;
      }

      // Focus trap: constrain Tab navigation within dialog
      if (e.key === 'Tab' && dialogElement) {
        const focusableElements = dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        
        // No focusable elements: do nothing
        if (focusableElements.length === 0) {
          return;
        }
        
        // Single focusable element: prevent Tab from escaping
        if (focusableElements.length === 1) {
          e.preventDefault();
          focusableElements[0].focus();
          return;
        }
        
        // Multiple focusable elements: normal focus trap logic
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if on first element, wrap to last
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      // Cancel pending focus animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      
      // Restore focus to previously focused element
      if (previouslyFocusedRef.current && previouslyFocusedRef.current.isConnected) {
        try {
          previouslyFocusedRef.current.focus();
        } catch (error) {
          // Silently handle any focus errors (e.g., element hidden or not focusable)
        }
      }
    };
  }, [context.open, context.setOpen]);

  if (!context.open) return null;

  const dialogContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={() => context.setOpen(false)}
    >
      <div 
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        {...(ariaLabelledBy && { 'aria-labelledby': ariaLabelledBy })}
        {...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy })}
        tabIndex={-1}
        className={cn('max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // Render into portal
  return typeof document !== 'undefined' ? createPortal(dialogContent, document.body) : null;
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
