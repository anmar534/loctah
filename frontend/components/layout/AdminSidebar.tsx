"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  FolderTree,
  Package,
  Tag,
  Users,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react";

const sidebarItems = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    key: "stores",
    icon: Store,
    href: "/admin/stores",
  },
  {
    key: "categories",
    icon: FolderTree,
    href: "/admin/categories",
  },
  {
    key: "products",
    icon: Package,
    href: "/admin/products",
  },
  {
    key: "offers",
    icon: Tag,
    href: "/admin/offers",
  },
  {
    key: "users",
    icon: Users,
    href: "/admin/users",
  },
  {
    key: "settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const t = useTranslations("admin.sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l border-border bg-card h-full overflow-y-auto">
      <div className="p-4">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const fullHref = `/${locale}${item.href}`;
            const isActive =
              pathname === fullHref ||
              (item.href !== "/admin" && pathname.startsWith(fullHref));

            return (
              <Link
                key={item.key}
                href={fullHref}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{t(item.key)}</span>
                {isActive && (
                  <ChevronLeft className="w-4 h-4 shrink-0 rtl:rotate-180" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
