import CategoryBreadcrumb from '@/components/categories/CategoryBreadcrumb';
import ProductGrid from '@/components/products/ProductGrid';
import { useTranslations } from 'next-intl';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('categories');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <CategoryBreadcrumb slug={params.slug} />
      <header>
        <h1 className="text-2xl font-semibold tracking-tight capitalize">
          {params.slug.replace(/[-_]/g, ' ')}
        </h1>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </header>
      <ProductGrid categorySlug={params.slug} />
    </div>
  );
}
