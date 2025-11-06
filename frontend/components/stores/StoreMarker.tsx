'use client';

type StoreMarkerProps = {
  storeId: string;
  active?: boolean;
  onSelect?: () => void;
};

export default function StoreMarker({ storeId, active = false, onSelect }: StoreMarkerProps) {
  return (
    <button
      className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${
        active ? 'border-emerald-300 bg-emerald-600 text-white' : 'border-white bg-slate-900 text-white'
      }`}
      onClick={onSelect}
      aria-pressed={active}
      title={`Store ${storeId}`}
      type="button"
    >
      {storeId}
    </button>
  );
}
