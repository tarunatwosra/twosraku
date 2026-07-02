"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/hooks/useAuth"
import { SettingsProvider } from "@/hooks/useSettings"
import { CommandPalette } from "@/components/command"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        {children}
        <CommandPalette />
      </SettingsProvider>
    </AuthProvider>
  )
}
