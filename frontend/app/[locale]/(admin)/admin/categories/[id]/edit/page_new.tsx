"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/admin/SearchableSelect";
import ImageUpload from "@/components/admin/ImageUpload";
import { getCategory, updateCategory, listCategories } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const tValidation = useTranslations("validation");
  const t = useTranslations("admin.categories.edit");
  const tCommon = useTranslations("common");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Create schema inside component to access translations
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const selectedParentId = watch("parentId");

  // Fetch the category to edit
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const category = await getCategory(categoryId);
        
        if (!category) {
          showToast({
            title: tCommon("error"),
            description: t("notFound"),
            variant: "destructive",
          });
          router.push("/admin/categories");
          return;
        }
        
        // Pre-populate form with existing data
        reset({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          parentId: category.parentId || undefined,
        });
        
        if (category.image) {
          setImageUrl(category.image);
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
        showToast({
          title: tCommon("error"),
          description: t("loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, reset, router, t, tCommon]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        if (data?.categories) {
          // Filter out current category to prevent circular parent-child relationship
          const filteredCategories = data.categories.filter((cat) => cat.id !== categoryId);
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [categoryId]);

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
        title: tCommon("success"),
        description: t("updateSuccess"),
      });

      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to update category:", error);
      showToast({
        title: tCommon("error"),
        description: t("updateError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate slug from name with Unicode support
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    
    // Try transliteration first (converts Arabic/Unicode to ASCII)
    let slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'ar', // Arabic locale for better transliteration
    });
    
    // If transliteration produces empty string (e.g., emoji-only input)
    // fall back to Unicode-safe slug
    if (!slug || slug.length === 0) {
      slug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\p{L}\p{N}-]/gu, '') // Keep Unicode letters, numbers, and hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }
    
    setValue("slug", slug);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    secondaryLabel: cat.description || undefined,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      ) : (

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("basicInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t("name")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    onChange={(e) => {
                      register("name").onChange(e);
                      handleNameChange(e);
                    }}
                    placeholder={t("namePlaceholder")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    {t("slug")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="category-name"
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
              <h2 className="text-lg font-semibold mb-4">{t("classification")}</h2>
              <div className="space-y-2">
                <Label htmlFor="parentId">{t("parentCategory")}</Label>
                <SearchableSelect
                  options={[
                    { value: "", label: t("rootCategory") },
                    ...categoryOptions,
                  ]}
                  value={selectedParentId || ""}
                  onChange={(value) => setValue("parentId", value || undefined)}
                  placeholder={t("selectParent")}
                  searchPlaceholder={t("searchParent")}
                  emptyText={t("noCategories")}
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("image")}</h2>
              <ImageUpload
                value={imageUrl ? [imageUrl] : []}
                onChange={(value) => setImageUrl(Array.isArray(value) ? value[0] || "" : value)}
                maxFiles={1}
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("description")}</h2>
              <Textarea
                {...register("description")}
                placeholder={t("descriptionPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveButton")}
            </Button>
            <Link href="/admin/categories">
              <Button type="button" variant="outline">
                {tCommon("cancel")}
              </Button>
            </Link>
          </div>
        </Card>
      </form>
      )}
    </div>
  );
}
