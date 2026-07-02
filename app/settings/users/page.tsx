"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout"
import { Card } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import {
  Save,
  Plus,
  Search,
  MoreVertical,
  Shield,
  Trash2,
  Edit,
  Key,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo users data
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
  const [users, setUsers] = useState(demoUsers)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell title="Manajemen Pengguna" description="Kelola akun pengguna sistem">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Total {users.length} pengguna
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64"
              />
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Pengguna
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-secondary)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Peran
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Login Terakhir
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[var(--surface-hover)] transition-colors"
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
                          <p className="text-sm text-[var(--text-muted)]">
                            @{u.username} • {u.email}
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
                        <span className="text-sm text-[var(--text-secondary)] capitalize">
                          {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[var(--text-muted)]">
                      {u.lastLogin}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        {u.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
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
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-[var(--text-muted)]">
                Tidak ada pengguna yang ditemukan
              </p>
            </div>
          )}
        </Card>

        {/* Role Legend */}
        <div className="mt-6 p-4 bg-[var(--surface-secondary)] rounded-lg">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            Legenda Peran
          </p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(roleLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-3 h-3 rounded-full",
                    roleColors[key] || "bg-[var(--text-muted)]"
                  )}
                />
                <span className="text-sm text-[var(--text-muted)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
