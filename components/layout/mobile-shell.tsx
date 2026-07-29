"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { MobileHeader } from "./mobile-header";
import { MobileBottomNav } from "./mobile-bottom-nav";

interface MobileShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function MobileShell({
  children,
  showBottomNav = true
}: MobileShellProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen-mobile flex items-center justify-center bg-[var(--background-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-[14px]">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen-mobile bg-[var(--background-primary)]">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main
        className={`pb-[calc(72px+env(safe-area-inset-bottom,16px))] ${
          showBottomNav ? "pt-[72px]" : ""
        }`}
      >
        <div className="px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <MobileBottomNav />
      )}
    </div>
  );
}
