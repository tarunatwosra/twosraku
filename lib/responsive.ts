/**
 * Mobile Responsive Utilities for Twosraku
 *
 * Contains breakpoints, touch target utilities, and responsive helpers.
 */

// Standard breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Touch target sizes (WCAG 2.2 requirement)
export const TOUCH_TARGETS = {
  minimum: '44px',     // WCAG 2.2 minimum
  recommended: '48px', // Recommended for better UX
  comfortable: '56px', // For primary actions
};

/**
 * Generate responsive classes for touch targets
 */
export const touchTargetClasses = {
  // Minimum touch target (44px)
  min: 'min-h-[44px] min-w-[44px]',

  // Recommended touch target (48px)
  md: 'min-h-[48px] min-w-[48px]',

  // Comfortable touch target (56px)
  lg: 'min-h-[56px] min-w-[56px]',

  // Icon button touch target
  icon: 'h-[44px] w-[44px] p-0',
};

/**
 * Mobile detection hook (for SSR-safe detection)
 */
export function isMobileDevice(userAgent?: string): boolean {
  if (typeof window === 'undefined') return false;

  const ua = userAgent || navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

/**
 * Get device type
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Responsive visibility utilities
 */
export const responsiveVisibility = {
  // Hide on mobile
  hideOnMobile: 'hidden md:block',

  // Hide on tablet
  hideOnTablet: 'hidden lg:block',

  // Hide on desktop
  hideOnDesktop: 'md:hidden',

  // Show only on mobile
  showOnMobile: 'block md:hidden',

  // Show only on tablet
  showOnTablet: 'hidden md:block lg:hidden',

  // Show only on desktop
  showOnDesktop: 'hidden lg:block',
};

/**
 * Spacing adjustments for mobile
 */
export const mobileSpacing = {
  // Padding adjustments
  pagePadding: 'px-4 py-4 md:px-6 lg:px-8',
  cardPadding: 'p-4 md:p-6 lg:p-8',

  // Gap adjustments
  gap: 'gap-3 md:gap-4 lg:gap-6',

  // Section spacing
  sectionGap: 'space-y-4 md:space-y-6 lg:space-y-8',
};

/**
 * Mobile-optimized interactive elements
 */
export const mobileInteractive = {
  // Full-width touch-friendly button
  fullButton: 'w-full h-[52px] text-[15px] rounded-[18px]',

  // Compact touch-friendly button
  compactButton: 'h-[44px] px-4 text-[14px] rounded-[14px]',

  // Touch-friendly list item
  listItem: 'min-h-[56px] px-4 py-3',

  // Mobile-friendly input
  input: 'h-[48px] text-[16px]', // 16px prevents iOS zoom

  // Mobile-friendly select
  select: 'h-[48px] text-[16px]',
};

/**
 * Safe area utilities for notched devices
 */
export const safeAreas = {
  top: 'pt-[env(safe-area-inset-top,0px)]',
  bottom: 'pb-[env(safe-area-inset-bottom,0px)]',
  left: 'pl-[env(safe-area-inset-left,0px)]',
  right: 'pr-[env(safe-area-inset-right,0px)]',
};

/**
 * Viewport height utility for mobile browsers
 */
export const mobileHeight = {
  // Full height
  full: 'h-[100vh] h-[100dvh]',

  // Screen height minus header
  minusHeader: 'h-[calc(100vh-80px)] h-[calc(100dvh-80px)]',

  // Screen height minus bottom nav
  minusBottomNav: 'h-[calc(100vh-72px)] h-[calc(100dvh-72px)]',

  // Screen height minus header and bottom nav
  minusBoth: 'h-[calc(100vh-136px)] h-[calc(100dvh-136px)]',
};

/**
 * Scroll behavior for mobile
 */
export const mobileScroll = {
  // Smooth scroll with momentum
  smooth: 'overflow-y-auto overscroll-contain',

  // Hide scrollbar but keep scroll
  hidden: 'scrollbar-hide overflow-y-auto',

  // Pull to refresh container
  pullRefresh: 'overflow-y-auto overscroll-y-contain',
};

/**
 * Prevent zoom on double tap for iOS
 */
export const preventZoom = {
  // On touch devices, prevent double-tap zoom
  className: 'touch-action-manipulation',

  // CSS for preventing zoom
  css: `
    @media (max-width: 768px) {
      input, select, textarea {
        font-size: 16px !important;
      }
    }
  `,
};

/**
 * Focus management for mobile
 */
export const mobileFocus = {
  // Remove focus outline on touch devices
  touchHide: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',

  // Always show focus for accessibility
  alwaysShow: 'focus:outline-2 focus:outline-[var(--primary)] focus:outline-offset-2',
};
