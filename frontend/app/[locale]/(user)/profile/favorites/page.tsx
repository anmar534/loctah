import FavoritesList from '@/components/products/ProductGrid';

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Favorites</h2>
        <p className="text-sm text-slate-600">Keep track of products you love.</p>
      </header>
      <FavoritesList />
    </div>
  );
}
