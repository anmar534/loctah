/**
 * Edit Offer Page
 * 
 * Simple routing wrapper for offer editing.
 * All logic is handled by OfferForm component.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { OfferForm } from "@/components/admin/offers";
import PageHeader from "@/components/admin/PageHeader";
import { getOffer } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";
import type { Offer } from "@/types";

export default function EditOfferPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin.offers");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const offerId = params.id as string;

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await getOffer(offerId);
        setOffer(data);
      } catch (error) {
        console.error("Failed to fetch offer:", error);
        router.push("/admin/offers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!offer) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("edit")}
        description={t("editDescription")}
      />
      <div className="mt-6">
        <OfferForm mode="edit" offerId={offerId} initialOffer={offer} />
      </div>
    </div>
  );
}

