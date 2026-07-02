"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  BellOff,
  Check,
  Clock,
  Shield,
  BarChart3,
  ClipboardCheck,
  Award,
  Megaphone,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  enabled: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: "enable_all",
    label: "Aktifkan Semua Notifikasi",
    description: "Aktifkan atau nonaktifkan semua notifikasi",
    icon: Bell,
    enabled: true,
    channels: { inApp: true, email: true, push: true, sms: false },
  },
  {
    id: "email_notifications",
    label: "Notifikasi Email",
    description: "Terima notifikasi melalui email",
    icon: Mail,
    enabled: true,
    channels: { inApp: false, email: true, push: false, sms: false },
  },
  {
    id: "reminder_notifications",
    label: "Pengingat",
    description: "Pengingat untuk tugas dan deadline",
    icon: Clock,
    enabled: true,
    channels: { inApp: true, email: true, push: true, sms: false },
  },
  {
    id: "system_alerts",
    label: "Peringatan Sistem",
    description: "Notifikasi maintenance dan update sistem",
    icon: Shield,
    enabled: true,
    channels: { inApp: true, email: false, push: false, sms: false },
  },
  {
    id: "assessment_notifications",
    label: "Notifikasi Penilaian",
    description: "Notifikasi terkait penilaian dan nilai siswa",
    icon: BarChart3,
    enabled: true,
    channels: { inApp: true, email: true, push: false, sms: false },
  },
  {
    id: "attendance_notifications",
    label: "Notifikasi Kehadiran",
    description: "Notifikasi terkait presensi dan kehadiran",
    icon: ClipboardCheck,
    enabled: true,
    channels: { inApp: true, email: false, push: true, sms: false },
  },
  {
    id: "character_notifications",
    label: "Notifikasi Poin Karakter",
    description: "Notifikasi terkait poin karakter dan perilaku",
    icon: Award,
    enabled: true,
    channels: { inApp: true, email: false, push: false, sms: false },
  },
  {
    id: "special_unit_notifications",
    label: "Notifikasi Pasukan Khusus",
    description: "Notifikasi terkait ekstrakurikuler dan pasukan khusus",
    icon: Shield,
    enabled: false,
    channels: { inApp: true, email: false, push: false, sms: false },
  },
  {
    id: "report_notifications",
    label: "Notifikasi Laporan",
    description: "Notifikasi ketika laporan tersedia",
    icon: Megaphone,
    enabled: true,
    channels: { inApp: true, email: true, push: false, sms: false },
  },
];

