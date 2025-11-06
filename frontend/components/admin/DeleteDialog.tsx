'use client';

import { cloneElement, isValidElement, useState } from 'react';
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

  const isSubmitting = submitting ?? internalSubmitting;

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
          <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="text-sm text-slate-600"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
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
