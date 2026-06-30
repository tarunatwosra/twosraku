"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-[32px]">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "text-[13px] hover:text-[var(--primary)] transition-colors",
                    index === breadcrumbs.length - 1
                      ? "text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-muted)]"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "text-[13px]",
                    index === breadcrumbs.length - 1
                      ? "text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-muted)]"
                  )}
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--text-primary)] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
