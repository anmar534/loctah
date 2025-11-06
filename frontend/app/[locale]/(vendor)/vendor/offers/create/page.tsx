import OfferForm from '@/components/forms/OfferForm';

export default function VendorCreateOfferPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Create offer</h1>
        <p className="text-sm text-slate-600">Launch a new promotion for your audience.</p>
      </header>
      <OfferForm />
    </div>
  );
}
