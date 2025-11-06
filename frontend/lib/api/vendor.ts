import { apiFetch } from './client';

export type VendorStats = {
  activeOffers: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  pendingOrders: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  visits: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  conversion: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
};

export async function getVendorStats() {
  return apiFetch<VendorStats>('/vendor/stats', {
    next: { revalidate: 60 },
  });
}
