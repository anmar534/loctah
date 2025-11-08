"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { Bell, Menu, User, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/authStore";
import { logout as logoutApi } from "@/lib/api/auth";
import { showToast } from "@/components/ui/toast";

type AdminHeaderProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
  notificationsCount?: number;
};

export default function AdminHeader({
  onMenuClick,
  isSidebarOpen,
  notificationsCount = 0,
}: AdminHeaderProps) {
  const t = useTranslations("admin.header");
  const router = useRouter();
  const { reset: resetAuth } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to invalidate session on server
      await logoutApi();
      
      // Clear auth state
      resetAuth();
      
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      // Show success message
      showToast({
        title: t("logout"),
        description: t("logoutSuccess"),
      });
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      showToast({
        title: "خطأ",
        description: t("logoutError"),
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 p-0"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen ? "true" : "false"}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-10 h-10 p-0">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notificationsCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="px-3 py-2 font-medium">{t("notifications")}</div>
            <div className="border-t" />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{t("newOffer")}</p>
                <p className="text-xs text-muted-foreground">{t("offerAdded")}</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 p-0">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="px-3 py-2 font-medium">{t("account")}</div>
            <div className="border-t" />
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center gap-2 w-full">
                <Eye className="h-4 w-4" />
                <span>{t("viewSite")}</span>
              </Link>
            </DropdownMenuItem>
            <div className="border-t" />
            <DropdownMenuItem 
              className="text-destructive"
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>{isLoggingOut ? t("loggingOut") : t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
