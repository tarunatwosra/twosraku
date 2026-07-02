"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Bell, Megaphone, Settings, Clock, History, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationList } from "@/components/notifications/notification-list";
import { AnnouncementSection } from "@/components/notifications/announcement-section";
import { NotificationPreferences } from "@/components/notifications/notification-preferences";
import { ReminderSection } from "@/components/notifications/reminder-section";
import { NotificationHistory } from "@/components/notifications/notification-history";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TabType = "notifications" | "announcements" | "reminders" | "history" | "preferences";

interface TabConfig {
  id: TabType;
  label: string;
  icon: typeof Bell;
  badge?: number;
}

const tabs: TabConfig[] = [
  { id: "notifications", label: "Notifikasi", icon: Bell, badge: 3 },
  { id: "announcements", label: "Pengumuman", icon: Megaphone, badge: 2 },
  { id: "reminders", label: "Pengingat", icon: Clock },
  { id: "history", label: "Riwayat", icon: History },
  { id: "preferences", label: "Preferensi", icon: Settings },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("notifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  return (
    <div className="p-[40px] min-h-screen">
      {/* Page Header */}
      <div className="mb-[32px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-[20px] bg-[var(--primary-soft)] flex items-center justify-center">
            <Bell className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-[var(--text-primary)] leading-tight">
              Notifikasi
            </h1>
            <p className="text-[14px] text-[var(--text-muted)]">
              Kelola notifikasi, pengumuman, dan pengingat
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-[8px] mb-[24px] overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "bg-[var(--surface-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span
                  className={cn(
                    "w-5 h-5 text-[11px] font-bold rounded-full flex items-center justify-center",
                    isActive
                      ? "bg-white text-[var(--primary)]"
                      : "bg-[var(--danger)] text-white"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card className="p-5 mb-[24px]">
        <div className="flex items-center gap-[16px] flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cari notifikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-[12px]">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="h-[48px] px-4 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-[18px] text-[15px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
            >
              <option value="all">Semua</option>
              <option value="unread">Belum dibaca</option>
              <option value="read">Sudah dibaca</option>
              <option value="high">Prioritas Tinggi</option>
              <option value="medium">Prioritas Sedang</option>
              <option value="low">Prioritas Rendah</option>
            </select>
            <Button variant="outline" size="md">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "notifications" && (
          <NotificationList searchQuery={searchQuery} filter={selectedFilter} />
        )}
        {activeTab === "announcements" && (
          <AnnouncementSection searchQuery={searchQuery} />
        )}
        {activeTab === "reminders" && (
          <ReminderSection searchQuery={searchQuery} />
        )}
        {activeTab === "history" && (
          <NotificationHistory searchQuery={searchQuery} />
        )}
        {activeTab === "preferences" && (
          <NotificationPreferences />
        )}
      </div>
    </div>
  );
}
