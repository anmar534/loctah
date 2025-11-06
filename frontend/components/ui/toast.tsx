export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();

// Fallback UUID generator for environments without crypto.randomUUID()
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: Generate UUID v4 using crypto.getRandomValues
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Set version (4) in the 7th byte's high nibble
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    
    // Set variant (10) in the 9th byte's high two bits
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    
    // Convert bytes to UUID string format
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  // Final fallback: Use Math.random (less secure but works everywhere)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  const message: ToastMessage = {
    id: generateUUID(),
    duration: 3000,
    variant: 'default',
    ...toast,
  };

  listeners.forEach((listener) => {
    Promise.resolve(listener(message)).catch((error) => {
      console.error('Toast listener error:', error);
    });
  });
}

export function onToast(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
