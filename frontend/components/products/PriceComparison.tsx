import { formatCurrency } from '@/lib/utils';

type PriceComparisonProps = {
  productId: string;
  value: number;
  currency?: string;
  size?: 'sm' | 'md';
};

const mockStores = [
  { name: 'Store A', price: 18.99 },
  { name: 'Store B', price: 19.49 },
  { name: 'Store C', price: 21.0 },
];

export default function PriceComparison({ productId, value, currency = 'USD', size = 'md' }: PriceComparisonProps) {
  const displayStores = mockStores.map((store) => ({
    ...store,
    price: store.price + Number(productId.length % 2 === 0 ? 0.5 : 0),
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className={size === 'sm' ? 'text-base font-semibold' : 'text-2xl font-semibold'}>
          {formatCurrency(value, 'en', currency)}
        </span>
        <span className="text-xs uppercase tracking-wide text-slate-500">Best price</span>
      </div>
      <ul className="flex flex-col gap-2 text-sm text-slate-600">
        {displayStores.map((store) => (
          <li className="flex items-center justify-between" key={store.name}>
            <span>{store.name}</span>
            <span>{formatCurrency(store.price, 'en', currency)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
