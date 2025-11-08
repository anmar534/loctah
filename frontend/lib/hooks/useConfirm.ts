/**
 * useConfirm Hook
 * 
 * Manage confirmation dialogs with promise-based API.
 */

'use client';

import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface UseConfirmReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  confirmState: ConfirmState;
  closeDialog: () => void;
}

/**
 * Hook for confirmation dialogs
 * 
 * @returns Confirm function and dialog state
 * 
 * @example
 * const { confirm, confirmState, closeDialog } = useConfirm();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'حذف المتجر',
 *     message: 'هل أنت متأكد من حذف هذا المتجر؟',
 *     variant: 'destructive'
 *   });
 *   
 *   if (confirmed) {
 *     // Proceed with deletion
 *   }
 * };
 */
export function useConfirm(): UseConfirmReturn {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'تأكيد',
    cancelText: 'إلغاء',
    variant: 'default',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'تأكيد',
        cancelText: options.cancelText || 'إلغاء',
        variant: options.variant || 'default',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  const closeDialog = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirm,
    confirmState,
    closeDialog,
  };
}

