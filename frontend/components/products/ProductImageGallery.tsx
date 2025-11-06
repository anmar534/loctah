'use client';

import { useEffect, useMemo, useState } from 'react';
import { FALLBACK_IMAGE } from '@/lib/constants';
import type { ProductImage } from '@/types';

export type ProductImageGalleryProps = {
  productId: string;
  images?: ProductImage[] | null;
  primaryImage?: string | null;
};

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

export default function ProductImageGallery({ productId, images, primaryImage }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const resolvedImages = useMemo(() => {
    const normalized = images?.length
      ? images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt ?? `Product image ${image.id}`,
        }))
      : [];

    if (normalized.length) {
      return normalized;
    }

    const fallbackSources = [primaryImage, FALLBACK_IMAGE, FALLBACK_IMAGE].filter(Boolean) as string[];

    return fallbackSources.map((src, index) => ({
      id: `${productId}-${index}`,
      url: src,
      alt: `Product image ${index + 1}`,
    }));
  }, [images, primaryImage, productId]);

  useEffect(() => {
    setGallery(resolvedImages);
    setActiveIndex(0);
  }, [resolvedImages]);

  if (!gallery.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">
        No images available for this product yet.
      </div>
    );
  }

  const activeImage = gallery[activeIndex] ?? gallery[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img alt={activeImage.alt} className="h-full w-full object-cover" src={activeImage.url} />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((image, imageIndex) => (
            <button
              key={image.id}
              className={`overflow-hidden rounded-lg border ${
                activeIndex === imageIndex ? 'border-slate-900' : 'border-transparent'
              }`}
              onClick={() => setActiveIndex(imageIndex)}
              type="button"
            >
              <img alt={image.alt} className="h-full w-full object-cover" src={image.url} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}