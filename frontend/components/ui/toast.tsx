export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  const message: ToastMessage = {
    id: crypto.randomUUID(),
    duration: 3000,
    variant: 'default',
    ...toast,
  };

  listeners.forEach((listener) => listener(message));
}

export function onToast(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
