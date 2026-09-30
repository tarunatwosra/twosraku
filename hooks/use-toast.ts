"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = `toast-${++toastId}`
    const newToast: Toast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2000)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}

// Simple toast function for quick use
export function showToast(message: string, variant: "success" | "error" | "warning" = "success") {
  // Create a simple toast element
  const toastEl = document.createElement("div")
  toastEl.className = `
    fixed bottom-4 right-4 z-50
    px-4 py-3 rounded-lg shadow-lg
    text-sm font-medium
    animate-in slide-in-from-bottom-2 fade-in-0 duration-200
    ${variant === "success" ? "bg-emerald-500 text-white" : ""}
    ${variant === "error" ? "bg-red-500 text-white" : ""}
    ${variant === "warning" ? "bg-amber-500 text-white" : ""}
  `
  toastEl.textContent = message
  document.body.appendChild(toastEl)

  setTimeout(() => {
    toastEl.style.opacity = "0"
    toastEl.style.transition = "opacity 200ms"
    setTimeout(() => toastEl.remove(), 200)
  }, 2000)
}
