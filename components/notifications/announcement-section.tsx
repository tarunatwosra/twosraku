"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Pin,
  PinOff,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  ChevronRight,
  AlertCircle,
  Info,
  Clock,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Announcement,
  AnnouncementAudience,
  priorityConfig,
} from "@/lib/types/notifications";

// Sample data
const sampleAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Jadwal Ujian Tengah Semester",
    content: "UTS akan dimulai pada tanggal 3 Juli 2026. Harap persiapkan diri dengan baik. Siswa diharapkan membawa alat tulis dan kartu pelajar.",
    audience: "all",
    priority: "high",
    publishDate: new Date("2026-07-01"),
    status: "published",
    isPinned: true,
    createdBy: "Admin",
    createdAt: new Date("2026-07-01"),
    updatedAt: new Date("2026-07-01"),
  },
  {
    id: "2",
    title: "Pendaftaran Ekskul Baru",
    content: "Pendaftaran kegiatan ekstrakurikuler semester baru dibuka hingga 15 Juli. pilih kegiatan yang sesuai minat dan bakat Anda.",
    audience: "teachers",
    priority: "normal",
    publishDate: new Date("2026-06-28"),
    status: "published",
    isPinned: false,
    createdBy: "Admin",
    createdAt: new Date("2026-06-28"),
    updatedAt: new Date("2026-06-28"),
  },
  {
    id: "3",
    title: "Perubahan Jam Masuk",
    content: "Tanggal 5 Juli berlaku jam masuk siang karena kegiatan sekolah. Jam masuk调整为 09.00 pagi.",
    audience: "all",
    priority: "normal",
    publishDate: new Date("2026-06-25"),
    status: "published",
    isPinned: false,
    createdBy: "Admin",
    createdAt: new Date("2026-06-25"),
    updatedAt: new Date("2026-06-25"),
  },
  {
    id: "4",
    title: "Undangan Rapat Orang Tua",
    content: "Rapat orang tua/wali akan diadakan pada tanggal 20 Juli 2026 pukul 08.00 di aula sekolah.",
    audience: "homeroom_teachers",
    priority: "low",
    publishDate: new Date("2026-06-20"),
    status: "published",
    isPinned: false,
    createdBy: "Admin",
    createdAt: new Date("2026-06-20"),
    updatedAt: new Date("2026-06-20"),
  },
  {
    id: "5",
    title: "Draft: Evaluasi Tengah Semester",
    content: "Rancangan evaluasi tengah semester sedang dalam proses review.",
    audience: "teachers",
    priority: "normal",
    publishDate: new Date("2026-07-02"),
    status: "draft",
    isPinned: false,
    createdBy: "Admin",
    createdAt: new Date("2026-07-02"),
    updatedAt: new Date("2026-07-02"),
  },
];

const audienceLabels: Record<AnnouncementAudience, string> = {
  all: "Semua Pengguna",
  administrators: "Administrator",
  teachers: "Guru",
  homeroom_teachers: "Wali Kelas",
  staff: "Staff",
  special_unit_members: "Anggota Pasukan Khusus",
  selected_roles: "Peran Tertentu",
  selected_users: "Pengguna Tertentu",
};

const audienceIcons: Record<AnnouncementAudience, typeof Users> = {
  all: Users,
  administrators: Users,
  teachers: Users,
  homeroom_teachers: Users,
  staff: Users,
  special_unit_members: Users,
  selected_roles: Users,
  selected_users: Users,
};

