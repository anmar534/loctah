import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function LocaleLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label="Loading content" />
    </div>
  );
}
