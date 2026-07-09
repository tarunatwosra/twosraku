"use client"

import { Loader2 } from "lucide-react"

export default function RegistrationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface-primary)] via-[var(--surface-secondary)] to-[var(--surface-primary)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)] mx-auto mb-4" />
        <p className="text-[var(--text-muted)]">Memuat...</p>
      </div>
    </div>
  )
}
