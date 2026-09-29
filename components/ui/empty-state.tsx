"use client";

import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Inbox,
  FileX,
  SearchX,
  UserX,
  FolderOpen,
  BellOff,
  ClipboardX,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

// Preset empty states for common scenarios
const presetIcons: Record<string, LucideIcon> = {
  default: Inbox,
  file: FileX,
  search: SearchX,
  user: UserX,
  folder: FolderOpen,
  notification: BellOff,
  data: ClipboardX,
  error: AlertCircle,
};

export function EmptyState({
  icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const IconComponent = presetIcons[icon as unknown as string] || icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6",
        "text-center",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-16 h-16 rounded-full",
          "bg-[var(--surface-secondary)]",
          "flex items-center justify-center",
          "mb-6"
        )}
      >
        <IconComponent
          className="w-8 h-8 text-[var(--text-muted)]"
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[14px] text-[var(--text-secondary)] max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {action && (
          <Button
            variant={action.variant || "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="ghost"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Preset empty state components for common scenarios
export function NoDataState({
  title = "Belum ada data",
  description = "Data akan muncul di sini setelah ditambahkan.",
  onAction,
  actionLabel = "Tambah Data",
  className,
}: {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={Inbox}
      title={title}
      description={description}
      action={
        onAction
          ? { label: actionLabel, onClick: onAction }
          : undefined
      }
      className={className}
    />
  );
}

export function NoResultsState({
  searchQuery,
  onClear,
  className,
}: {
  searchQuery?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={SearchX}
      title={searchQuery ? `Tidak ditemukan "${searchQuery}"` : "Tidak ada hasil"}
      description={
        searchQuery
          ? "Coba gunakan kata kunci lain atau periksa ejaan."
          : "Tidak ada hasil yang cocok dengan filter Anda."
      }
      action={
        onClear
          ? { label: "Hapus Filter", onClick: onClear, variant: "ghost" }
          : undefined
      }
      className={className}
    />
  );
}

export function NoUsersState({
  onAddUser,
  className,
}: {
  onAddUser?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={UserX}
      title="Belum ada pengguna"
      description="Tambahkan pengguna pertama untuk memulai."
      action={
        onAddUser
          ? { label: "Tambah Pengguna", onClick: onAddUser }
          : undefined
      }
      className={className}
    />
  );
}

export function NoFilesState({
  onUpload,
  className,
}: {
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="Tidak ada file"
      description="Unggah file untuk melihatnya di sini."
      action={
        onUpload
          ? { label: "Unggah File", onClick: onUpload }
          : undefined
      }
      className={className}
    />
  );
}

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        onRetry
          ? { label: "Coba Lagi", onClick: onRetry, variant: "primary" }
          : undefined
      }
      className={className}
    />
  );
}
