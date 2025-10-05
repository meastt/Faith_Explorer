/**
 * Design System Constants
 * Centralized design tokens for consistent UI
 */

// Icon Sizes
export const ICON_SIZES = {
  SM: 'w-4 h-4',      // 16px - Inline text, small UI elements
  MD: 'w-5 h-5',      // 20px - Buttons, standard actions
  LG: 'w-8 h-8',      // 32px - Feature cards, headers
  XL: 'w-12 h-12',    // 48px - Large feature icons
} as const;

// Spacing Scale
export const SPACING = {
  XS: 'py-2',         // 8px - Minimal spacing
  SM: 'py-4',         // 16px - Small sections
  MD: 'py-6',         // 24px - Medium sections
  LG: 'py-8',         // 32px - Large sections
  XL: 'py-12',        // 48px - Extra large sections
} as const;

// Border Radius
export const RADIUS = {
  SM: 'rounded-lg',   // 8px - Small elements
  MD: 'rounded-xl',   // 12px - Cards
  LG: 'rounded-2xl',  // 16px - Sections, main content
  XL: 'rounded-3xl',  // 24px - Special features
} as const;

// Z-Index Scale
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 20,
  DRAWER_BACKDROP: 40,
  DRAWER: 50,
  HEADER: 50,
  MODAL_BACKDROP: 60,
  MODAL: 70,
} as const;

// Shadow Scale
export const SHADOWS = {
  SOFT: 'shadow-soft',
  MEDIUM: 'shadow-medium',
  STRONG: 'shadow-strong',
} as const;

// Common Class Combinations
export const CARD_BASE = `${RADIUS.LG} ${SHADOWS.SOFT} border`;
export const BUTTON_BASE = 'px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
export const INPUT_BASE = 'px-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200';
