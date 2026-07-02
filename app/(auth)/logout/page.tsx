"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const { logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      await logout()
      router.push("/login")
    }

    performLogout()
  }, [logout, router])

  return (
    <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
        <p className="text-[var(--text-secondary)]">Keluar dari akun...</p>
      </div>
    </div>
  )
}
