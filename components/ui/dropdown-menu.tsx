"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

// ============================================
// Context
// ============================================

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  portalRoot: HTMLElement | null
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  portalRoot: null,
})

// ============================================
// Hook: use portal root
// ============================================

function usePortalRoot() {
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    let root = document.getElementById("dropdown-portal-root") as HTMLElement
    if (!root) {
      root = document.createElement("div")
      root.id = "dropdown-portal-root"
      root.style.position = "fixed"
      root.style.top = "0"
      root.style.left = "0"
      root.style.width = "100%"
      root.style.height = "100%"
      root.style.pointerEvents = "none"
      root.style.zIndex = "9999"
      document.body.appendChild(root)
    }
    setPortalRoot(root)
  }, [])

  return portalRoot
}

// ============================================
// DropdownMenu
// ============================================

interface DropdownMenuProps {
  children: React.ReactNode
  align?: "left" | "right"
}

function DropdownMenu({ children, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const portalRoot = usePortalRoot()

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".dropdown-content")) {
        setOpen(false)
      }
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("keydown", keyHandler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("keydown", keyHandler)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, portalRoot }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

// ============================================
// DropdownMenuTrigger
// ============================================

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (e: React.MouseEvent) => {
        setOpen(true)
        ;(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>).props.onClick?.(e)
      },
    })
  }

  return (
    <button
      onClick={() => setOpen(true)}
      type="button"
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  )
}

// ============================================
// DropdownMenuContent
// ============================================

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "left" | "right"
}

function DropdownMenuContent({ children, className, align = "right" }: DropdownMenuContentProps) {
  const { open, setOpen, portalRoot } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  if (!open || !portalRoot) return null

  // Calculate position
  React.useEffect(() => {
    const trigger = ref.current?.previousElementSibling as HTMLElement
    if (!trigger || !ref.current) return

    const rect = trigger.getBoundingClientRect()
    const content = ref.current

    if (align === "right") {
      content.style.right = `${window.innerWidth - rect.right}px`
      content.style.left = "auto"
    } else {
      content.style.left = `${rect.left}px`
      content.style.right = "auto"
    }
    content.style.top = `${rect.bottom + 4}px`
  }, [align])

  return createPortal(
    <div
      ref={ref}
      className={cn(
        "dropdown-content fixed z-50 bg-white rounded-[18px] shadow-lg border border-[var(--border-light)] py-2 w-52 overflow-hidden animate-scale-in",
        className
      )}
    >
      {children}
    </div>,
    portalRoot
  )
}

// ============================================
// DropdownMenuItem
// ============================================

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "danger"
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
  /** Prevent auto-closing the menu when clicked (useful for checkbox items) */
  preventClose?: boolean
}

function DropdownMenuItem({
  children,
  onClick,
  variant = "default",
  className,
  icon,
  disabled,
  preventClose = false,
}: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    if (!preventClose) {
      setOpen(false)
    }
  }

  return (
    <div
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors cursor-pointer select-none",
        variant === "default" && "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]",
        variant === "danger" && "text-[var(--danger)] hover:bg-[var(--danger-soft)]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  )
}

// ============================================
// DropdownMenuSeparator
// ============================================

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-[var(--border-light)] my-2", className)} />
}

// ============================================
// DropdownMenuLabel
// ============================================

function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-1.5 text-[12px] font-medium text-[var(--text-secondary)]", className)}>
      {children}
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
