/**
 * Edit Category Page
 * 
 * Simple routing wrapper for category editing.
 * All logic is handled by CategoryForm component.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CategoryForm } from "@/components/admin/categories";
import PageHeader from "@/components/admin/PageHeader";
import { getCategory } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin.categories");
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategory(categoryId);
        setCategory(data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        router.push("/admin/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("edit")}
        description={t("editDescription")}
      />
      <div className="mt-6">
        <CategoryForm mode="edit" categoryId={categoryId} initialCategory={category} />
      </div>
    </div>
  );
}

