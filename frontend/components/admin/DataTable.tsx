"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Discriminated union for type-safe columns
export type DataTableColumn<T> =
  | {
      // Data-bound column with type-safe key
      key: keyof T;
      label: string;
      sortable?: boolean;
      render?: (item: T) => React.ReactNode;
      className?: string;
    }
  | {
      // Render-only column with flexible key
      key: string;
      label: string;
      sortable?: boolean;
      render: (item: T) => React.ReactNode; // render is required for this variant
      className?: string;
    };

export interface DataTableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchKey?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DataTableFilter[];
  onSearch?: (value: string) => void;
  onFilter?: (key: string, value: string) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  pagination?: boolean;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "بحث...",
  searchValue: externalSearchValue,
  onSearchChange: externalOnSearchChange,
  filters,
  onSearch,
  onFilter,
  onSort,
  pagination = false,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  emptyMessage = "لا توجد بيانات",
  className,
}: DataTableProps<T>) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const searchValue = externalSearchValue ?? internalSearchValue;
  const setSearchValue = externalOnSearchChange ?? setInternalSearchValue;
  
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Local page state fallback for pagination
  const [activePage, setActivePage] = useState(currentPage ?? 1);

  // Sync activePage when currentPage prop changes
  useEffect(() => {
    setActivePage(currentPage ?? 1);
  }, [currentPage]);

  // Compute totalPages from totalItems or data length
  const dataTotal = totalItems ?? data.length;
  const computedTotalPages = Math.ceil(dataTotal / pageSize);

  // Handle page changes with fallback
  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange?.(page);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleFilter = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    onFilter?.(key, value);
  };

  const handleSort = (key: string) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  // Local filtering and sorting if no callbacks provided
  let processedData = [...data];

  if (!onSearch && searchValue && searchKey) {
    processedData = processedData.filter((item) => {
      const value = (item as any)[searchKey];
      return String(value).toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  if (!onFilter && Object.keys(filterValues).length > 0) {
    processedData = processedData.filter((item) => {
      return Object.entries(filterValues).every(([key, value]) => {
        if (!value || value === "all") return true;
        return (item as any)[key] === value;
      });
    });
  }

  if (!onSort && sortConfig) {
    processedData.sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      // Normalize null/undefined to sort consistently (always at the end)
      const aIsNullish = aValue === null || aValue === undefined;
      const bIsNullish = bValue === null || bValue === undefined;

      if (aIsNullish && bIsNullish) return 0;
      if (aIsNullish) return 1; // null/undefined always sorts to the end
      if (bIsNullish) return -1;

      // Type-aware comparison
      let result = 0;
      
      // Check if both are finite numbers
      if (typeof aValue === "number" && typeof bValue === "number" && 
          isFinite(aValue) && isFinite(bValue)) {
        // Numeric comparison
        result = aValue - bValue;
      } else {
        // String comparison with locale support
        const aStr = String(aValue);
        const bStr = String(bValue);
        result = aStr.localeCompare(bStr, undefined, { 
          sensitivity: "base", // Case-insensitive
          numeric: true // Natural sort for strings with numbers
        });
      }

      // Adjust by sort direction
      return sortConfig.direction === "asc" ? result : -result;
    });
  }

  // Local pagination if no callbacks provided
  const total = totalItems ?? processedData.length;
  const totalPages = computedTotalPages || Math.ceil(total / pageSize);

  if (!onPageChange && pagination) {
    const startIndex = (currentPage - 1) * pageSize;
    processedData = processedData.slice(startIndex, startIndex + pageSize);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {(searchKey || filters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {searchKey && (
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pe-10"
              />
            </div>
          )}
          {filters?.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || "all"}
              onValueChange={(value) => handleFilter(filter.key, value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.sortable && "cursor-pointer select-none hover:bg-muted/50",
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === String(column.key) && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.className}>
                      {column.render
                        ? column.render(item)
                        : String((item as any)[column.key] || "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            عرض {((activePage - 1) * pageSize) + 1} إلى{" "}
            {Math.min(activePage * pageSize, total)} من {total} نتيجة
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (activePage <= 3) {
                  pageNum = i + 1;
                } else if (activePage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = activePage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={activePage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
