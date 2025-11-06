'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from './toast';
import { onToast } from './toast';

export function Toaster() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const unsubscribe = onToast((message) => {
      setMessages((state) => [...state, message]);
      const duration = message.duration ?? 3000;
      
      const timeoutId = setTimeout(() => {
        setMessages((state) => state.filter((item) => item.id !== message.id));
        timeoutsRef.current.delete(message.id);
      }, duration);
      
      timeoutsRef.current.set(message.id, timeoutId);
    });

    // Cleanup: clear all timeouts when component unmounts
    return () => {
      unsubscribe();
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  if (!messages.length) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2"
    >
      {messages.map((message) => {
        const isDestructive = message.variant === 'destructive';
        const ariaLabel = message.description 
          ? `${message.title}: ${message.description}` 
          : message.title;

        return (
          <div
            key={message.id}
            role={isDestructive ? 'alert' : 'status'}
            aria-live={isDestructive ? 'assertive' : 'polite'}
            aria-atomic="true"
            aria-label={ariaLabel}
            className={cn(
              'min-w-[240px] rounded-lg border px-4 py-3 shadow-lg',
              isDestructive
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-slate-200 bg-white text-slate-700'
            )}
          >
            <strong className="block text-sm font-semibold">{message.title}</strong>
            {message.description ? <span className="mt-1 block text-xs text-slate-500">{message.description}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
