"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export function AppShell({
  children,
  showHeader = true,
  title,
  description,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[var(--background-primary)]">
      {/* Desktop Floating Sidebar - Always visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area - Sidebar width drives margin */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-out",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        {/* Top Header */}
        {showHeader && (
          <Header
            title={title}
            description={description}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        )}

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 p-[24px] lg:p-[40px]",
            showHeader && "pt-[24px]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
