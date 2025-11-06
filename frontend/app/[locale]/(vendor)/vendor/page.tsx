import OffersList from '@/components/offers/OffersList';
import StatsCard from '@/components/admin/StatsCard';
import { getVendorStats } from '@/lib/api/vendor';

export default async function VendorDashboardPage() {
  let stats;
  try {
    stats = await getVendorStats();
  } catch (error) {
    throw new Error('Failed to load vendor statistics');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard 
          title="Active offers" 
          value={stats.activeOffers.value} 
          trend={stats.activeOffers.trend} 
        />
        <StatsCard 
          title="Pending orders" 
          value={stats.pendingOrders.value} 
          trend={stats.pendingOrders.trend} 
        />
        <StatsCard 
          title="Visits" 
          value={stats.visits.value} 
          trend={stats.visits.trend} 
        />
        <StatsCard 
          title="Conversion" 
          value={stats.conversion.value} 
          trend={stats.conversion.trend} 
        />
      </div>
      <OffersList variant="compact" />
    </div>
  );
}
