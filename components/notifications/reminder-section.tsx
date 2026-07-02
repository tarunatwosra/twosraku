"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Plus,
  Check,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  FileText,
  ClipboardCheck,
  BarChart3,
  Users,
  Bell,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Reminder,
  EventSource,
  priorityConfig,
} from "@/lib/types/notifications";

// Sample data
const sampleReminders: Reminder[] = [
  {
    id: "1",
    title: "Deadline Upload Nilai Matematika",
    description: "Matematika XI IPS 1 - Batas upload nilai semester genap",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    module: "assessment",
    referenceId: "ASM-001",
    isCompleted: false,
    reminderType: "assessment_deadline",
    notifications: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Presensi Harian Belum Diinput",
    description: "X IPA 1 - Presensi hari ini belum diinput",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    module: "attendance",
    isCompleted: false,
    reminderType: "attendance_missing",
    notifications: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Jadwal Latihan TIM Voli",
    description: "Latihan rutinTIM Voli hari ini pukul 15.00",
    dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
    module: "special_unit",
    referenceId: "SU-001",
    isCompleted: false,
    reminderType: "training_schedule",
    notifications: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Rapat Evaluasi Tengah Semester",
    description: "Rapat evaluasi UTS dengan seluruh guru",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    module: "system",
    isCompleted: false,
    reminderType: "academic_calendar",
    notifications: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Laporan Bulanan",
    description: "Laporan bulanan Juni 2026 perlu diverifikasi",
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    module: "report",
    isCompleted: true,
    reminderType: "report_schedule",
    notifications: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Input Poin Karakter Siswa",
    description: "3 siswa memiliki poin karakter yang perlu diinput",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    module: "character",
    isCompleted: true,
    reminderType: "assignment_due",
    notifications: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const moduleIcons: Record<string, typeof Bell> = {
  attendance: ClipboardCheck,
  assessment: BarChart3,
  character: Users,
  special_unit: Users,
  training: Users,
  report: FileText,
  import_export: FileText,
  auth: Bell,
  system: AlertCircle,
  custom: Clock,
};

const reminderTypeLabels: Record<string, string> = {
  assessment_deadline: "Deadline Nilai",
  attendance_missing: "Presensi Hilang",
  training_schedule: "Jadwal Latihan",
  assignment_due: "Tugas",
  report_schedule: "Jadwal Laporan",
  academic_calendar: "Kalender Akademik",
  custom: "Kustom",
};

function formatDueDate(date: Date): {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  const diffHours = Math.floor((date.getTime() - now.getTime()) / (60 * 60 * 1000));

  let text = "";
  let isOverdue = false;
  let isToday = false;
  let isTomorrow = false;

  if (diffDays < 0) {
    isOverdue = true;
    text = `${Math.abs(diffDays)} hari yang lalu`;
  } else if (diffDays === 0) {
    isToday = true;
    if (diffHours > 0) {
      text = `Hari ini pukul ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffHours > -1) {
      text = "Kurang dari 1 jam";
    } else {
      text = "Lewat 1 jam";
      isOverdue = true;
    }
  } else if (diffDays === 1) {
    isTomorrow = true;
    text = `Besok pukul ${date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays < 7) {
    text = `${diffDays} hari lagi`;
  } else {
    text = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }

  return { text, isOverdue, isToday, isTomorrow };
}

interface ReminderSectionProps {
  searchQuery?: string;
}

export function ReminderSection({ searchQuery = "" }: ReminderSectionProps) {
  const [reminders, setReminders] = useState(sampleReminders);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter reminders
  const filteredReminders = useMemo(() => {
    let filtered = [...reminders];

    // Status filter
    if (filter === "pending") {
      filtered = filtered.filter((r) => !r.isCompleted);
    } else if (filter === "completed") {
      filtered = filtered.filter((r) => r.isCompleted);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );
    }

    // Sort: overdue first, then by due date
    filtered.sort((a, b) => {
      // Completed at bottom
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Then by due date
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

    return filtered;
  }, [reminders, searchQuery, filter]);

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;
  const completedCount = reminders.filter((r) => r.isCompleted).length;
  const overdueCount = reminders.filter(
    (r) => !r.isCompleted && r.dueDate < new Date()
  ).length;

  const handleToggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
      )
    );
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    setReminders((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) ? { ...r, isCompleted: true } : r
      )
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setReminders((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
  };

  const getStatusBadge = (reminder: Reminder) => {
    const dueInfo = formatDueDate(reminder.dueDate);

    if (reminder.isCompleted) {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Selesai
        </Badge>
      );
    }

    if (dueInfo.isOverdue) {
      return (
        <Badge variant="danger" size="sm">
          <AlertCircle className="w-3 h-3 mr-1" />
          Terlambat
        </Badge>
      );
    }

    if (dueInfo.isToday) {
      return (
        <Badge variant="warning" size="sm">
          <Clock className="w-3 h-3 mr-1" />
          Hari Ini
        </Badge>
      );
    }

    if (dueInfo.isTomorrow) {
      return (
        <Badge variant="info" size="sm">
          <Clock className="w-3 h-3 mr-1" />
          Besok
        </Badge>
      );
    }

    return (
      <Badge variant="neutral" size="sm">
        <Calendar className="w-3 h-3 mr-1" />
        {dueInfo.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-[24px]">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Total</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {reminders.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--warning-soft)] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Tertunda</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {pendingCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--danger-soft)] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Terlambat</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {overdueCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--success-soft)] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Selesai</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {completedCount}
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
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                filter === "all"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Semua ({reminders.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                filter === "pending"
                  ? "bg-[var(--warning)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Tertunda ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium transition-all",
                filter === "completed"
                  ? "bg-[var(--success)] text-white"
                  : "bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-active)]"
              )}
            >
              Selesai ({completedCount})
            </button>
          </div>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Tambah Pengingat
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="p-4 border-l-4 border-l-[var(--primary)]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              {selectedIds.length} pengingat dipilih
            </span>
            <div className="flex items-center gap-2">
              <Button variant="success" size="sm" onClick={handleBulkComplete}>
                <Check className="w-4 h-4" />
                Tandai Selesai
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
            Tidak ada pengingat
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {searchQuery
              ? "Tidak ada pengingat yang cocok dengan pencarian"
              : filter === "completed"
              ? "Belum ada pengingat yang selesai"
              : "Tambahkan pengingat baru untuk memulai"}
          </p>
        </Card>
      ) : (
        <div className="space-y-[12px]">
          {filteredReminders.map((reminder) => {
            const ModuleIcon = moduleIcons[reminder.module] || Bell;
            const dueInfo = formatDueDate(reminder.dueDate);
            const isSelected = selectedIds.includes(reminder.id);

            return (
              <Card
                key={reminder.id}
                className={cn(
                  "p-5 transition-all duration-200 hover:shadow-md",
                  reminder.isCompleted && "opacity-70",
                  dueInfo.isOverdue && !reminder.isCompleted && "border-l-4 border-l-[var(--danger)]",
                  isSelected && "ring-2 ring-[var(--primary)]"
                )}
              >
                <div className="flex items-start gap-[16px]">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleSelect(reminder.id)}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-colors",
                      isSelected
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-[var(--border-default)] hover:border-[var(--primary)]"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Complete Toggle */}
                  <button
                    onClick={() => handleToggleComplete(reminder.id)}
                    className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all",
                      reminder.isCompleted
                        ? "bg-[var(--success)] text-white"
                        : "bg-[var(--surface-hover)] text-[var(--text-muted)] hover:bg-[var(--success-soft)] hover:text-[var(--success)]"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0",
                      reminder.isCompleted
                        ? "bg-[var(--success-soft)]"
                        : dueInfo.isOverdue
                        ? "bg-[var(--danger-soft)]"
                        : "bg-[var(--primary-soft)]"
                    )}
                  >
                    <ModuleIcon
                      className={cn(
                        "w-6 h-6",
                        reminder.isCompleted
                          ? "text-[var(--success)]"
                          : dueInfo.isOverdue
                          ? "text-[var(--danger)]"
                          : "text-[var(--primary)]"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={cn(
                              "text-[15px] font-semibold",
                              reminder.isCompleted
                                ? "text-[var(--text-muted)] line-through"
                                : "text-[var(--text-primary)]"
                            )}
                          >
                            {reminder.title}
                          </h4>
                          {getStatusBadge(reminder)}
                        </div>
                        <p className="text-[14px] text-[var(--text-secondary)]">
                          {reminder.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {reminder.referenceId && (
                          <Badge variant="outline" size="sm">
                            {reminder.referenceId}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                          onClick={() => handleDelete(reminder.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 flex-wrap mt-3 pt-3 border-t border-[var(--border-light)]">
                      {/* Type Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[999px] bg-[var(--surface-hover)] text-[12px] text-[var(--text-secondary)]">
                        <Clock className="w-3.5 h-3.5" />
                        {reminderTypeLabels[reminder.reminderType]}
                      </span>

                      {/* Module */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[999px] bg-[var(--surface-hover)] text-[12px] text-[var(--text-muted)]">
                        <ModuleIcon className="w-3.5 h-3.5" />
                        {reminder.module.replace("_", " ")}
                      </span>

                      {/* Due Date */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[12px]",
                          dueInfo.isOverdue && !reminder.isCompleted
                            ? "text-[var(--danger)]"
                            : dueInfo.isToday
                            ? "text-[var(--warning)]"
                            : "text-[var(--text-muted)]"
                        )}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {dueInfo.text}
                      </span>
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
