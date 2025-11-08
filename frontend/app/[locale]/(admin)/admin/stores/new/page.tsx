/**
 * New Store Page
 *
 * Simple routing wrapper for store creation.
 * All logic is handled by StoreForm component.
 */

import { useTranslations } from "next-intl";
import { StoreForm } from "@/components/admin/stores";
import PageHeader from "@/components/admin/PageHeader";

export default function NewStorePage() {
  const t = useTranslations("admin.stores");

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("create")}
        description={t("createDescription")}
      />
      <div className="mt-6">
        <StoreForm mode="create" />
      </div>
    </div>
  );
}
