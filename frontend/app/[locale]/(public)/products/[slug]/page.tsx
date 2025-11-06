import FavoriteButton from '@/components/products/FavoriteButton';
import PriceComparison from '@/components/products/PriceComparison';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ShareButton from '@/components/products/ShareButton';
import { getProduct } from '@/lib/api/products';
import type { Product } from '@/types';
import { notFound } from 'next/navigation';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: Product | null | undefined = null;

  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error('Failed to load product', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const productId = product.id || slug;
  const title = product.title || product.name || 'Product';
  const description = product.description || 'No description available.';
  const price = Number.isFinite(product.price) ? product.price : null;
  const currency = product.currency || 'USD';

  return (
    <article className="mx-auto grid w-full max-w-6xl gap-10 py-10 md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <ProductImageGallery
          productId={productId}
          images={product.images ?? null}
          primaryImage={product.image ?? null}
        />
        <div className="flex items-center gap-3">
          <FavoriteButton productId={productId} />
          <ShareButton productId={productId} />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-slate-500">#{slug}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        </header>
        <p className="text-base text-slate-600">{description}</p>
        <PriceComparison currency={currency} value={price} />
      </div>
    </article>
  );
}
