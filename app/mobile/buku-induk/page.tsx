"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Search,
  UserPlus,
  Users,
  User,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data for demonstration
const sampleStudents = [
  { id: "1", name: "Anisa Rahman", nis: "2025001", class: "X IPA 1", gender: "P" },
  { id: "2", name: "Budi Santoso", nis: "2025002", class: "X IPA 1", gender: "L" },
  { id: "3", name: "Dewi Lestari", nis: "2025003", class: "X IPA 2", gender: "P" },
  { id: "4", name: "Eko Prasetyo", nis: "2025004", class: "X IPS 1", gender: "L" },
  { id: "5", name: "Fitri Handayani", nis: "2025005", class: "X IPA 2", gender: "P" },
];

export default function MobileBukuIndukPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students] = useState(sampleStudents);

  // Filter students based on search
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.nis.includes(search)
  );

  return (
    <MobileShell>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-10 text-[14px] bg-[var(--surface-primary)] border border-[var(--border-light)]/60 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--border-light)] flex items-center justify-center transition-colors"
          >
            <span className="text-[var(--text-muted)] text-xs">✕</span>
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          padding="md"
          onClick={() => router.push("/buku-induk/new")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Tambah Siswa
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Registrasi baru
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          padding="md"
          onClick={() => router.push("/buku-induk")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--info-soft)] flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--info)]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                Daftar Lengkap
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Lihat semua
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card className="p-0 overflow-hidden" padding="none">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border-light)]/60">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Siswa Terbaru
            </h3>
            <span className="text-[12px] text-[var(--text-muted)]">
              {filteredStudents.length} siswa
            </span>
          </div>
        </div>

        {/* Student List */}
        <div className="divide-y divide-[var(--border-light)]/40">
          {filteredStudents.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-[14px] text-[var(--text-secondary)]">
                {search ? "Tidak ada siswa yang ditemukan" : "Belum ada data siswa"}
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="px-4 py-3 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                onClick={() => router.push(`/buku-induk/${student.id}`)}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                    student.gender === "L"
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "bg-pink-100 text-pink-600"
                  )}
                >
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                    {student.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {student.nis}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">•</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {student.class}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </MobileShell>
  );
}
