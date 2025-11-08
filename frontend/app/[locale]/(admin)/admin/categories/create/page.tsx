"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/admin/SearchableSelect";
import ImageUpload from "@/components/admin/ImageUpload";
import { createCategory, listCategories } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/types";
import { generateSlug } from "@/lib/utils";

export default function CreateCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const parentIdFromUrl = searchParams.get("parentId");
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  // Memoize schema to prevent recreation on every render
  // Schema must be inside component to access translation functions
  const categorySchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, tValidation("nameRequired")),
        slug: z.string().min(2, tValidation("slugRequired")),
        description: z.string().optional(),
        parentId: z.string().optional(),
        image: z.string().optional(),
      }),
    [tValidation]
  );

  // Infer type from schema to maintain type safety and avoid duplication
  type CategoryFormData = z.infer<typeof categorySchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      parentId: parentIdFromUrl || undefined,
    },
  });

  const selectedParentId = watch("parentId");

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

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        image: imageUrl || null,
      });

      showToast({
        title: t("create.success.title"),
        description: t("create.success.description"),
      });

      router.push(`/${locale}/admin/categories`);
    } catch (error) {
      console.error("Failed to create category:", error);
      showToast({
        title: t("create.error.title"),
        description: t("create.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name, 'category');
    setValue("slug", slug);
  };

  const categoryOptions = categories
    .filter((cat) => cat && cat.id && cat.name) // Filter out invalid categories
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
      secondaryLabel: cat.description || undefined,
    }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/categories`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("create.title")}</h1>
          <p className="text-muted-foreground">{t("create.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("edit.basicInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t("edit.name")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    onChange={(e) => {
                      register("name").onChange(e);
                      handleNameChange(e);
                    }}
                    placeholder={t("edit.namePlaceholder")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    {t("edit.slug")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder={t("edit.slugPlaceholder")}
                    dir="ltr"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Category */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("edit.classification")}</h2>
              <div className="space-y-2">
                <Label htmlFor="parentId">{t("edit.parentCategory")}</Label>
                <SearchableSelect
                  options={[
                    { value: "", label: t("edit.rootCategory") },
                    ...categoryOptions,
                  ]}
                  value={selectedParentId || ""}
                  onChange={(value) => setValue("parentId", value || undefined)}
                  placeholder={t("edit.selectParent")}
                  searchPlaceholder={t("edit.searchParent")}
                  emptyText={t("edit.noCategories")}
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("edit.image")}</h2>
              <ImageUpload
                value={imageUrl}
                onChange={(value) => setImageUrl(Array.isArray(value) ? value[0] || "" : value)}
                multiple={false}
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("edit.description")}</h2>
              <Textarea
                {...register("description")}
                placeholder={t("edit.descriptionPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("edit.saving") : t("edit.saveButton")}
            </Button>
            <Link href="/admin/categories">
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
