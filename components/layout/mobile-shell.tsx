"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { MobileHeader } from "./mobile-header";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { getStoredRedirectUrl } from "@/hooks/useAuthRedirect";

interface MobileShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showHeaderGreeting?: boolean;
}

export function MobileShell({
  children,
  showBottomNav = true,
  showHeaderGreeting = true,
}: MobileShellProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated (and save redirect URL)
  useEffect(() => {
    console.log("[MobileShell] Auth state:", { authLoading, isAuthenticated, pathname: window.location.pathname });

    if (!authLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      console.log("[MobileShell] Will save redirect URL:", currentPath);
      console.log("[MobileShell] SessionStorage before:", sessionStorage.getItem("redirectUrl"));

      if (currentPath !== "/login") {
        sessionStorage.setItem("redirectUrl", currentPath);
        console.log("[MobileShell] SessionStorage after:", sessionStorage.getItem("redirectUrl"));
        console.log("[MobileShell] REDIRECTING TO LOGIN");
      }
      router.push("/login");
    } else if (!authLoading && isAuthenticated) {
      console.log("[MobileShell] User is authenticated, showing content");
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
        className="pb-[calc(72px+env(safe-area-inset-bottom,16px))] pt-[56px]"
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
