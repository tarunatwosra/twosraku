"use client"

import { Lock } from "lucide-react"

export default function RegistrationClosedPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[var(--primary)]/10 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          Registrasi Ditutup
        </h1>
        <p className="text-[var(--text-muted)] mb-6">
          Maaf, halaman registrasi sementara tidak tersedia. Silakan hubungi admin sekolah untuk informasi lebih lanjut.
        </p>
        <div className="p-4 bg-[var(--surface-secondary)] rounded-2xl">
          <p className="text-sm text-[var(--text-muted)]">
            💡 <strong>Catatan:</strong> Hubungi admin sekolah jika kamu merasa ini adalah kesalahan.
          </p>
        </div>
      </div>
    </div>
  )
}
