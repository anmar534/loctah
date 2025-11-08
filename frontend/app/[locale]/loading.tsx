import { getTranslations } from "next-intl/server";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default async function LocaleLoading() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label={t("loading")} />
    </div>
  );
}
