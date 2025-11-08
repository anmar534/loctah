/**
 * Create Product Page
 *
 * Simple routing wrapper for product creation.
 * All logic is handled by ProductForm component.
 */

import { useTranslations } from "next-intl";
import { ProductForm } from "@/components/admin/products";
import PageHeader from "@/components/admin/PageHeader";

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <PageHeader
        title={t("create")}
        description={t("createDescription")}
      />
      <div className="mt-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}


