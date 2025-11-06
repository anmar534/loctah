import StoreForm from '@/components/forms/StoreForm';

export default function VendorStorePage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">My store</h1>
        <p className="text-sm text-slate-600">Update store details, contact information and branding.</p>
      </header>
      <StoreForm />
    </div>
  );
}
