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
import ImageUpload from "@/components/admin/ImageUpload";
import DynamicSpecs, { type Specification } from "@/components/admin/DynamicSpecs";
import { createProduct, listCategories } from "@/lib/api/admin";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { showToast } from "@/components/ui/toast";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getAdminRoutes } from "@/lib/constants/routes";
import { slugify, generateSKU } from "@/lib/utils/slugify";
import type { Category } from "@/types";

export default function CreateProductPage() {
  const router = useRouter();
  const locale = useLocale();
  const ADMIN_ROUTES = getAdminRoutes(locale);
  const t = useTranslations("admin.products.create");
  const tCommon = useTranslations("common");
  const tSpecs = useTranslations("admin.products.specifications");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      currency: "SAR",
      stock: 0,
    },
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        if (data) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = handleSubmit(async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Convert specifications to attributes object
      const attributes: Record<string, string> = {};
      specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          attributes[spec.key] = spec.value;
        }
      });

      await createProduct({
        ...data,
        images: images.length > 0 ? images.map(img => ({ url: img, alt: data.title })) : undefined,
        image: images.length > 0 ? images[0] : undefined,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });

      showToast({
        title: tCommon("success"),
        description: t("createSuccess"),
      });

      router.push(ADMIN_ROUTES.products.list);
    } catch (error) {
      console.error("Failed to create product:", error);
      showToast({
        title: tCommon("error"),
        description: t("createError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("slug", slugify(title));
  };

  // Generate SKU
  const handleGenerateSKU = () => {
    setValue("sku", generateSKU("PRD"));
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    secondaryLabel: cat.description || undefined,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={ADMIN_ROUTES.products.list}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
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
                    onChange={(e) => {
                      register("title").onChange(e);
                      handleTitleChange(e);
                    }}
                    placeholder={t("titlePlaceholder")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    {t("slug")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder={t("slugPlaceholder")}
                    dir="ltr"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">{t("sku")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      {...register("sku")}
                      placeholder={t("skuPlaceholder")}
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateSKU}
                      title={t("generateSKU")}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">{t("brand")}</Label>
                  <Input
                    id="brand"
                    {...register("brand")}
                    placeholder={t("brandPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">
                    {t("category")} <span className="text-red-500">*</span>
                  </Label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={selectedCategoryId || ""}
                    onChange={(value) => setValue("categoryId", value)}
                    placeholder={t("selectCategory")}
                    searchPlaceholder={t("searchCategory")}
                    emptyText={t("noCategories")}
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("descriptionSection")}</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">{t("shortDescription")}</Label>
                  <Input
                    id="shortDescription"
                    {...register("shortDescription")}
                    placeholder={t("shortDescPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("fullDescription")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder={t("fullDescPlaceholder")}
                    rows={5}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {t("imagesSection")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {t("imagesHint")}
                </span>
              </h2>
              <ImageUpload
                value={images}
                onChange={(value) => {
                  const urls = Array.isArray(value) ? value : [value];
                  setImages(urls);
                }}
                multiple={true}
                maxFiles={5}
              />
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("specificationsSection")}</h2>
              <DynamicSpecs value={specifications} onChange={setSpecifications} />
            </div>

            {/* Inventory */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("inventorySection")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("price")}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder={t("pricePlaceholder")}
                    dir="ltr"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">{t("currency")}</Label>
                  <Input
                    id="currency"
                    {...register("currency")}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">{t("stock")}</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    placeholder={t("stockPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveButton")}
            </Button>
            <Link href={ADMIN_ROUTES.products.list}>
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
