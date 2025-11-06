import { LoadingGrid } from '@/components/shared/LoadingCard';

export default function CategoryLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <LoadingGrid items={6} />
    </div>
  );
}
