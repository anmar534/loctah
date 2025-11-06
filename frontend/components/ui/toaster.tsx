'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ToastMessage } from './toast';
import { onToast } from './toast';

export function Toaster() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return onToast((message) => {
      setMessages((state) => [...state, message]);
      const duration = message.duration ?? 3000;
      setTimeout(() => {
        setMessages((state) => state.filter((item) => item.id !== message.id));
      }, duration);
    });
  }, []);

  if (!messages.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'min-w-[240px] rounded-lg border px-4 py-3 shadow-lg',
            message.variant === 'destructive'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-slate-200 bg-white text-slate-700'
          )}
        >
          <strong className="block text-sm font-semibold">{message.title}</strong>
          {message.description ? <span className="mt-1 block text-xs text-slate-500">{message.description}</span> : null}
        </div>
      ))}
    </div>
  );
}
