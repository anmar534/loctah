'use client';

import { createContext, useContext, useState, useEffect, useRef, useId, cloneElement, isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type DropdownContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  menuId: string;
};

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on Escape key and outside clicks
  useEffect(() => {
    if (!open) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Focus first menu item when opened
  useEffect(() => {
    if (open && contentRef.current) {
      const firstMenuItem = contentRef.current.querySelector('button[role="menuitem"], div[role="menuitem"]') as HTMLElement;
      firstMenuItem?.focus();
    }
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, contentRef, menuId }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  const context = useDropdownContext();

  if (asChild && isValidElement(children)) {
    // Clone the child element and merge props
    return cloneElement(children as ReactElement, {
      ref: context.triggerRef,
      onClick: (e: React.MouseEvent) => {
        context.setOpen(!context.open);
        (children as ReactElement).props?.onClick?.(e);
      },
      'aria-expanded': context.open,
      'aria-haspopup': true,
      'aria-controls': context.menuId,
    });
  }

  return (
    <button
      ref={context.triggerRef}
      onClick={() => context.setOpen(!context.open)}
      type="button"
      aria-expanded={context.open}
      aria-haspopup="true"
      aria-controls={context.menuId}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children }: { className?: string; children: ReactNode }) {
  const context = useDropdownContext();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position based on trigger
  useEffect(() => {
    if (context.open && context.triggerRef.current && context.contentRef.current) {
      const rect = context.triggerRef.current.getBoundingClientRect();
      const menu = context.contentRef.current;
      
      // Use viewport-relative coordinates since menu is position: fixed
      // getBoundingClientRect() already returns viewport coordinates, no need to add scroll offsets
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.left = `${rect.left}px`;
    }
  }, [context.open, context.triggerRef, context.contentRef]);

  // Handle keyboard navigation within menu
  useEffect(() => {
    if (!context.open || !context.contentRef.current) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (!context.contentRef.current) return;

      const menuItems = Array.from(
        context.contentRef.current.querySelectorAll('button[role="menuitem"], div[role="menuitem"]')
      ) as HTMLElement[];

      const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;

        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;

        case 'Home':
          event.preventDefault();
          menuItems[0]?.focus();
          break;

        case 'End':
          event.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;
      }
    };

    const menuElement = context.contentRef.current;
    menuElement.addEventListener('keydown', handleKeydown);

    return () => {
      menuElement.removeEventListener('keydown', handleKeydown);
    };
  }, [context.open, context.contentRef]);

  if (!context.open || !mounted) return null;

  const content = (
    <div
      ref={context.contentRef}
      id={context.menuId}
      role="menu"
      className={cn('fixed z-50 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg', className)}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

export function DropdownMenuItem({ 
  className, 
  children, 
  onSelect,
  asChild 
}: { 
  className?: string; 
  children: ReactNode; 
  onSelect?: () => void;
  asChild?: boolean;
}) {
  const context = useDropdownContext();

  const handleClick = () => {
    onSelect?.();
    context.setOpen(false);
    context.triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // If asChild is true, wrap children and let them handle rendering
  if (asChild) {
    return (
      <div
        role="menuitem"
        tabIndex={-1}
        className={cn('flex w-full items-center rounded-md text-sm text-slate-600 hover:bg-slate-100 focus-within:bg-slate-100', className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      role="menuitem"
      className={cn('flex w-full items-center rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
