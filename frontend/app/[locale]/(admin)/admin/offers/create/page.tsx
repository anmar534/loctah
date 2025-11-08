/**
 * Create Offer Page
 * 
 * Simple routing wrapper for offer creation.
 * All logic is handled by OfferForm component.
 */

import { useTranslations } from "next-intl";
import { OfferForm } from "@/components/admin/offers";
import PageHeader from "@/components/admin/PageHeader";

export default function CreateOfferPage() {
  const t = useTranslations("admin.offers");

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <PageHeader
        title={t("create")}
        description={t("createDescription")}
      />
      <div className="mt-6">
        <OfferForm mode="create" />
      </div>
    </div>
  );
}

