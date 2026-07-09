/**
 * Registration Public Layout
 *
 * Layout untuk halaman registrasi siswa (tanpa sidebar admin)
 */

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface-primary)] via-[var(--surface-secondary)] to-[var(--surface-primary)]">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--surface-primary)]/80 backdrop-blur-lg border-b border-[var(--border-light)]/50">
          <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/70 flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-[var(--text-primary)]">
                  Twosraku
                </h1>
                <p className="text-xs text-[var(--text-muted)]">
                  Registrasi Siswa
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10">{children}</main>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Twosraku • Sistem Informasi Sekolah
          </p>
        </footer>
      </div>
    </div>
  )
}
