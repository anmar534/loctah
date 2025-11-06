import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function StoresLoading() {
  return (
    <div className="flex min-h-[480px] items-center justify-center">
      <LoadingSpinner label="Loading stores" />
    </div>
  );
}
