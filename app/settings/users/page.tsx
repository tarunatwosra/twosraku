"use client"

/**
 * Reading: Users management page dengan table-based layout
 * Bahasa visual: Clean data table dengan status indicators
 * Dial: ENERGI 2 / RITME 1 / GERAK 1
 */

import { useState } from "react"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import {
  Plus,
  Search,
  Shield,
  Trash2,
  Edit,
  Key,
  Users,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

const demoUsers = [
  {
    id: "1",
    name: "Administrator",
    username: "admin",
    email: "admin@smkn2sragen.sch.id",
    role: "admin",
    status: "active",
    lastLogin: "2025-07-01 08:30",
    avatar: undefined,
  },
  {
    id: "2",
    name: "Dr. Budi Santoso",
    username: "kepala_sekolah",
    email: "kepala@smkn2sragen.sch.id",
    role: "principal",
    status: "active",
    lastLogin: "2025-07-01 07:00",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Siti Rahayu, S.Pd.",
    username: "guru",
    email: "guru@smkn2sragen.sch.id",
    role: "teacher",
    status: "active",
    lastLogin: "2025-06-30 15:45",
    avatar: undefined,
  },
  {
    id: "4",
    name: "Ahmad Wijaya",
    username: "ahmad_wijaya",
    email: "ahmad@smkn2sragen.sch.id",
    role: "staff",
    status: "inactive",
    lastLogin: "2025-06-15 10:00",
    avatar: undefined,
  },
]

const roleColors: Record<string, string> = {
  super_admin: "bg-[var(--danger)]",
  admin: "bg-[var(--primary)]",
  principal: "bg-[var(--warning)]",
  vice_principal: "bg-[var(--info)]",
  teacher: "bg-[var(--success)]",
  homeroom_teacher: "bg-[var(--success)]",
  staff: "bg-[var(--text-muted)]",
  guest: "bg-[var(--border)]",
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  principal: "Kepala Sekolah",
  vice_principal: "Wakil Kepala Sekolah",
  teacher: "Guru",
  homeroom_teacher: "Wali Kelas",
  staff: "Staff",
  guest: "Tamu",
}

const statusColors: Record<string, string> = {
  active: "bg-[var(--success)]",
  inactive: "bg-[var(--text-muted)]",
  locked: "bg-[var(--danger)]",
  pending: "bg-[var(--warning)]",
}

export default function UsersSettingsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [users] = useState(demoUsers)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-section-title">Pengguna Sistem</h2>
              <p className="text-[12px] text-[var(--text-muted)]">
                Total {users.length} pengguna terdaftar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <Input
                type="text"
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 h-11 w-64"
              />
            </div>
            <Button className="gap-2 h-11">
              <Plus className="w-4 h-4" />
              Tambah Pengguna
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--surface-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Peran
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Login Terakhir
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-[var(--surface-hover)] transition-colors duration-150"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        fallback={u.name}
                        src={u.avatar}
                        className="w-10 h-10"
                      />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {u.name}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)]">
                          @{u.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      className={cn(
                        "text-white",
                        roleColors[u.role] || "bg-[var(--text-muted)]"
                      )}
                    >
                      {roleLabels[u.role] || u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          statusColors[u.status]
                        )}
                      />
                      <span className="text-[13px] text-[var(--text-secondary)] capitalize">
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[var(--text-muted)]">
                    {u.lastLogin}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </Button>
                      {u.id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 hover:bg-[var(--danger-soft)]"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Search className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
              <p className="text-[var(--text-secondary)]">
                Tidak ada pengguna yang ditemukan
              </p>
              <p className="text-[12px] text-[var(--text-muted)]">
                Coba ubah kata kunci pencarian
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Role Legend Card */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--surface-secondary)] flex items-center justify-center">
            <Info className="w-4 h-4 text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Legenda Peran
          </h3>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {Object.entries(roleLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-3 h-3 rounded-full",
                  roleColors[key] || "bg-[var(--text-muted)]"
                )}
              />
              <span className="text-[13px] text-[var(--text-secondary)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
