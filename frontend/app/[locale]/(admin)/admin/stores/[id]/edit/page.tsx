/**
 * Edit Store Page
 *
 * Simple routing wrapper for store editing.
 * All logic is handled by StoreForm component.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { StoreForm } from "@/components/admin/stores";
import PageHeader from "@/components/admin/PageHeader";
import { getStore } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";
import type { Store } from "@/types";

export default function EditStorePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin.stores");
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeId = params.id as string;

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStore(storeId);
        setStore(data);
      } catch (error) {
        console.error("Failed to fetch store:", error);
        router.push("/admin/stores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [storeId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!store) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("edit")}
        description={t("editDescription")}
      />
      <div className="mt-6">
        <StoreForm mode="edit" storeId={storeId} initialStore={store} />
      </div>
    </div>
  );
}
