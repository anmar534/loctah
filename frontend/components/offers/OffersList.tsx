import OfferCard from './OfferCard';

const mockOffers = Array.from({ length: 5 }).map((_, index) => ({
  id: `offer-${index + 1}`,
  title: `Special offer ${index + 1}`,
  description: 'Limited time discount on select items.',
  discount: 10 + index * 5,
}));

type OffersListProps = {
  variant?: 'default' | 'compact';
};

export default function OffersList({ variant = 'default' }: OffersListProps) {
  const className = variant === 'compact' ? 'grid gap-3 md:grid-cols-2' : 'grid gap-4 md:grid-cols-2';

  return (
    <div className={className}>
      {mockOffers.map((offer) => (
        <OfferCard key={offer.id} {...offer} />
      ))}
    </div>
  );
}