const channelOptions = [
  { id: "inApp", label: "In-App", icon: Bell, available: true },
  { id: "email", label: "Email", icon: Mail, available: false },
  { id: "push", label: "Push", icon: Smartphone, available: false },
  { id: "sms", label: "SMS", icon: MessageSquare, available: false },
];

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "07:00",
  });

  const handleTogglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleToggleChannel = (prefId: string, channel: keyof NotificationPreference["channels"]) => {
    setPreferences((prev) =>
      prev.map((p) => {
        if (p.id !== prefId) return p;
        const newChannels = { ...p.channels, [channel]: !p.channels[channel] };
        // Ensure at least one channel is enabled
        const hasAnyEnabled = Object.values(newChannels).some(Boolean);
        if (!hasAnyEnabled) return p;
        return { ...p, channels: newChannels };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const enabledCount = preferences.filter((p) => p.enabled && p.id !== "enable_all").length;

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1">
            Preferensi Notifikasi
          </h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            Kelola jenis notifikasi yang ingin Anda terima
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
        >
          {showSaved ? (
            <>
              <Check className="w-4 h-4" />
              Tersimpan!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--success-soft)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Aktif</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {enabledCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--danger-soft)] flex items-center justify-center">
              <BellOff className="w-5 h-5 text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Nonaktif</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {preferences.length - 1 - enabledCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] text-[var(--text-muted)]">Total</p>
              <p className="text-[20px] font-bold text-[var(--text-primary)]">
                {preferences.length - 1}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Master Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[var(--primary-soft)] flex items-center justify-center">
              <Bell className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Aktifkan Semua Notifikasi
              </h4>
              <p className="text-[13px] text-[var(--text-muted)]">
                Aktifkan atau nonaktifkan semua notifikasi sekaligus
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const allEnabled = preferences[0].enabled;
              setPreferences((prev) =>
                prev.map((p) => ({ ...p, enabled: !allEnabled }))
              );
            }}
            className={cn(
              "relative w-[52px] h-[28px] rounded-full transition-colors duration-200",
              preferences[0].enabled ? "bg-[var(--primary)]" : "bg-[var(--border-default)]"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-200",
                preferences[0].enabled ? "translate-x-[26px]" : "translate-x-[3px]"
              )}
            />
          </button>
        </div>
      </Card>

      {/* Individual Preferences */}
      <div className="space-y-[16px]">
        {preferences.slice(1).map((preference) => {
          const Icon = preference.icon;
          const isMasterEnabled = preferences[0].enabled;

          return (
            <Card
              key={preference.id}
              className={cn(
                "p-6 transition-all duration-200",
                !isMasterEnabled && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-[16px] flex items-center justify-center",
                      preference.enabled
                        ? "bg-[var(--primary-soft)]"
                        : "bg-[var(--surface-secondary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        preference.enabled
                          ? "text-[var(--primary)]"
                          : "text-[var(--text-muted)]"
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">
                      {preference.label}
                    </h4>
                    <p className="text-[13px] text-[var(--text-muted)]">
                      {preference.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePreference(preference.id)}
                  disabled={!isMasterEnabled}
                  className={cn(
                    "relative w-[52px] h-[28px] rounded-full transition-colors duration-200",
                    preference.enabled && isMasterEnabled
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--border-default)]",
                    !isMasterEnabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-200",
                      preference.enabled && isMasterEnabled
                        ? "translate-x-[26px]"
                        : "translate-x-[3px]"
                    )}
                  />
                </button>
              </div>

              {/* Channel Options */}
              {preference.enabled && isMasterEnabled && (
                <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                  <p className="text-[12px] font-medium text-[var(--text-muted)] mb-3">
                    Saluran Pengiriman
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {channelOptions.map((channel) => {
                      const ChannelIcon = channel.icon;
                      const isEnabled = preference.channels[channel.id as keyof typeof preference.channels];

                      return (
                        <button
                          key={channel.id}
                          onClick={() =>
                            handleToggleChannel(
                              preference.id,
                              channel.id as keyof NotificationPreference["channels"]
                            )
                          }
                          disabled={!channel.available}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-[14px] text-[13px] font-medium transition-all",
                            !channel.available && "opacity-40 cursor-not-allowed",
                            isEnabled && channel.available
                              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                              : "bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                          )}
                        >
                          <ChannelIcon className="w-4 h-4" />
                          <span>{channel.label}</span>
                          {isEnabled && channel.available && (
                            <Check className="w-3 h-3" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!channelOptions.slice(1).some((c) => c.available) && (
                    <p className="text-[12px] text-[var(--text-muted)] mt-2 italic">
                      Saluran lain akan segera hadir
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quiet Hours */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[var(--warning-soft)] flex items-center justify-center">
              <Clock className="w-6 h-6 text-[var(--warning)]" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1">
                Jam Tenang
              </h4>
              <p className="text-[13px] text-[var(--text-muted)]">
                Nonaktifkan notifikasi pada jam tertentu
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuietHours((prev) => ({ ...prev, enabled: !prev.enabled }))}
            className={cn(
              "relative w-[52px] h-[28px] rounded-full transition-colors duration-200",
              quietHours.enabled
                ? "bg-[var(--primary)]"
                : "bg-[var(--border-default)]"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-200",
                quietHours.enabled
                  ? "translate-x-[26px]"
                  : "translate-x-[3px]"
              )}
            />
          </button>
        </div>

        {quietHours.enabled && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <label className="text-[14px] text-[var(--text-secondary)]">Mulai:</label>
              <input
                type="time"
                value={quietHours.start}
                onChange={(e) =>
                  setQuietHours((prev) => ({ ...prev, start: e.target.value }))
                }
                className="h-[40px] px-3 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-[14px] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <span className="text-[var(--text-muted)]">-</span>
            <div className="flex items-center gap-2">
              <label className="text-[14px] text-[var(--text-secondary)]">Selesai:</label>
              <input
                type="time"
                value={quietHours.end}
                onChange={(e) =>
                  setQuietHours((prev) => ({ ...prev, end: e.target.value }))
                }
                className="h-[40px] px-3 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-[14px] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Save Button - Mobile */}
      <div className="md:hidden sticky bottom-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSave}
          isLoading={isSaving}
        >
          {showSaved ? (
            <>
              <Check className="w-5 h-5" />
              Tersimpan!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
