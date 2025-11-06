import StoreCard from './StoreCard';

const mockStores = [
  { id: '1', name: 'Central Market', address: '123 Main St, Springfield', status: 'verified' as const },
  { id: '2', name: 'Fresh Foods', address: '98 Sunset Blvd, Springfield', status: 'pending' as const },
  { id: '3', name: 'Daily Essentials', address: '42 Harbor Rd, Springfield', status: 'verified' as const },
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
