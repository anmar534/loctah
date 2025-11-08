/**
 * StoreCard Component
 * 
 * Pure UI component for displaying a single store card.
 */

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@/types';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/admin/StatusBadge';
import { getCityLabel } from '@/lib/constants/cities';
import { MapPin, Phone, Mail, Globe, Edit } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  locale?: string;
  showActions?: boolean;
}

/**
 * Store card component
 * 
 * @example
 * <StoreCard store={store} locale="ar" showActions />
 */
export default function StoreCard({
  store,
  locale = 'ar',
  showActions = true,
}: StoreCardProps) {
  const t = useTranslations('admin.stores');
  const tCommon = useTranslations('common');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
              {store.name.charAt(0)}
            </div>
          )}
          <div className="absolute top-4 right-4">
            <StatusBadge
              status={store.isActive ? 'active' : 'inactive'}
              label={store.isActive ? tCommon('active') : tCommon('inactive')}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Store Name */}
        <div>
          <h3 className="text-xl font-bold">{store.name}</h3>
          <p className="text-sm text-gray-500" dir="ltr">
            {store.slug}
          </p>
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {store.description}
          </p>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {store.city && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{getCityLabel(store.city, locale)}</span>
            </div>
          )}

          {store.phone && (
            <div className="flex items-center gap-2 text-sm" dir="ltr">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{store.phone}</span>
            </div>
          )}

          {store.email && (
            <div className="flex items-center gap-2 text-sm" dir="ltr">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{store.email}</span>
            </div>
          )}

          {store.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-gray-400" />
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                dir="ltr"
              >
                {store.website}
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        {store._count && (
          <div className="flex gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {store._count.products || 0}
              </div>
              <div className="text-xs text-gray-500">{t('stats.products')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {store._count.offers || 0}
              </div>
              <div className="text-xs text-gray-500">{t('stats.offers')}</div>
            </div>
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/admin/stores/${store.id}`}>
              {tCommon('view')}
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/admin/stores/${store.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              {tCommon('edit')}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

