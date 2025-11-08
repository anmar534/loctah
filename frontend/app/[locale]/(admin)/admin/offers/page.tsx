"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import LoadingTable from "@/components/admin/LoadingTable";
import EmptyState from "@/components/admin/EmptyState";
import { listOffers, deleteOffer } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { getAdminRoutes } from "@/lib/constants/routes";
import { formatPrice, calculateDiscount } from "@/lib/utils/format";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Pencil, Trash2, ExternalLink, Tag } from "lucide-react";
import type { Offer } from "@/types";

export default function AdminOffersPage() {
  const router = useRouter();
  const t = useTranslations("admin.offers");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const ADMIN_ROUTES = getAdminRoutes(locale);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOffers = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await listOffers({ page });
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      showToast({
        title: tCommon("error"),
        description: t("fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    if (!selectedOffer) return;

    setIsDeleting(true);
    try {
      await deleteOffer(selectedOffer.id);
      showToast({
        title: tCommon("success"),
        description: t("deleteSuccess"),
      });
      fetchOffers(currentPage);
      setDeleteDialogOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error("Failed to delete offer:", error);
      showToast({
        title: tCommon("error"),
        description: t("deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (offer: Offer) => {
    setSelectedOffer(offer);
    setDeleteDialogOpen(true);
  };

  const columns: DataTableColumn<Offer>[] = [
    {
      key: "product",
      label: t("columns.product"),
      render: (offer) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded overflow-hidden">
            {offer.product?.image ? (
              <img
                src={offer.product.image}
                alt={offer.product.title || offer.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Tag className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{offer.product?.title || offer.title}</p>
            {offer.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {offer.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "store",
      label: t("columns.store"),
      render: (offer) => offer.store?.name || "-",
    },
    {
      key: "originalPrice",
      label: t("columns.originalPrice"),
      render: (offer) =>
        offer.originalPrice
          ? formatPrice(offer.originalPrice, offer.currency || "SAR")
          : "-",
    },
    {
      key: "discountedPrice",
      label: t("columns.discountedPrice"),
      render: (offer) =>
        offer.discountedPrice
          ? formatPrice(offer.discountedPrice, offer.currency || "SAR")
          : "-",
    },
    {
      key: "discount",
      label: t("columns.discount"),
      render: (offer) => {
        if (offer.discount) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              <Tag className="h-3 w-3" />
              {offer.discount}%
            </span>
          );
        }
        if (offer.originalPrice && offer.discountedPrice) {
          const discount = calculateDiscount(offer.originalPrice, offer.discountedPrice);
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              <Tag className="h-3 w-3" />
              {discount}%
            </span>
          );
        }
        return "-";
      },
    },
    {
      key: "validUntil",
      label: t("columns.validUntil"),
      render: (offer) =>
        offer.endDate
          ? format(new Date(offer.endDate), "dd/MM/yyyy", { locale: ar })
          : "-",
    },
    {
      key: "status",
      label: t("columns.status"),
      render: (offer) => {
        const isExpired = offer.endDate && new Date(offer.endDate) < new Date();
        const status = isExpired ? "inactive" : offer.active ? "active" : "inactive";
        return <StatusBadge status={status} />;
      },
    },
    {
      key: "actions",
      label: t("columns.actions"),
      render: (offer) => (
        <div className="flex items-center gap-2">
          {offer.link && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(offer.link, "_blank")}
              title={t("visitLink")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(ADMIN_ROUTES.offers.edit(offer.id))}
            title={t("edit")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(offer)}
            className="text-red-600 hover:text-red-700"
            title={t("delete")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.title?.toLowerCase().includes(query) ||
      offer.description?.toLowerCase().includes(query) ||
      offer.product?.title?.toLowerCase().includes(query) ||
      offer.store?.name?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
          action={{
            label: t("addNew"),
            href: ADMIN_ROUTES.offers.new,
          }}
        />
        <Card className="p-6">
          <LoadingTable />
        </Card>
      </div>
    );
  }

  if (!isLoading && offers.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
          action={{
            label: t("addNew"),
            href: ADMIN_ROUTES.offers.new,
          }}
        />
        <EmptyState
          icon={Tag}
          title={t("emptyMessage")}
          actionLabel={t("addNew")}
          actionHref={ADMIN_ROUTES.offers.new}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
          action={{
            label: t("addNew"),
            href: ADMIN_ROUTES.offers.new,
          }}
        />

        <Card className="p-6">
          <DataTable
            columns={columns}
            data={filteredOffers}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t("searchPlaceholder")}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("delete")}
        description={t("confirmDelete")}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
