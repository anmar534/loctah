"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/admin/SearchableSelect";
import { createOffer, listProducts, listStores } from "@/lib/api/admin";
import { offerSchema, type OfferFormData } from "@/lib/validations/offer";
import { showToast } from "@/components/ui/toast";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import { getAdminRoutes } from "@/lib/constants/routes";
import type { Product, Store } from "@/types";

export default function CreateOfferPage() {
  const router = useRouter();
  const locale = useLocale();
  const ADMIN_ROUTES = getAdminRoutes(locale);
  const t = useTranslations("admin.offers.create");
  const tCommon = useTranslations("common");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [calculatedDiscount, setCalculatedDiscount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      active: true,
    },
  });

  const selectedProductId = watch("productId");
  const selectedStoreId = watch("storeId");
  const originalPrice = watch("originalPrice");
  const discountedPrice = watch("discountedPrice");
  const discount = watch("discount");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, storesData] = await Promise.all([
          listProducts({ limit: 100 }),
          listStores({ limit: 100 }),
        ]);
        if (productsData) {
          setProducts(productsData.products || []);
        }
        if (storesData) {
          setStores(storesData.stores || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Auto-calculate discount percentage
  useEffect(() => {
    if (originalPrice && discountedPrice && originalPrice > 0 && discountedPrice < originalPrice) {
      const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
      setCalculatedDiscount(discountPercent);
      setValue("discount", discountPercent);
    } else {
      setCalculatedDiscount(null);
    }
  }, [originalPrice, discountedPrice, setValue]);

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);
    try {
      // Convert datetime-local to ISO 8601
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      await createOffer(formattedData);

      showToast({
        title: tCommon("success"),
        description: t("createSuccess"),
      });

      router.push(ADMIN_ROUTES.offers.list);
    } catch (error) {
      console.error("Failed to create offer:", error);
      showToast({
        title: tCommon("error"),
        description: t("createError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.title,
    secondaryLabel: product.category?.name || undefined,
  }));

  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.name,
    secondaryLabel: store.city || undefined,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={ADMIN_ROUTES.offers.list}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("basicInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">
                    {t("titleLabel")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder={t("titlePlaceholder")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">
                    {t("description")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder={t("descriptionPlaceholder")}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productId">{t("product")}</Label>
                  <SearchableSelect
                    options={productOptions}
                    value={selectedProductId || ""}
                    onChange={(value) => setValue("productId", value)}
                    placeholder={t("selectProduct")}
                    searchPlaceholder={t("searchProduct")}
                    emptyText={t("noProducts")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeId">{t("store")}</Label>
                  <SearchableSelect
                    options={storeOptions}
                    value={selectedStoreId || ""}
                    onChange={(value) => setValue("storeId", value)}
                    placeholder={t("selectStore")}
                    searchPlaceholder={t("searchStore")}
                    emptyText={t("noStores")}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("pricingSection")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">{t("originalPrice")}</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    {...register("originalPrice", { valueAsNumber: true })}
                    placeholder={t("pricePlaceholder")}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">{t("discountedPrice")}</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    {...register("discountedPrice", { valueAsNumber: true })}
                    placeholder={t("pricePlaceholder")}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">
                    {t("discount")}
                    {calculatedDiscount !== null && (
                      <span className="ms-2 text-sm text-green-600">
                        <Calculator className="inline h-3 w-3 me-1" />
                        {calculatedDiscount}%
                      </span>
                    )}
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    step="1"
                    {...register("discount", { valueAsNumber: true })}
                    placeholder="0"
                    dir="ltr"
                    readOnly={calculatedDiscount !== null}
                    className={calculatedDiscount !== null ? "bg-gray-50" : ""}
                  />
                  {errors.discount && (
                    <p className="text-sm text-red-600">{errors.discount.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("datesSection")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    {t("startDate")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    {...register("startDate")}
                    dir="ltr"
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{t("dateFormatHint")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    {t("endDate")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    {...register("endDate")}
                    dir="ltr"
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{t("dateFormatHint")}</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("linksSection")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="link">{t("link")}</Label>
                  <Input
                    id="link"
                    type="url"
                    {...register("link")}
                    placeholder={t("linkPlaceholder")}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliateUrl">{t("affiliateUrl")}</Label>
                  <Input
                    id="affiliateUrl"
                    type="url"
                    {...register("affiliateUrl")}
                    placeholder={t("affiliateUrlPlaceholder")}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  {...register("active")}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  {t("activeLabel")}
                </Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveButton")}
            </Button>
            <Link href={ADMIN_ROUTES.offers.list}>
              <Button type="button" variant="outline">
                {tCommon("cancel")}
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
