import CategoryForm from '@/components/forms/CategoryForm';

export default function AdminEditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit category</h1>
        <p className="text-sm text-slate-600">Update category #{params.id} information.</p>
      </header>
      <CategoryForm variant="edit" id={params.id} />
    </div>
  );
}
