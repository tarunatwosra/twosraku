"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Card, Button, Input, Select, Badge, Avatar, Pagination } from "@/components/ui";
import { Search, Filter, Download, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListPageFilter {
  search?: string;
  [key: string]: string | undefined;
}

export interface ListPageColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

export interface ListPageAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "danger";
}

interface ListPageTemplateProps<T> {
  // Page info
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];

  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];

  // Filters
  filters?: {
    search?: {
      placeholder?: string;
      value: string;
      onChange: (value: string) => void;
    };
    selects?: {
      name: string;
      label: string;
      placeholder?: string;
      options: { value: string; label: string }[];
      value: string;
      onChange: (value: string) => void;
    }[];
  };

  // Data
  columns: ListPageColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };

  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };

  // Row actions
  rowActions?: ListPageAction<T>[];

  // Class name
  className?: string;
}

export function ListPageTemplate<T extends { id: string }>({
  title,
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  filters,
  columns,
  data,
  isLoading,
  emptyState,
  pagination,
  rowActions,
  className,
}: ListPageTemplateProps<T>) {
  const [showFilters, setShowFilters] = useState(false);

  // Calculate active filter count
  const activeFilterCount = filters?.selects?.filter(
    (f) => f.value !== ""
  ).length || 0;

  return (
    <div className={cn("flex flex-col gap-[24px]", className)}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          primaryAction && (
            <Button onClick={primaryAction.onClick}>
              <Plus className="w-4 h-4" />
              {primaryAction.label}
            </Button>
          )
        }
      />

      {/* Filter Card */}
      {(filters?.search || filters?.selects?.length) && (
        <Card className="p-0 overflow-hidden" padding="none">
          {/* Filter Header */}
          <div className="p-[20px] border-b border-[var(--border-light)]">
            <div className="flex items-center gap-[12px]">
              {/* Search Input */}
              {filters?.search && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder={filters.search.placeholder || "Cari..."}
                    value={filters.search.value}
                    onChange={(e) => filters.search?.onChange(e.target.value)}
                    className="w-full h-[44px] pl-11 pr-10 text-[14px] bg-[var(--surface-secondary)] border border-transparent rounded-[18px] focus:outline-none focus:border-[var(--border-focus)] focus:bg-white transition-all"
                  />
                  {filters.search.value && (
                    <button
                      onClick={() => filters.search?.onChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Toggle Filters */}
              {filters?.selects?.length && (
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Secondary Actions */}
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.onClick}
                >
                  {action.icon && <span className="w-4 h-4 mr-1">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Expanded Filters */}
            {showFilters && filters?.selects?.length && (
              <div className="mt-[16px] pt-[16px] border-t border-[var(--border-light)] grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                {filters.selects.map((select) => (
                  <Select
                    key={select.name}
                    label={select.label}
                    placeholder={select.placeholder}
                    value={select.value}
                    onChange={(e) => select.onChange(e.target.value)}
                    options={[
                      { value: "", label: select.placeholder || "Semua" },
                      ...select.options,
                    ]}
                  />
                ))}
              </div>
            )}

            {/* Active Filter Pills */}
            {!showFilters && activeFilterCount > 0 && filters?.selects && (
              <div className="mt-[16px] flex flex-wrap items-center gap-[8px]">
                <span className="text-[13px] text-[var(--text-muted)]">Filter aktif:</span>
                {filters.selects
                  .filter((f) => f.value !== "")
                  .map((select) => (
                    <Badge
                      key={select.name}
                      variant="primary"
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => select.onChange("")}
                    >
                      {select.options.find((o) => o.value === select.value)?.label || select.value}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-light)]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]"
                      style={{ width: col.width }}
                    >
                      {col.header}
                    </th>
                  ))}
                  {rowActions && rowActions.length > 0 && (
                    <th className="text-right px-[20px] py-[16px] text-[13px] font-semibold text-[var(--text-secondary)]">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--border-light)]"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-[20px] py-[16px]">
                          <div className="w-full h-4 bg-[var(--surface-hover)] rounded animate-pulse" />
                        </td>
                      ))}
                      {rowActions && (
                        <td className="px-[20px] py-[16px]">
                          <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-lg animate-pulse ml-auto" />
                        </td>
                      )}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  // Empty state
                  <tr>
                    <td
                      colSpan={columns.length + (rowActions ? 1 : 0)}
                      className="px-[20px] py-[48px] text-center"
                    >
                      <div className="flex flex-col items-center gap-[12px]">
                        <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                          <Search className="w-8 h-8 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-[15px] font-medium text-[var(--text-primary)]">
                            {emptyState?.title || "Tidak ada data"}
                          </p>
                          {emptyState?.description && (
                            <p className="text-[13px] text-[var(--text-muted)] mt-1">
                              {emptyState.description}
                            </p>
                          )}
                        </div>
                        {emptyState?.action && (
                          <Button
                            variant="outline"
                            onClick={emptyState.action.onClick}
                          >
                            {emptyState.action.label}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-[20px] py-[16px] text-[14px] text-[var(--text-primary)]"
                        >
                          {col.render(item)}
                        </td>
                      ))}
                      {rowActions && rowActions.length > 0 && (
                        <td className="px-[20px] py-[16px]">
                          <div className="flex items-center justify-end gap-[4px]">
                            {rowActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={cn(
                                  "w-8 h-8 rounded-[12px] flex items-center justify-center transition-colors",
                                  action.variant === "danger"
                                    ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                                )}
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && data.length > 0 && (
            <div className="px-[20px] border-t border-[var(--border-light)]">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={pagination.onPageChange}
                onPageSizeChange={pagination.onPageSizeChange}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
