import ProductForm from '@/components/forms/ProductForm';

export default function AdminCreateProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Create product</h1>
        <p className="text-sm text-slate-600">Add a new product to the catalog.</p>
      </header>
      <ProductForm />
    </div>
  );
}
