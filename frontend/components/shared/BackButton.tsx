'use client';

import { useRouter } from 'next/navigation';

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
      onClick={() => router.back()}
    >
      ← {label}
    </button>
  );
}
