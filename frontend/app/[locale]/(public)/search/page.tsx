import EmptyState from '@/components/shared/EmptyState';
import ProductGrid from '@/components/products/ProductGrid';
import SearchBar from '@/components/shared/SearchBar';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const t = useTranslations('search');

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <SearchBar placeholder={t('placeholder')} />
      </header>
      <ProductGrid 
        emptyFallback={
          <EmptyState 
            title={t('empty.title')} 
            description={t('empty.description')} 
          />
        } 
      />
    </div>
  );
}
