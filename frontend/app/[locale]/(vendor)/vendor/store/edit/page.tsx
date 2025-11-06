import StoreForm from '@/components/forms/StoreForm';

export default function VendorEditStorePage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit store</h1>
        <p className="text-sm text-slate-600">Make adjustments to your public store information.</p>
      </header>
      <StoreForm variant="edit" />
    </div>
  );
}
