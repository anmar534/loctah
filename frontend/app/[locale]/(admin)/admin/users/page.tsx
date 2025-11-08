"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import PageHeader from "@/components/admin/PageHeader";
import LoadingTable from "@/components/admin/LoadingTable";
import EmptyState from "@/components/admin/EmptyState";
import { listUsers, toggleUserStatus } from "@/lib/api/admin";
import { showToast } from "@/components/ui/toast";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Users, Power, Mail, Shield, Calendar } from "lucide-react";
import type { User, UserRole } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { page, limit: 20 };

      if (roleFilter !== "all") {
        params.role = roleFilter;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const data = await listUsers(params);
      if (data) {
        setUsers(data.users || []);

        // Calculate total pages from total and limit
        const total = data.total || 0;
        const limit = data.limit || 20;
        setTotalPages(Math.ceil(total / limit));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, roleFilter, statusFilter]);

  const handleToggleStatus = async (userId: string) => {
    setIsTogglingStatus(userId);
    try {
      await toggleUserStatus(userId);
      showToast({
        title: tCommon("success"),
        description: t("statusToggleSuccess"),
      });
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      showToast({
        title: tCommon("error"),
        description: t("statusToggleError"),
        variant: "destructive",
      });
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "vendor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "user",
      label: t("columns.user"),
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {user.avatarUrl ? (
              <NextImage
                src={user.avatarUrl}
                alt={user.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: t("columns.contact"),
      render: (user) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: t("columns.role"),
      render: (user) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
            user.role
          )}`}
        >
          <Shield className="h-3 w-3" />
          {t(`roles.${user.role.toLowerCase()}`)}
        </span>
      ),
    },
    {
      key: "status",
      label: t("columns.status"),
      render: (user) => (
        <StatusBadge status={user.status || "active"} />
      ),
    },
    {
      key: "createdAt",
      label: t("columns.joinedAt"),
      render: (user) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ar })}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("columns.actions"),
      render: (user) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleStatus(user.id)}
          disabled={isTogglingStatus === user.id}
          title={
            user.status === "active"
              ? t("disableUser")
              : t("enableUser")
          }
          className={
            user.status === "active"
              ? "text-orange-600 hover:text-orange-700"
              : "text-green-600 hover:text-green-700"
          }
        >
          <Power className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filteredUsers = users;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />
        <Card className="p-6">
          <LoadingTable />
        </Card>
      </div>
    );
  }

  if (!isLoading && users.length === 0 && roleFilter === "all" && statusFilter === "all") {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />
        <EmptyState
          icon={Users}
          title={t("emptyMessage")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("filterByRole")}:
            </label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allRoles")}</SelectItem>
                <SelectItem value="user">{t("roles.user")}</SelectItem>
                <SelectItem value="vendor">{t("roles.vendor")}</SelectItem>
                <SelectItem value="admin">{t("roles.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("filterByStatus")}:
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="active">{t("statuses.active")}</SelectItem>
                <SelectItem value="disabled">{t("statuses.disabled")}</SelectItem>
                <SelectItem value="pending">{t("statuses.pending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          searchPlaceholder={t("search")}
          pagination={true}
          currentPage={currentPage}
          totalItems={totalPages * 20}
          pageSize={20}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
