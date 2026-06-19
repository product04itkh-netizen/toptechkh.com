// Admin UI color scheme - centralized for consistent theming
export const ADMIN_COLORS = {
  // Primary colors
  primary: '#041e42',        // Dark navy - main brand color
  primaryHover: '#0a3060',   // Lighter navy on hover
  primaryLight: '#f0f3f7',   // Light background

  // Text colors
  textDark: '#021523',       // Dark text
  textMuted: '#818ea0',      // Muted/secondary text

  // Borders and dividers
  border: '#e5e8ec',         // Light border
  borderLight: '#f2f3f5',    // Very light background fill

  // System colors
  success: '#10b981',        // Green
  error: '#ef4444',          // Red
  warning: '#f59e0b',        // Orange
  info: '#3b82f6',           // Blue
} as const

export type AdminColor = keyof typeof ADMIN_COLORS
