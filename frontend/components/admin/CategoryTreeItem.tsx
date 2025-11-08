"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, Folder, FolderOpen, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface CategoryTreeItemProps {
  category: Category & { children?: Category[] };
  level?: number;
  onDelete: (id: string) => void;
}

export default function CategoryTreeItem({
  category,
  level = 0,
  onDelete,
}: CategoryTreeItemProps) {
  const t = useTranslations("admin.categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md group"
        style={{ paddingRight: `${level * 1.5}rem` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 hover:bg-gray-200 rounded ${
            !hasChildren && "invisible"
          }`}
          disabled={!hasChildren}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Folder Icon */}
        <div className="flex-shrink-0">
          {isExpanded && hasChildren ? (
            <FolderOpen className="h-5 w-5 text-yellow-500" />
          ) : (
            <Folder className="h-5 w-5 text-yellow-500" />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {category.name}
            </span>
            {category.productCount !== undefined && (
              <span className="text-xs text-gray-500">
                ({category.productCount} {t("productsCount")})
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-xs text-gray-500 truncate">
              {category.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/${locale}/admin/categories/${category.id}/edit`}>
            <Button variant="ghost" size="sm" title={tCommon("edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            title={tCommon("delete")}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Link href={`/${locale}/admin/categories/create?parentId=${category.id}`}>
            <Button variant="ghost" size="sm" title={t("addSub")}>
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
