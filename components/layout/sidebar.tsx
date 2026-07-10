"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  BookUser,
  Users,
  ClipboardCheck,
  BarChart3,
  Calculator,
  CalendarDays,
  BookOpen,
  School,
  Briefcase,
  Package,
  Mail,
  Megaphone,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  GraduationCap,
  PanelLeftClose,
  Award,
  PiggyBank,
  Heart,
  Shield,
  ArrowUpDown,
  Bell,
  User,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface NavItem {
  icon: typeof Home
  label: string
  href: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: "AKADEMIK",
    items: [
      { icon: Home, label: "Dashboard", href: "/" },
      { icon: BookUser, label: "Buku Induk", href: "/buku-induk" },
    ],
  },
  {
    title: "PRESENSI",
    items: [
      { icon: ClipboardCheck, label: "Presensi Siswa", href: "/presensi" },
    ],
  },
  {
    title: "PENILAIAN",
    items: [
      { icon: BarChart3, label: "Pusat Penilaian", href: "/penilaian" },
      { icon: Calculator, label: "Input Nilai Cepat", href: "/penilaian/quick" },
      { icon: FileText, label: "Hasil Penilaian", href: "/penilaian/hasil" },
    ],
  },
  {
    title: "POIN KARAKTER",
    items: [
      { icon: Award, label: "Dashboard", href: "/poin-karakter" },
      { icon: Award, label: "Input", href: "/poin-karakter/input" },
      { icon: Award, label: "Riwayat", href: "/poin-karakter/riwayat" },
    ],
  },
  {
    title: "AKADEMIK LAINNYA",
    items: [
      { icon: CalendarDays, label: "Jadwal Pelajaran", href: "/jadwal" },
      { icon: BookOpen, label: "Mata Pelajaran", href: "/mapel" },
      { icon: School, label: "Kelas", href: "/kelas" },
    ],
  },
  {
    title: "ADMINISTRASI",
    items: [
      { icon: Briefcase, label: "Guru & Staff", href: "/guru-staff" },
      { icon: Shield, label: "Pasukan Khusus", href: "/pasukan-khusus" },
      { icon: Heart, label: "Spiritual", href: "/spiritual" },
      { icon: PiggyBank, label: "Tabungan", href: "/tabungan" },
      { icon: Package, label: "Inventaris", href: "/inventaris" },
      { icon: Mail, label: "Surat", href: "/surat" },
      { icon: Megaphone, label: "Pengumuman", href: "/pengumuman" },
    ],
  },
  {
    title: "LAPORAN",
    items: [
      { icon: FileText, label: "Laporan", href: "/laporan" },
      { icon: BarChart3, label: "Statistik", href: "/statistik" },
      { icon: ArrowUpDown, label: "Import & Export", href: "/import-export" },
    ],
  },
  {
    title: "SISTEM",
    items: [
      { icon: Bell, label: "Notifikasi", href: "/notifications" },
      { icon: Settings, label: "Pengaturan", href: "/settings" },
    ],
  },
]

interface SidebarProps {
  isCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "AKADEMIK",
    "PRESENSI",
    "PENILAIAN",
    "POIN KARAKTER",
    "ADMINISTRASI",
    "LAPORAN",
  ])
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role label
  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: "Super Admin",
      admin: "Administrator",
      principal: "Kepala Sekolah",
      vice_principal: "Wakil Kepala",
      teacher: "Guru",
      homeroom_teacher: "Wali Kelas",
      staff: "Staff",
      guest: "Tamu",
    }
    return labels[role] || role
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-[var(--z-sidebar)] h-screen bg-white/[0.82] backdrop-blur-[12px] border-r border-[var(--border-light)] flex flex-col overflow-hidden transition-all duration-300 ease-out",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo & School Name */}
      <div className="h-[72px] flex items-center gap-3 px-4 border-b border-[var(--border-light)] flex-shrink-0">
        {/* Logo Icon - Non-clickable when expanded, clickable when collapsed */}
        <div
          onClick={isCollapsed ? () => onCollapsedChange?.(!isCollapsed) : undefined}
          className={cn(
            "w-10 h-10 rounded-[12px] bg-[var(--primary)] flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-200",
            isCollapsed && "cursor-pointer hover:scale-105"
          )}
          title={isCollapsed ? "Expand sidebar" : undefined}
        >
          <GraduationCap className="w-5 h-5 text-white" />
        </div>

        {/* Title - Only show when expanded */}
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
              <h1 className="text-[13px] font-bold text-[var(--text-primary)] leading-tight whitespace-nowrap">
                SMKN 2 Sragen
              </h1>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">Taruna</p>
            </div>

            {/* Collapse Toggle Button - Only show when expanded */}
            <button
              onClick={() => onCollapsedChange?.(!isCollapsed)}
              className={cn(
                `
                w-8 h-8 flex items-center justify-center
                rounded-[10px]
                text-[var(--text-muted)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--text-primary)]
                transition-all duration-200
                flex-shrink-0
                `
              )}
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto py-2">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title)
          return (
            <div key={section.title} className="mb-2">
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                </button>
              )}
              {isExpanded && (
                <div className="space-y-1 mt-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        `
                        flex items-center gap-3 px-4 py-2.5 mx-1
                        rounded-[18px]
                        text-[14px]
                        transition-all duration-200
                        `,
                        isActive(item.href)
                          ? "bg-[var(--surface-active)] text-[var(--primary)] font-medium"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
                        isCollapsed && "justify-center px-2 mx-0"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[var(--border-light)] flex-shrink-0">
        {/* Profile Header - Always visible */}
        <button
          onClick={() => !isCollapsed && setIsProfileOpen(!isProfileOpen)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-[18px] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? `${user?.name || "User"} - ${getRoleLabel(user?.role || "")}` : undefined}
        >
          <div className="w-10 h-10 rounded-[18px] bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-semibold text-[14px] flex-shrink-0">
            {user?.name ? getInitials(user.name) : "U"}
          </div>

          {/* User Info - Hidden when collapsed */}
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[12px] text-[var(--text-muted)] capitalize">
                  {getRoleLabel(user?.role || "")}
                </p>
              </div>
              {isProfileOpen ? (
                <ChevronUp className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
              )}
            </>
          )}
        </button>

        {/* Profile Dropdown Menu - Only visible when expanded and open */}
        {!isCollapsed && isProfileOpen && (
          <div className="mt-2 p-2 bg-white rounded-[18px] shadow-lg border border-[var(--border-light)]">
            {/* Email */}
            <div className="px-3 py-2 text-[12px] text-[var(--text-muted)] truncate border-b border-[var(--border-light)] mb-2">
              {user?.email || "email@contoh.com"}
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-[12px] transition-colors"
              >
                <Settings className="w-4 h-4" />
                Pengaturan
              </Link>
              <Link
                href="/settings/users"
                className="flex items-center gap-3 px-3 py-2 text-[14px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-[12px] transition-colors"
              >
                <User className="w-4 h-4" />
                Profil Saya
              </Link>
            </div>

            {/* Logout */}
            <div className="mt-2 pt-2 border-t border-[var(--border-light)]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-[14px] text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-[12px] transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
