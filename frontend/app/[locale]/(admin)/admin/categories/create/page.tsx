/**
 * Create Category Page
 * 
 * Simple routing wrapper for category creation.
 * All logic is handled by CategoryForm component.
 */

import { useTranslations } from "next-intl";
import { CategoryForm } from "@/components/admin/categories";
import PageHeader from "@/components/admin/PageHeader";

export default function CreateCategoryPage() {
  const t = useTranslations("admin.categories");

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("create")}
        description={t("createDescription")}
      />
      <div className="mt-6">
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}

