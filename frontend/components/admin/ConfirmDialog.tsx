"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
  isDestructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations("common");
  const [error, setError] = useState<string | null>(null);
  
  // Clear error whenever dialog is closed
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);
  
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    
    try {
      await onConfirm();
      onOpenChange(false); // Only close on success
    } catch (err) {
      // Capture error message and keep dialog open
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText || t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={isDestructive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isLoading ? t("loading") : (confirmText || t("confirm"))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
