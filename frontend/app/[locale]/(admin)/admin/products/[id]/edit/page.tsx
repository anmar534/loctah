import ProductForm from '@/components/forms/ProductForm';

export default function AdminEditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <p className="text-sm text-slate-600">Update product #{params.id} details.</p>
      </header>
      <ProductForm variant="edit" id={params.id} />
    </div>
  );
}
