"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import DataTable, {
  type DataTableColumn,
  type DataTableFilter,
} from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Link from "next/link";
import { listStores, deleteStore, toggleStoreStatus } from "@/lib/api/admin";
import type { Store } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2, Power } from "lucide-react";
import { showToast } from "@/components/ui/toast";
import Image from "next/image";

const CITIES = [
  { value: "riyadh", label: "الرياض" },
  { value: "jeddah", label: "جدة" },
  { value: "dammam", label: "الدمام" },
  { value: "mecca", label: "مكة المكرمة" },
  { value: "medina", label: "المدينة المنورة" },
];

const STATUS_OPTIONS = [
  { value: "verified", label: "موثق" },
  { value: "pending", label: "قيد المراجعة" },
  { value: "suspended", label: "معلق" },
];

export default function AdminStoresPage() {
  const t = useTranslations("admin.stores");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStores = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await listStores({ page, limit: 10 });
      if (response) {
        setStores(response.stores);
        setTotalItems(response.total);
      }
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      showToast({
        title: tCommon("error"),
        description: t("fetchError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, tCommon]);

  const handleToggleStatus = async (store: Store) => {
    try {
      await toggleStoreStatus(store.id);
      showToast({
        title: tCommon("success"),
        description: t("statusUpdateSuccess"),
      });
      fetchStores(currentPage);
    } catch (error) {
      console.error("Failed to toggle store status:", error);
      showToast({
        title: tCommon("error"),
        description: t("statusUpdateError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!storeToDelete) return;

    setIsDeleting(true);
    try {
      await deleteStore(storeToDelete.id);
      showToast({
        title: tCommon("success"),
        description: t("deleteSuccess"),
      });
      fetchStores(currentPage);
    } catch (error) {
      console.error("Failed to delete store:", error);
      showToast({
        title: tCommon("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setStoreToDelete(null);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const columns: DataTableColumn<Store>[] = [
    {
      key: "logoUrl",
      label: t("columns.logo"),
      render: (store) => (
        <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {store.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={store.name}
              width={48}
              height={48}
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-xs text-gray-400">{t("noImage")}</span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: t("columns.name"),
      sortable: true,
      render: (store) => (
        <div>
          <p className="font-medium">{store.name}</p>
          {store.email && (
            <p className="text-xs text-muted-foreground">{store.email}</p>
          )}
        </div>
      ),
    },
    {
      key: "city",
      label: t("columns.city"),
      render: (store) => (
        <span className="text-sm">{store.city || "—"}</span>
      ),
    },
    {
      key: "status",
      label: t("columns.status"),
      render: (store) => <StatusBadge status={store.status} />,
    },
    {
      key: "actions",
      label: t("columns.actions"),
      className: "w-[200px]",
      render: (store) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(store)}
            title={store.status === "verified" ? t("toggleDeactivate") : t("toggleActivate")}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Link href={`/${locale}/admin/stores/${store.id}`}>
            <Button variant="ghost" size="sm" title={t("view")}>
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/${locale}/admin/stores/${store.id}/edit`}>
            <Button variant="ghost" size="sm" title={t("edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStoreToDelete(store);
              setDeleteDialogOpen(true);
            }}
            title={t("delete")}
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
      key: "city",
      label: t("filterByCity"),
      options: CITIES,
    },
    {
      key: "status",
      label: t("filterByStatus"),
      options: STATUS_OPTIONS,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Link href={`/${locale}/admin/stores/new`}>
          <Button>
            <Plus className="h-4 w-4 me-2" />
            {t("addNew")}
          </Button>
        </Link>
      </div>

      <DataTable
        data={stores}
        columns={columns}
        searchKey="name"
        searchPlaceholder={t("search")}
        filters={filters}
        pagination={true}
        pageSize={10}
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={fetchStores}
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
