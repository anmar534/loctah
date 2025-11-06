import OfferForm from '@/components/forms/OfferForm';

export default function VendorEditOfferPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit offer</h1>
        <p className="text-sm text-slate-600">Adjust discount details for offer #{params.id}.</p>
      </header>
      <OfferForm variant="edit" />
    </div>
  );
}
