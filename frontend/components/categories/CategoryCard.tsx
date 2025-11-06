import Link from 'next/link';

export type CategoryCardProps = {
  slug: string;
  name: string;
  description?: string;
};

export default function CategoryCard({ slug, name, description }: CategoryCardProps) {
  return (
    <Link
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      href={`/categories/${slug}`}
    >
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </Link>
  );
}
