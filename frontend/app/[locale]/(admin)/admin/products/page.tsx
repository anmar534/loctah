"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import DataTable, {
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PageHeader from "@/components/admin/PageHeader";
import Link from "next/link";
import { listProducts, deleteProduct, listCategories } from "@/lib/api/admin";
import type { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import { getAdminRoutes } from "@/lib/constants/routes";
import Image from "next/image";

export default function AdminProductsPage() {
  const t = useTranslations("admin.products");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const ADMIN_ROUTES = getAdminRoutes(locale);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await listProducts({ page, limit: 10 });
      if (response) {
        setProducts(response.products);
        setTotalItems(response.total);
      }
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      showToast({
        title: tCommon("error"),
        description: t("fetchError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      if (response) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast({
        title: tCommon("success"),
        description: t("deleteSuccess"),
      });
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Failed to delete product:", error);
      showToast({
        title: tCommon("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get unique brands for filter
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[];

  const columns: DataTableColumn<Product>[] = [
    {
      key: "image",
      label: t("columns.image"),
      render: (product) => (
        <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">{t("noImage")}</span>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: t("columns.name"),
      sortable: true,
      render: (product) => (
        <div>
          <p className="font-medium">{product.title}</p>
          {product.shortDescription && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.shortDescription}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: t("columns.category"),
      render: (product) => (
        <span className="text-sm">{product.category?.name || "—"}</span>
      ),
    },
    {
      key: "sku",
      label: t("columns.sku"),
      render: (product) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {product.sku || "—"}
        </code>
      ),
    },
    {
      key: "brand",
      label: t("columns.brand"),
      render: (product) => <span className="text-sm">{product.brand || "—"}</span>,
    },
    {
      key: "actions",
      label: t("columns.actions"),
      className: "w-[150px]",
      render: (product) => (
        <div className="flex items-center gap-2">
          <Link href={ADMIN_ROUTES.products.edit(product.id)}>
            <Button variant="ghost" size="sm" title={tCommon("edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setProductToDelete(product);
              setDeleteDialogOpen(true);
            }}
            title={tCommon("delete")}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filters: DataTableFilter[] = [
    {
      key: "categoryId",
      label: t("filterByCategory"),
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
    ...(brands.length > 0
      ? [
          {
            key: "brand",
            label: t("filterByBrand"),
            options: brands.map((brand) => ({
              value: brand,
              label: brand,
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actionLabel={t("addNew")}
        actionHref={ADMIN_ROUTES.products.new}
      />

      <DataTable
        data={products}
        columns={columns}
        searchKey="title"
        searchPlaceholder={t("search")}
        filters={filters}
        pagination={true}
        pageSize={10}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={fetchProducts}
        isLoading={loading}
        emptyMessage={t("emptyMessage")}
      />

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
