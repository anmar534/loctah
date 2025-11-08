/**
 * useTableActions Hook
 * 
 * Manage common table actions (delete, toggle status) with confirmation.
 */

'use client';

import { useState, useCallback } from 'react';
import { useConfirm } from './useConfirm';
import { useTranslations } from 'next-intl';

interface UseTableActionsOptions {
  onDelete?: (id: string) => Promise<void>;
  onToggleStatus?: (id: string) => Promise<void>;
  onSuccess?: (action: 'delete' | 'toggle', id: string) => void;
  onError?: (error: Error, action: 'delete' | 'toggle') => void;
}

interface UseTableActionsReturn {
  isLoading: boolean;
  handleDelete: (id: string, itemName?: string) => Promise<void>;
  handleToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
  confirmState: ReturnType<typeof useConfirm>['confirmState'];
  closeDialog: () => void;
}

/**
 * Hook for table actions with confirmation
 * 
 * @param options - Action handlers and callbacks
 * @returns Action handlers and loading state
 * 
 * @example
 * const { handleDelete, handleToggleStatus, isLoading } = useTableActions({
 *   onDelete: async (id) => await deleteStore(id),
 *   onToggleStatus: async (id) => await toggleStoreStatus(id),
 *   onSuccess: () => refetch()
 * });
 */
export function useTableActions(
  options: UseTableActionsOptions = {}
): UseTableActionsReturn {
  const { onDelete, onToggleStatus, onSuccess, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const { confirm, confirmState, closeDialog } = useConfirm();
  const t = useTranslations('common');

  const handleDelete = useCallback(
    async (id: string, itemName?: string) => {
      const confirmed = await confirm({
        title: t('confirmDelete'),
        message: itemName
          ? `${t('confirmDeleteMessage')} "${itemName}"؟`
          : t('confirmDeleteMessage'),
        confirmText: t('delete'),
        cancelText: t('cancel'),
        variant: 'destructive',
      });

      if (!confirmed || !onDelete) return;

      setIsLoading(true);

      try {
        await onDelete(id);
        
        if (onSuccess) {
          onSuccess('delete', id);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Delete failed');
        
        if (onError) {
          onError(error, 'delete');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [confirm, onDelete, onSuccess, onError, t]
  );

  const handleToggleStatus = useCallback(
    async (id: string, currentStatus: boolean) => {
      const action = currentStatus ? 'تعطيل' : 'تفعيل';
      
      const confirmed = await confirm({
        title: `${action} العنصر`,
        message: `هل أنت متأكد من ${action} هذا العنصر؟`,
        confirmText: action,
        cancelText: t('cancel'),
        variant: currentStatus ? 'destructive' : 'default',
      });

      if (!confirmed || !onToggleStatus) return;

      setIsLoading(true);

      try {
        await onToggleStatus(id);
        
        if (onSuccess) {
          onSuccess('toggle', id);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Toggle failed');
        
        if (onError) {
          onError(error, 'toggle');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [confirm, onToggleStatus, onSuccess, onError, t]
  );

  return {
    isLoading,
    handleDelete,
    handleToggleStatus,
    confirmState,
    closeDialog,
  };
}

