"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import CategoryTreeItem from "@/components/admin/CategoryTreeItem";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getCategoriesTree, deleteCategory } from "@/lib/api/admin";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesPage() {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoriesTree();
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      showToast({
        title: tCommon("error"),
        description: t("fetchError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, tCommon]);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete);
      showToast({
        title: tCommon("success"),
        description: t("deleteSuccess"),
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      showToast({
        title: tCommon("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Link href={`/${locale}/admin/categories/create`}>
          <Button>
            <Plus className="h-4 w-4 me-2" />
            {t("addNew")}
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t("noCategories")}</p>
            <Link href={`/${locale}/admin/categories/create`}>
              <Button>
                <Plus className="h-4 w-4 me-2" />
                {t("addNew")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("delete")}
        description={t("confirmDelete")}
        onConfirm={handleDelete}
        isDestructive
        isLoading={isDeleting}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
      />
    </div>
  );
}
