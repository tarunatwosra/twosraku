/**
 * Accessibility Utilities for Twosraku
 *
 * Contains contrast ratio calculations, WCAG compliance checks,
 * and accessibility helper functions.
 */

// WCAG 2.1 Contrast Ratio Requirements
export const WCAG_LEVELS = {
  AA_NORMAL: 4.5,  // Minimum for normal text
  AA_LARGE: 3.0,   // Minimum for large text (18px+ or 14px+ bold)
  AAA_NORMAL: 7.0, // Enhanced for normal text
  AAA_LARGE: 4.5,  // Enhanced for large text
};

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 1;

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = level === 'AAA'
    ? (isLargeText ? WCAG_LEVELS.AAA_LARGE : WCAG_LEVELS.AAA_NORMAL)
    : (isLargeText ? WCAG_LEVELS.AA_LARGE : WCAG_LEVELS.AA_NORMAL);

  return ratio >= threshold;
}

// Design Tokens Color Map for Contrast Analysis
export const DESIGN_TOKEN_COLORS = {
  // Backgrounds
  '--background-primary': '#F5F7FB',
  '--background-secondary': '#FFFFFF',
  '--background-tertiary': '#F8FAFC',

  // Surfaces
  '--surface-primary': '#FFFFFF',
  '--surface-secondary': '#FAFBFD',
  '--surface-hover': '#F3F6FA',
  '--surface-active': '#EDF3FF',

  // Borders
  '--border-light': '#EDF1F6',
  '--border-default': '#E3EAF3',
  '--border-strong': '#D3DCE8',
  '--border-focus': '#4F7CFF',

  // Primary
  '--primary': '#4F7CFF',
  '--primary-hover': '#3E6CF2',
  '--primary-soft': '#EEF4FF',

  // Status Colors
  '--success': '#22C55E',
  '--success-soft': '#ECFDF3',
  '--warning': '#F59E0B',
  '--warning-soft': '#FFF7E6',
  '--danger': '#EF4444',
  '--danger-soft': '#FEF2F2',
  '--info': '#06B6D4',
  '--info-soft': '#ECFEFF',
  '--purple': '#8B5CF6',
  '--purple-soft': '#F5F3FF',

  // Text
  '--text-primary': '#172033',
  '--text-secondary': '#64748B',
  '--text-muted': '#94A3B8',
  '--text-disabled': '#CBD5E1',
  '--text-white': '#FFFFFF',

  // Icons
  '--icon-default': '#5B6B83',
  '--icon-muted': '#94A3B8',
};

// Common contrast combinations to check
export const CONTRAST_CHECKLIST = [
  // Text on Backgrounds
  { fg: '--text-primary', bg: '--background-primary', text: 'Normal text on primary bg' },
  { fg: '--text-secondary', bg: '--background-primary', text: 'Secondary text on primary bg' },
  { fg: '--text-muted', bg: '--background-primary', text: 'Muted text on primary bg' },
  { fg: '--text-white', bg: '--primary', text: 'White text on primary button' },

  // Buttons
  { fg: '--text-white', bg: '--primary', text: 'Primary button' },
  { fg: '--text-white', bg: '--danger', text: 'Danger button' },
  { fg: '--text-white', bg: '--success', text: 'Success button' },

  // Badges (soft variants)
  { fg: '--primary', bg: '--primary-soft', text: 'Primary badge soft' },
  { fg: '--success', bg: '--success-soft', text: 'Success badge soft' },
  { fg: '--warning', bg: '--warning-soft', text: 'Warning badge soft' },
  { fg: '--danger', bg: '--danger-soft', text: 'Danger badge soft' },
  { fg: '--info', bg: '--info-soft', text: 'Info badge soft' },
  { fg: '--purple', bg: '--purple-soft', text: 'Purple badge soft' },

  // Text on white
  { fg: '--text-primary', bg: '--surface-primary', text: 'Text on white surface' },
  { fg: '--text-secondary', bg: '--surface-primary', text: 'Secondary text on white' },
  { fg: '--text-muted', bg: '--surface-primary', text: 'Muted text on white' },
];

/**
 * Audit all color combinations
 */
export function auditContrast(): { passing: string[]; failing: string[] } {
  const passing: string[] = [];
  const failing: string[] = [];

  for (const check of CONTRAST_CHECKLIST) {
    const fg = DESIGN_TOKEN_COLORS[check.fg as keyof typeof DESIGN_TOKEN_COLORS];
    const bg = DESIGN_TOKEN_COLORS[check.bg as keyof typeof DESIGN_TOKEN_COLORS];

    if (fg && bg) {
      const ratio = getContrastRatio(fg, bg);
      const isLarge = check.text.includes('badge') || check.text.includes('button');
      const meets = meetsContrastRequirement(fg, bg, 'AA', isLarge);

      const result = `${check.text}: ${ratio.toFixed(2)}:1 ${meets ? '✓ PASS' : '✗ FAIL'}`;

      if (meets) {
        passing.push(result);
      } else {
        failing.push(result);
      }
    }
  }

  return { passing, failing };
}

// Fix recommendations for failing combinations
export const CONTRAST_FIXES: Record<string, { current: string; suggested: string; reason: string }> = {
  'Muted text on white': {
    current: '#94A3B8 on #FFFFFF',
    suggested: '#6B7280 or darker',
    reason: 'Muted (#94A3B8) has 2.3:1 ratio, below 4.5:1 threshold'
  },
  'Muted text on primary bg': {
    current: '#94A3B8 on #F5F7FB',
    suggested: '#64748B or use --text-secondary',
    reason: 'Muted text on light background needs more contrast'
  }
};
