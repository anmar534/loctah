type ClassValue = string | number | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatCurrency(value: number | null, locale = 'en', currency = 'USD'): string {
  if (value === null) {
    return 'Price unavailable';
  }
  if (value === 0) {
    return 'Free';
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatNumber(value: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
}
