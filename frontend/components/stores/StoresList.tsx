import StoreCard from './StoreCard';
import type { Store } from '@/types';

// Static timestamp for deterministic mock data
const STATIC_TS = '2023-01-01T00:00:00.000Z';

const mockStores: Store[] = [
  { 
    id: '1', 
    slug: 'central-market',
    name: 'Central Market', 
    address: '123 Main St, Springfield', 
    status: 'verified',
    createdAt: STATIC_TS,
    updatedAt: STATIC_TS,
  },
  { 
    id: '2', 
    slug: 'fresh-foods',
    name: 'Fresh Foods', 
    address: '98 Sunset Blvd, Springfield', 
    status: 'pending',
    createdAt: STATIC_TS,
    updatedAt: STATIC_TS,
  },
  { 
    id: '3', 
    slug: 'daily-essentials',
    name: 'Daily Essentials', 
    address: '42 Harbor Rd, Springfield', 
    status: 'verified',
    createdAt: STATIC_TS,
    updatedAt: STATIC_TS,
  },
];

export default function StoresList() {
  return (
    <div className="flex flex-col gap-4">
      {mockStores.map((store) => (
        <StoreCard key={store.id} {...store} />
      ))}
    </div>
  );
}
