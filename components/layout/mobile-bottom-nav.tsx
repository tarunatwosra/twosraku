"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  CalendarCheck,
  ClipboardCheck,
  BookUser,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Beranda",
    href: "/mobile",
    icon: Home,
    activeIcon: Home,
  },
  {
    label: "Absensi",
    href: "/mobile/presensi",
    icon: CalendarCheck,
    activeIcon: CalendarCheck,
  },
  {
    label: "Nilai",
    href: "/mobile/penilaian",
    icon: ClipboardCheck,
    activeIcon: ClipboardCheck,
  },
  {
    label: "Buku Induk",
    href: "/mobile/buku-induk",
    icon: BookUser,
    activeIcon: BookUser,
  },
  {
    label: "Lainnya",
    href: "/mobile/more",
    icon: MoreHorizontal,
    activeIcon: MoreHorizontal,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-white/50 backdrop-blur-sm border-t border-[var(--border-light)]/60">
      <div className="flex items-center justify-around h-[72px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200",
                isActive
                  ? "text-[var(--primary)] bg-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] active:bg-[var(--surface-hover)]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span
                className={cn(
                  "text-[10px] font-medium mt-0.5",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
