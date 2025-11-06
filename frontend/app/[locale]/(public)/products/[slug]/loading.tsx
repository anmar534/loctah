import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProductDetailsLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner label="Loading product" />
    </div>
  );
}
