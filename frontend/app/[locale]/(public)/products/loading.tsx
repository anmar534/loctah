import { LoadingGrid } from '@/components/shared/LoadingCard';

export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <LoadingGrid items={8} />
    </div>
  );
}
