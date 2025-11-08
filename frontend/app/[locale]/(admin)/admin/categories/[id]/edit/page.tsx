"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import SearchableSelect from "@/components/admin/SearchableSelect";
import ImageUpload from "@/components/admin/ImageUpload";
import { getCategory, updateCategory, listCategories } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/types";
import { generateSlug } from "@/lib/utils";

export default function EditCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const categoryId = params.id as string;
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  // Memoize schema to prevent recreation on every render
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

  type CategoryFormData = z.infer<typeof categorySchema>;

  const [isLoading, setIsLoading] = useState(true);
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
  });

  const selectedParentId = watch("parentId");

  // Load category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch category and all categories in parallel
        const [categoryData, categoriesData] = await Promise.all([
          getCategory(categoryId),
          listCategories(),
        ]);

        if (categoryData) {
          setValue("name", categoryData.name);
          setValue("slug", categoryData.slug);
          setValue("description", categoryData.description || "");
          setValue("parentId", categoryData.parentId || undefined);
          setImageUrl(categoryData.image || "");
        }

        if (categoriesData) {
          // Filter out current category and its descendants to prevent circular reference
          const filteredCategories = categoriesData.categories.filter(
            (cat) => cat.id !== categoryId
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
        showToast({
          title: t("edit.error.loadTitle"),
          description: t("edit.error.loadDescription"),
          variant: "destructive",
        });
        router.push(`/${locale}/admin/categories`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId, setValue, t, router, locale]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await updateCategory(categoryId, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
        image: imageUrl || null,
      });

      showToast({
        title: t("edit.success.title"),
        description: t("edit.success.description"),
      });

      router.push(`/${locale}/admin/categories`);
    } catch (error) {
      console.error("Failed to update category:", error);
      showToast({
        title: t("edit.error.saveTitle"),
        description: t("edit.error.saveDescription"),
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
    .filter((cat) => cat && cat.id && cat.name && cat.id !== categoryId) // Filter out invalid and self
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
      secondaryLabel: cat.description || undefined,
    }));

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/categories`}>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("edit.title")}</h1>
          <p className="text-muted-foreground">{t("edit.subtitle")}</p>
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
              {isSubmitting ? t("edit.updating") : t("edit.updateButton")}
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
