"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton loader component
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--surface-hover)] rounded-[var(--radius-lg)]",
        className
      )}
    />
  );
}

/**
 * KPI Card skeleton loader
 */
export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-[28px] p-[28px] shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-12 h-12 rounded-[18px]" />
          <Skeleton className="w-20 h-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[28px] p-[28px] shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-8 rounded-[12px]" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--border-light)]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table skeleton loader
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-[28px] p-[28px] shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64 rounded-[18px]" />
        </div>
        {/* Table */}
        <div className="border border-[var(--border-light)] rounded-[18px] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--surface-secondary)]">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <TableRowSkeleton key={i} columns={columns} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10 rounded-[18px] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

/**
 * Chart skeleton loader
 */
export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-[28px] p-[28px] shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-64 w-full rounded-[18px]" />
      </div>
    </div>
  );
}

/**
 * Widget skeleton loader
 */
export function WidgetSkeleton() {
  return (
    <div className="bg-white rounded-[28px] p-[28px] shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard row skeleton
 */
export function DashboardRowSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
      {Array.from({ length: cards }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}
