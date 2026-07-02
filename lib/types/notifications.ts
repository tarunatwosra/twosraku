// Notification Types based on notifications.md specification

export type NotificationType =
  | "information"
  | "success"
  | "warning"
  | "error"
  | "reminder"
  | "announcement"
  | "task"
  | "approval"
  | "system";

export type NotificationPriority = "low" | "normal" | "high" | "critical";

export type NotificationStatus = "unread" | "read" | "archived";

export type NotificationChannel = "in_app" | "email" | "push" | "sms" | "whatsapp" | "webhook";

export type DeliveryStatus = "pending" | "processing" | "delivered" | "failed" | "cancelled" | "retry";

// Event Sources
export type EventSource =
  | "attendance"
  | "assessment"
  | "character"
  | "special_unit"
  | "training"
  | "report"
  | "import_export"
  | "auth"
  | "system"
  | "custom";

// Audience for Announcements
export type AnnouncementAudience =
  | "all"
  | "administrators"
  | "teachers"
  | "homeroom_teachers"
  | "staff"
  | "special_unit_members"
  | "selected_roles"
  | "selected_users";

// Core Notification Interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  module?: EventSource;
  referenceId?: string;
  createdAt: Date;
  expiresAt?: Date;
  readAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// Announcement Interface
export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  priority: NotificationPriority;
  publishDate: Date;
  expirationDate?: Date;
  attachments?: string[];
  status: "draft" | "published" | "archived";
  isPinned: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reminder Interface
export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  module: EventSource;
  referenceId?: string;
  isCompleted: boolean;
  reminderType: "assessment_deadline" | "attendance_missing" | "training_schedule" | "assignment_due" | "report_schedule" | "academic_calendar" | "custom";
  notifications: Notification[];
  createdAt: Date;
}

// Notification Preferences Interface
export interface NotificationPreferences {
  userId: string;
  enableNotifications: boolean;
  emailNotifications: boolean;
  reminderNotifications: boolean;
  systemAlerts: boolean;
  assessmentNotifications: boolean;
  attendanceNotifications: boolean;
  characterNotifications: boolean;
  specialUnitNotifications: boolean;
  reportNotifications: boolean;
  channels: NotificationChannel[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  updatedAt: Date;
}

// Delivery Queue Interface
export interface DeliveryQueueItem {
  id: string;
  notificationId: string;
  recipientId: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

// Notification History Interface
export interface NotificationHistoryItem {
  id: string;
  recipientId: string;
  notification: Notification;
  module: EventSource;
  status: DeliveryStatus;
  deliveredAt?: Date;
  readAt?: Date;
  channel: NotificationChannel;
  createdAt: Date;
}

// Notification Config for type-specific styling
export const notificationTypeConfig: Record<NotificationType, {
  icon: string;
  color: string;
  bgColor: string;
  label: string;
}> = {
  information: {
    icon: "info",
    color: "var(--info)",
    bgColor: "var(--info-soft)",
    label: "Informasi",
  },
  success: {
    icon: "check-circle",
    color: "var(--success)",
    bgColor: "var(--success-soft)",
    label: "Berhasil",
  },
  warning: {
    icon: "alert-triangle",
    color: "var(--warning)",
    bgColor: "var(--warning-soft)",
    label: "Peringatan",
  },
  error: {
    icon: "alert-circle",
    color: "var(--danger)",
    bgColor: "var(--danger-soft)",
    label: "Error",
  },
  reminder: {
    icon: "clock",
    color: "var(--warning)",
    bgColor: "var(--warning-soft)",
    label: "Pengingat",
  },
  announcement: {
    icon: "megaphone",
    color: "var(--primary)",
    bgColor: "var(--primary-soft)",
    label: "Pengumuman",
  },
  task: {
    icon: "clipboard-check",
    color: "var(--success)",
    bgColor: "var(--success-soft)",
    label: "Tugas",
  },
  approval: {
    icon: "file-check",
    color: "var(--primary)",
    bgColor: "var(--primary-soft)",
    label: "Persetujuan",
  },
  system: {
    icon: "settings",
    color: "var(--text-muted)",
    bgColor: "var(--surface-secondary)",
    label: "Sistem",
  },
};

export const priorityConfig: Record<NotificationPriority, {
  color: string;
  label: string;
}> = {
  low: {
    color: "var(--text-muted)",
    label: "Rendah",
  },
  normal: {
    color: "var(--info)",
    label: "Normal",
  },
  high: {
    color: "var(--warning)",
    label: "Tinggi",
  },
  critical: {
    color: "var(--danger)",
    label: "Kritis",
  },
};
