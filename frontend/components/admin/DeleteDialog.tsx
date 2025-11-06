'use client';

import { cloneElement, isValidElement, useState, useEffect, useRef, useId } from 'react';
import type { MouseEvent, ReactElement } from 'react';

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
} & Record<string, unknown>;

type TriggerElement = ReactElement<TriggerProps>;

type DeleteDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  trigger: TriggerElement;
  onConfirm?: () => Promise<void> | void;
  submitting?: boolean;
};

export default function DeleteDialog({
  title,
  description,
  confirmLabel = 'Delete',
  trigger,
  onConfirm,
  submitting,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const isSubmitting = submitting ?? internalSubmitting;

  // Focus management and keyboard handling
  useEffect(() => {
    if (!open) return;

    // Store the element that triggered the dialog
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus the dialog
    const focusDialog = () => {
      if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(focusDialog, 10);

    // Handle Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setOpen(false);
      }
    };

    // Focus trap
    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleFocusTrap);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Restore focus to trigger element
      if (previouslyFocused && previouslyFocused !== document.body) {
        previouslyFocused.focus();
      } else if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [open, isSubmitting]);

  const handleConfirm = async () => {
    if (!onConfirm) {
      setOpen(false);
      return;
    }

    if (submitting === undefined) {
      try {
        setInternalSubmitting(true);
        await onConfirm();
        setOpen(false);
      } catch (error) {
        console.error('DeleteDialog confirmation failed', error);
      } finally {
        setInternalSubmitting(false);
      }
    } else {
      try {
        await onConfirm();
        setOpen(false);
      } catch (error) {
        console.error('DeleteDialog confirmation failed', error);
      }
    }
  };

  const handleTriggerClick = (event: MouseEvent<HTMLElement>) => {
    if (isSubmitting) return;
    
    // Store reference to trigger element
    triggerElementRef.current = event.currentTarget as HTMLElement;
    
    if (trigger.props.onClick) {
      trigger.props.onClick(event);
    }
    setOpen(true);
  };

  return (
    <div>
      {isValidElement(trigger)
        ? cloneElement(trigger, {
            onClick: handleTriggerClick,
            'aria-haspopup': 'dialog',
            'aria-expanded': open,
            disabled: isSubmitting || trigger.props.disabled,
          })
        : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-slate-600">
              {description}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="text-sm text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={isSubmitting}
                onClick={handleConfirm}
                type="button"
              >
                {isSubmitting ? 'Processing…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
