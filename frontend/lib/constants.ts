export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0];

export const USER_ROLES = ['user', 'vendor', 'admin'] as const;
export const STORE_STATUSES = ['pending', 'verified', 'suspended'] as const;

export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
export const DEFAULT_THEME = THEME_OPTIONS[2];

export const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export const SUPPORTED_CURRENCIES = ['AED', 'USD', 'SAR', 'EGP'] as const;
export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];

export const MAP_DEFAULT_COORDINATES = {
  lat: 25.2048,
  lng: 55.2708,
} as const;

export const API_TIMEOUT = 10_000;

export const DATE_FORMAT = 'yyyy-MM-dd';

export const STORAGE_KEYS = {
  authToken: 'loctah.auth-token',
  locale: 'loctah.locale',
  theme: 'loctah.theme',
} as const;

export const FALLBACK_IMAGE = '/images/placeholder.png';

export const FEATURE_FLAGS = {
  enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const;
