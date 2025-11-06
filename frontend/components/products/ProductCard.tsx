import FavoriteButton from './FavoriteButton';
import PriceComparison from './PriceComparison';

export type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  currency?: string;
};

export default function ProductCard({ id, title, description, image, price, currency = 'USD' }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
        {image ? <img alt={title} className="h-full w-full object-cover" src={image} /> : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="flex-1 text-sm text-slate-600">{description}</p>
        <div className="flex items-center justify-between">
          <PriceComparison currency={currency} size="sm" value={price} />
          <FavoriteButton productId={id} />
        </div>
      </div>
    </article>
  );
}