function formatDate(dateString: Date): string {
  return dateString.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateString: Date): string {
  return dateString.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

interface AnnouncementSectionProps {
  searchQuery?: string;
}

export function AnnouncementSection({ searchQuery = "" }: AnnouncementSectionProps) {
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "published" | "draft">("all");

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    // View mode filter
    if (viewMode === "published") {
      filtered = filtered.filter((a) => a.status === "published");
    } else if (viewMode === "draft") {
      filtered = filtered.filter((a) => a.status === "draft");
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.publishDate.getTime() - a.publishDate.getTime();
    });

    return filtered;
  }, [announcements, searchQuery, viewMode]);

  const pinnedCount = announcements.filter((a) => a.isPinned).length;
  const publishedCount = announcements.filter((a) => a.status === "published").length;
  const draftCount = announcements.filter((a) => a.status === "draft").length;

  const handleTogglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
  };

  const handleBulkPublish = () => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        selectedIds.includes(a.id)
          ? { ...a, status: "published" as const, publishDate: new Date() }
          : a
      )
    );
    setSelectedIds([]);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return AlertCircle;
      case "normal":
        return Info;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-[24px]">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Total</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {announcements.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--success-soft)] flex items-center justify-center">
              <Pin className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Disematkan</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {pinnedCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--info-soft)] flex items-center justify-center">
              <Eye className="w-5 h-5 text-[var(--info)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Dipublikasikan</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {publishedCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--warning-soft)] flex items-center justify-center">
              <Edit className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Draft</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {draftCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("all")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                viewMode === "all"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Semua ({announcements.length})
            </button>
            <button
              onClick={() => setViewMode("published")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                viewMode === "published"
                  ? "bg-[var(--success)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Dipublikasikan ({publishedCount})
            </button>
            <button
              onClick={() => setViewMode("draft")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                viewMode === "draft"
                  ? "bg-[var(--warning)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Draft ({draftCount})
            </button>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Buat Pengumuman
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-l-4 border-l-[var(--primary)]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              {selectedIds.length} pengumuman dipilih
            </span>
            <div className="flex items-center gap-2">
              {viewMode === "draft" && (
                <Button variant="success" size="sm" onClick={handleBulkPublish}>
                  <Megaphone className="w-4 h-4" />
                  Publikasikan
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] mx-auto mb-4 flex items-center justify-center">
            <Megaphone className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
            Tidak ada pengumuman
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {searchQuery
              ? "Tidak ada pengumuman yang cocok dengan pencarian"
              : "Buat pengumuman baru untuk memulai"}
          </p>
        </Card>
      ) : (
        <div className="space-y-[16px]">
          {filteredAnnouncements.map((announcement) => {
            const priority = priorityConfig[announcement.priority];
            const PriorityIcon = getPriorityIcon(announcement.priority);
            const AudienceIcon = audienceIcons[announcement.audience];

            return (
              <Card
                key={announcement.id}
                className={cn(
                  "p-6 transition-all duration-200 hover:shadow-md",
                  announcement.isPinned && "border-l-4 border-l-[var(--primary)]"
                )}
              >
                <div className="flex items-start gap-[16px]">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleSelect(announcement.id)}
                    className={cn(
                      "w-5 h-5 rounded-[8px] border-2 flex-shrink-0 mt-1 transition-colors",
                      selectedIds.includes(announcement.id)
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-[var(--border-default)] hover:border-[var(--primary)]"
                    )}
                  >
                    {selectedIds.includes(announcement.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Pin Badge */}
                  {announcement.isPinned && (
                    <div className="absolute left-4 top-4">
                      <Pin className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-[18px] bg-[var(--warning-soft)] flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-7 h-7 text-[var(--warning)]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.isPinned && (
                            <Pin className="w-4 h-4 text-[var(--primary)]" />
                          )}
                          <h4 className="text-[16px] font-bold text-[var(--text-primary)]">
                            {announcement.title}
                          </h4>
                          {announcement.status === "draft" && (
                            <Badge variant="warning" size="sm">
                              Draft
                            </Badge>
                          )}
                          {(announcement.priority === "high" || announcement.priority === "critical") && (
                            <Badge variant="danger" size="sm">
                              {priority.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[14px] text-[var(--text-secondary)] line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Audience */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[999px] bg-[var(--surface-hover)] text-[12px] text-[var(--text-secondary)]">
                        <AudienceIcon className="w-3.5 h-3.5" />
                        {audienceLabels[announcement.audience]}
                      </span>

                      {/* Date */}
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(announcement.publishDate)}
                      </span>

                      {/* Priority */}
                      <span className="inline-flex items-center gap-1.5 text-[12px]">
                        <PriorityIcon className="w-3.5 h-3.5" style={{ color: priority.color }} />
                        <span style={{ color: priority.color }}>{priority.label}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border-light)]">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                        Lihat
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePin(announcement.id)}
                      >
                        {announcement.isPinned ? (
                          <>
                            <PinOff className="w-4 h-4" />
                            Lepas Pin
                          </>
                        ) : (
                          <>
                            <Pin className="w-4 h-4" />
                            Sematkan
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
