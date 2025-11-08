/**
 * Edit Product Page
 *
 * Simple routing wrapper for product editing.
 * All logic is handled by ProductForm component.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProductForm } from "@/components/admin/products";
import PageHeader from "@/components/admin/PageHeader";
import { getProduct } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin.products");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <PageHeader
        title={t("edit")}
        description={t("editDescription")}
      />
      <div className="mt-6">
        <ProductForm mode="edit" productId={productId} initialProduct={product} />
      </div>
    </div>
  );
}
