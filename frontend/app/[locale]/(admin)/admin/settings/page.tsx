"use client";

import { useTranslations } from "next-intl";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Globe, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  const t = useTranslations("admin.settings");

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("title")} 
        description={t("description")}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <CardTitle>{t("general.title")}</CardTitle>
            </div>
            <CardDescription>{t("general.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("comingSoon")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <CardTitle>{t("notifications.title")}</CardTitle>
            </div>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("comingSoon")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle>{t("security.title")}</CardTitle>
            </div>
            <CardDescription>{t("security.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("comingSoon")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <CardTitle>{t("email.title")}</CardTitle>
            </div>
            <CardDescription>{t("email.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("comingSoon")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
