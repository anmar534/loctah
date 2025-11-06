import CategoryForm from '@/components/forms/CategoryForm';

export default function AdminCreateCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Create category</h1>
        <p className="text-sm text-slate-600">Introduce a new grouping for products.</p>
      </header>
      <CategoryForm />
    </div>
  );
}
