"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import StatsCard from "@/components/admin/StatsCard";
import { Store, Package, Tag, Users, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getDashboardStats, listOffers } from "@/lib/api/admin";
import type { Offer } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");
  const tCommon = useTranslations("common");
  const [stats, setStats] = useState({
    stores: 0,
    products: 0,
    offers: 0,
    users: 0,
  });
  const [recentOffers, setRecentOffers] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [offersError, setOffersError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stats
    getDashboardStats()
      .then((data) => {
        if (data) {
          setStats(data);
          setStatsError(null);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
        setStatsError(
          `Unable to load dashboard stats${error.message ? `: ${error.message}` : ""}`
        );
      })
      .finally(() => {
        setIsLoadingStats(false);
      });

    // Fetch recent offers
    listOffers({ page: 1, limit: 5 })
      .then((data) => {
        if (data?.offers) {
          setRecentOffers(data.offers);
          setOffersError(null);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch offers:", error);
        setOffersError(
          `Unable to load recent offers${error.message ? `: ${error.message}` : ""}`
        );
      })
      .finally(() => {
        setIsLoadingOffers(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoadingStats ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </>
        ) : statsError ? (
          <Card className="p-6 col-span-full">
            <div className="text-center text-destructive">
              <p className="font-medium">{statsError}</p>
            </div>
          </Card>
        ) : (
          <>
            <StatsCard
              title={t("stats.stores")}
              value={stats.stores}
              icon={Store}
            />
            <StatsCard
              title={t("stats.products")}
              value={stats.products}
              icon={Package}
            />
            <StatsCard
              title={t("stats.activeOffers")}
              value={stats.offers}
              icon={Tag}
            />
            <StatsCard
              title={t("stats.users")}
              value={stats.users}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Recent Offers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t("recentOffers")}</h2>
          <Link
            href="/admin/offers"
            className="text-sm text-primary hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>

        {isLoadingOffers ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : offersError ? (
          <div className="text-center text-destructive py-8">
            <p className="font-medium">{offersError}</p>
          </div>
        ) : recentOffers.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            {t("noOffers")}
          </div>
        ) : (
          <div className="divide-y">
            {recentOffers.map((offer: any) => (
              <div
                key={offer.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-medium">
                    {offer.product?.nameAr || offer.product?.nameEn || offer.title || "عرض"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tCommon("discount")} {offer.discountPercent || offer.discount}% • {tCommon("expiresOn")}{" "}
                    {format(new Date(offer.validUntil || offer.endDate), "dd MMM yyyy", {
                      locale: ar,
                    })}
                  </p>
                </div>
                <Link
                  href={`/admin/offers/${offer.id}/edit`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {tCommon("view")}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
