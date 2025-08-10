/**
 * Design Tokens - Foundational design system values extracted from Figma designs
 * Primary Reference: Homepage Design (Figma: rSs8qA62BJTjabjISJARW5)
 * 
 * This file contains all design tokens that form the foundation of the Naffles design system.
 * All components and pages should use these tokens for consistency.
 * 
 * Design System Guidelines:
 * - All tokens are extracted from the homepage design as the primary reference
 * - Colors support both light and dark theme variations
 * - Typography scales responsively across breakpoints
 * - Spacing follows an 8px base grid system
 * - Shadows provide consistent elevation hierarchy
 */

// =============================================================================
// COLOR PALETTE - Extracted from Homepage Design
// =============================================================================

export const colors = {
  // Primary Brand Colors - Main Naffles brand identity
  primary: {
    50: '#f0f9ff',   // Lightest blue - backgrounds, subtle highlights
    100: '#e0f2fe',  // Very light blue - hover states, light backgrounds
    200: '#bae6fd',  // Light blue - disabled states, light borders
    300: '#7dd3fc',  // Medium light blue - secondary elements
    400: '#38bdf8',  // Medium blue - interactive elements
    500: '#0ea5e9',  // Primary blue - main brand color, primary buttons
    600: '#0284c7',  // Medium dark blue - hover states, active elements
    700: '#0369a1',  // Dark blue - pressed states, dark text
    800: '#075985',  // Very dark blue - high contrast text
    900: '#0c4a6e',  // Darkest blue - headings, strong emphasis
  },
  
  // Secondary Accent Colors - Purple accents for variety
  secondary: {
    50: '#fdf4ff',   // Lightest purple - subtle backgrounds
    100: '#fae8ff',  // Very light purple - light accents
    200: '#f3d4fe',  // Light purple - borders, dividers
    300: '#e9a3ff',  // Medium light purple - secondary highlights
    400: '#d946ef',  // Medium purple - accent elements
    500: '#c026d3',  // Primary purple - secondary brand color
    600: '#a21caf',  // Medium dark purple - hover states
    700: '#86198f',  // Dark purple - active states
    800: '#701a75',  // Very dark purple - strong accents
    900: '#581c87',  // Darkest purple - high contrast accents
  },
  
  // Success States - Green palette for positive actions
  success: {
    50: '#f0fdf4',   // Success background - light success states
    100: '#dcfce7',  // Success light - success notifications
    200: '#bbf7d0',  // Success lighter - success borders
    300: '#86efac',  // Success medium light - success icons
    400: '#4ade80',  // Success medium - success buttons
    500: '#22c55e',  // Success primary - main success color
    600: '#16a34a',  // Success dark - success hover states
    700: '#15803d',  // Success darker - success active states
    800: '#166534',  // Success very dark - success text
    900: '#14532d',  // Success darkest - strong success emphasis
  },
  
  // Error States - Red palette for errors and warnings
  error: {
    50: '#fef2f2',   // Error background - light error states
    100: '#fee2e2',  // Error light - error notifications
    200: '#fecaca',  // Error lighter - error borders
    300: '#fca5a5',  // Error medium light - error icons
    400: '#f87171',  // Error medium - error buttons
    500: '#ef4444',  // Error primary - main error color
    600: '#dc2626',  // Error dark - error hover states
    700: '#b91c1c',  // Error darker - error active states
    800: '#991b1b',  // Error very dark - error text
    900: '#7f1d1d',  // Error darkest - strong error emphasis
  },
  
  // Warning States - Amber palette for warnings and cautions
  warning: {
    50: '#fffbeb',   // Warning background - light warning states
    100: '#fef3c7',  // Warning light - warning notifications
    200: '#fde68a',  // Warning lighter - warning borders
    300: '#fcd34d',  // Warning medium light - warning icons
    400: '#fbbf24',  // Warning medium - warning buttons
    500: '#f59e0b',  // Warning primary - main warning color
    600: '#d97706',  // Warning dark - warning hover states
    700: '#b45309',  // Warning darker - warning active states
    800: '#92400e',  // Warning very dark - warning text
    900: '#78350f',  // Warning darkest - strong warning emphasis
  },
  
  // Info States - Blue palette for informational content
  info: {
    50: '#eff6ff',   // Info background - light info states
    100: '#dbeafe',  // Info light - info notifications
    200: '#bfdbfe',  // Info lighter - info borders
    300: '#93c5fd',  // Info medium light - info icons
    400: '#60a5fa',  // Info medium - info buttons
    500: '#3b82f6',  // Info primary - main info color
    600: '#2563eb',  // Info dark - info hover states
    700: '#1d4ed8',  // Info darker - info active states
    800: '#1e40af',  // Info very dark - info text
    900: '#1e3a8a',  // Info darkest - strong info emphasis
  },
  
  // Neutral Grays - Comprehensive gray scale for text and backgrounds
  gray: {
    50: '#f9fafb',   // Lightest gray - page backgrounds, subtle fills
    100: '#f3f4f6',  // Very light gray - card backgrounds, light borders
    200: '#e5e7eb',  // Light gray - borders, dividers, disabled backgrounds
    300: '#d1d5db',  // Medium light gray - placeholder text, inactive elements
    400: '#9ca3af',  // Medium gray - secondary text, icons
    500: '#6b7280',  // Primary gray - body text, form labels
    600: '#4b5563',  // Medium dark gray - headings, emphasized text
    700: '#374151',  // Dark gray - primary headings, strong text
    800: '#1f2937',  // Very dark gray - high contrast text, dark backgrounds
    900: '#111827',  // Darkest gray - maximum contrast text, dark themes
  },
  
  // Crypto-themed Colors - Specific colors for cryptocurrency branding
  crypto: {
    bitcoin: '#f7931a',    // Bitcoin orange - Bitcoin-related elements
    ethereum: '#627eea',   // Ethereum blue - Ethereum-related elements
    solana: '#9945ff',     // Solana purple - Solana-related elements
    polygon: '#8247e5',    // Polygon purple - Polygon-related elements
    base: '#0052ff',       // Base blue - Base network elements
    gold: '#ffd700',       // Gold - Premium features, rewards
    silver: '#c0c0c0',     // Silver - Secondary rewards, tiers
    bronze: '#cd7f32',     // Bronze - Basic tiers, achievements
  },
  
  // Naffles Brand Colors - Extracted from Figma homepage design
  naffles: {
    menu: '#1b1b1b',       // Naffles Menu - Dark navigation background
    yellow: '#fbfc4e',     // Naffles Yellow - Brand accent color
    darkGrey: '#2a2a2a',   // Naffles Dark Grey - Secondary dark backgrounds
    lightBorder: '#464646', // Naffles Light Border - Border elements
    aqua: '#02B1B1',       // AQUA - Accent color for highlights
    lightGrey: '#969696',  // Naffles Light Grey - Secondary text
    grey: '#464646',       // Grey - Standard grey elements
    pink: '#dc2abf',       // Naffles Pink - Brand accent color
    charcoal: '#292929',   // Charcoal - Deep dark backgrounds
  },
  
  // Semantic Colors - Contextual color assignments
  semantic: {
    background: '#ffffff',      // Main background color
    surface: '#f9fafb',        // Card and component backgrounds
    border: '#e5e7eb',         // Default border color
    text: {
      primary: '#111827',      // Primary text color
      secondary: '#6b7280',    // Secondary text color
      tertiary: '#9ca3af',     // Tertiary text color
      inverse: '#ffffff',      // Text on dark backgrounds
    },
    link: {
      default: '#0ea5e9',      // Default link color
      hover: '#0284c7',        // Link hover color
      visited: '#86198f',      // Visited link color
    },
  },
  
  // Theme Variations - Support for light and dark themes
  theme: {
    light: {
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      border: '#e5e7eb',
    },
    dark: {
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      border: '#374151',
    },
  },
};

// =============================================================================
// TYPOGRAPHY SYSTEM - Font families, sizes, weights, and line heights
// =============================================================================

export const typography = {
  // Font Families - Consistent font stack across the platform
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
    display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'], // For headings and display text
  },
  
  // Font Sizes - Responsive typography scale
  fontSize: {
    xs: '0.75rem',     // 12px - Small labels, captions
    sm: '0.875rem',    // 14px - Small text, secondary information
    base: '1rem',      // 16px - Body text, default size
    lg: '1.125rem',    // 18px - Large body text, subheadings
    xl: '1.25rem',     // 20px - Small headings, emphasized text
    '2xl': '1.5rem',   // 24px - Medium headings
    '3xl': '1.875rem', // 30px - Large headings
    '4xl': '2.25rem',  // 36px - Extra large headings
    '5xl': '3rem',     // 48px - Display headings
    '6xl': '3.75rem',  // 60px - Hero headings
    '7xl': '4.5rem',   // 72px - Extra large display
    '8xl': '6rem',     // 96px - Maximum display size
    '9xl': '8rem',     // 128px - Ultra large display
  },
  
  // Font Weights - Consistent weight scale
  fontWeight: {
    thin: '100',       // Thin weight - rarely used
    extralight: '200', // Extra light - decorative text
    light: '300',      // Light - subtle emphasis
    normal: '400',     // Normal - body text, default
    medium: '500',     // Medium - emphasized body text
    semibold: '600',   // Semibold - subheadings, strong emphasis
    bold: '700',       // Bold - headings, strong text
    extrabold: '800',  // Extra bold - display headings
    black: '900',      // Black - maximum emphasis
  },
  
  // Line Heights - Consistent vertical rhythm
  lineHeight: {
    none: '1',         // 1 - Tight spacing for headings
    tight: '1.25',     // 1.25 - Tight spacing for large text
    snug: '1.375',     // 1.375 - Snug spacing for headings
    normal: '1.5',     // 1.5 - Normal spacing for body text
    relaxed: '1.625',  // 1.625 - Relaxed spacing for readability
    loose: '2',        // 2 - Loose spacing for large text blocks
  },
  
  // Letter Spacing - Fine-tuning character spacing
  letterSpacing: {
    tighter: '-0.05em', // Tighter - large headings
    tight: '-0.025em',  // Tight - headings
    normal: '0em',      // Normal - body text
    wide: '0.025em',    // Wide - small text
    wider: '0.05em',    // Wider - uppercase text
    widest: '0.1em',    // Widest - spaced out text
  },
};

// =============================================================================
// SPACING SYSTEM - Consistent spacing scale based on 8px grid
// =============================================================================

export const spacing = {
  // Base spacing scale - 8px grid system
  0: '0',           // 0px - No spacing
  1: '0.25rem',     // 4px - Minimal spacing
  2: '0.5rem',      // 8px - Small spacing
  3: '0.75rem',     // 12px - Medium small spacing
  4: '1rem',        // 16px - Base spacing unit
  5: '1.25rem',     // 20px - Medium spacing
  6: '1.5rem',      // 24px - Large spacing
  7: '1.75rem',     // 28px - Extra large spacing
  8: '2rem',        // 32px - Double base spacing
  9: '2.25rem',     // 36px - Large section spacing
  10: '2.5rem',     // 40px - Extra large section spacing
  11: '2.75rem',    // 44px - Large component spacing
  12: '3rem',       // 48px - Section spacing
  14: '3.5rem',     // 56px - Large section spacing
  16: '4rem',       // 64px - Page section spacing
  20: '5rem',       // 80px - Large page spacing
  24: '6rem',       // 96px - Extra large page spacing
  28: '7rem',       // 112px - Hero section spacing
  32: '8rem',       // 128px - Maximum spacing
  36: '9rem',       // 144px - Ultra large spacing
  40: '10rem',      // 160px - Maximum page spacing
  44: '11rem',      // 176px - Ultra large page spacing
  48: '12rem',      // 192px - Maximum section spacing
  52: '13rem',      // 208px - Ultra maximum spacing
  56: '14rem',      // 224px - Extreme spacing
  60: '15rem',      // 240px - Maximum extreme spacing
  64: '16rem',      // 256px - Ultra extreme spacing
  72: '18rem',      // 288px - Maximum ultra spacing
  80: '20rem',      // 320px - Extreme maximum spacing
  96: '24rem',      // 384px - Ultra extreme maximum spacing
};

// =============================================================================
// SHADOW SYSTEM - Consistent elevation and depth
// =============================================================================

export const shadows = {
  // Shadow scale for elevation hierarchy
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                    // Small shadow - subtle elevation
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Default shadow - standard cards
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',   // Medium shadow - elevated cards
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Large shadow - modals, dropdowns
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Extra large shadow - overlays
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',                           // 2XL shadow - maximum elevation
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',                          // Inner shadow - inset elements
  
  // Colored shadows for special effects
  colored: {
    primary: '0 4px 14px 0 rgb(14 165 233 / 0.25)',    // Primary blue shadow
    secondary: '0 4px 14px 0 rgb(192 38 211 / 0.25)',  // Secondary purple shadow
    success: '0 4px 14px 0 rgb(34 197 94 / 0.25)',     // Success green shadow
    error: '0 4px 14px 0 rgb(239 68 68 / 0.25)',       // Error red shadow
    warning: '0 4px 14px 0 rgb(245 158 11 / 0.25)',    // Warning amber shadow
  },
};

// =============================================================================
// BORDER RADIUS - Consistent corner radius values
// =============================================================================

export const borderRadius = {
  none: '0',           // No radius - sharp corners
  sm: '0.125rem',      // 2px - Small radius
  DEFAULT: '0.25rem',  // 4px - Default radius
  md: '0.375rem',      // 6px - Medium radius
  lg: '0.5rem',        // 8px - Large radius
  xl: '0.75rem',       // 12px - Extra large radius
  '2xl': '1rem',       // 16px - 2XL radius
  '3xl': '1.5rem',     // 24px - 3XL radius
  full: '9999px',      // Full radius - circular
};

// =============================================================================
// BREAKPOINTS - Responsive design breakpoints
// =============================================================================

export const breakpoints = {
  xs: '475px',    // Extra small devices - large phones
  sm: '640px',    // Small devices - small tablets
  md: '768px',    // Medium devices - tablets
  lg: '1024px',   // Large devices - small desktops
  xl: '1280px',   // Extra large devices - desktops
  '2xl': '1536px', // 2XL devices - large desktops
};

// =============================================================================
// Z-INDEX SCALE - Consistent layering system
// =============================================================================

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',       // Tooltips, dropdowns
  20: '20',       // Fixed headers, sticky elements
  30: '30',       // Overlays, modals
  40: '40',       // Notifications, alerts
  50: '50',       // Maximum z-index for critical overlays
};

// =============================================================================
// ANIMATION & TRANSITIONS - Consistent motion design
// =============================================================================

export const animation = {
  // Transition Durations
  duration: {
    75: '75ms',     // Ultra fast - micro interactions
    100: '100ms',   // Very fast - hover states
    150: '150ms',   // Fast - button interactions
    200: '200ms',   // Normal - standard transitions
    300: '300ms',   // Medium - modal animations
    500: '500ms',   // Slow - page transitions
    700: '700ms',   // Very slow - complex animations
    1000: '1000ms', // Ultra slow - special effects
  },
  
  // Easing Functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Common Transitions
  transition: {
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// =============================================================================
// COMPONENT TOKENS - Specific token assignments for common components
// =============================================================================

export const components = {
  // Button component tokens
  button: {
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    transition: animation.transition.all,
    sizes: {
      xs: {
        fontSize: typography.fontSize.xs,
        padding: `${spacing[1]} ${spacing[2]}`,
        height: '1.5rem',
      },
      sm: {
        fontSize: typography.fontSize.sm,
        padding: `${spacing[2]} ${spacing[3]}`,
        height: '2rem',
      },
      md: {
        fontSize: typography.fontSize.base,
        padding: `${spacing[2]} ${spacing[4]}`,
        height: '2.5rem',
      },
      lg: {
        fontSize: typography.fontSize.lg,
        padding: `${spacing[3]} ${spacing[6]}`,
        height: '3rem',
      },
      xl: {
        fontSize: typography.fontSize.xl,
        padding: `${spacing[4]} ${spacing[8]}`,
        height: '3.5rem',
      },
    },
  },
  
  // Card component tokens
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    shadow: shadows.DEFAULT,
    border: `1px solid ${colors.gray[200]}`,
    background: colors.semantic.surface,
  },
  
  // Input component tokens
  input: {
    borderRadius: borderRadius.md,
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    border: `1px solid ${colors.gray[300]}`,
    focusBorder: `1px solid ${colors.primary[500]}`,
    height: '2.5rem',
  },
};

// =============================================================================
// UTILITY FUNCTIONS - Helper functions for working with tokens
// =============================================================================

/**
 * Get a color value with optional opacity
 * @param color - Color path (e.g., 'primary.500')
 * @param opacity - Opacity value (0-1)
 */
export const getColor = (color: string, opacity?: number): string => {
  const [category, shade] = color.split('.');
  const colorValue = (colors as any)[category]?.[shade] || color;
  
  if (opacity !== undefined) {
    // Convert hex to rgb with opacity
    const hex = colorValue.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return colorValue;
};

/**
 * Get responsive spacing value
 * @param base - Base spacing value
 * @param breakpoint - Breakpoint modifier
 */
export const getResponsiveSpacing = (base: keyof typeof spacing, breakpoint?: 'sm' | 'md' | 'lg'): string => {
  const baseValue = spacing[base];
  
  if (!breakpoint) return baseValue;
  
  // Increase spacing on larger screens
  const multipliers = { sm: 1.25, md: 1.5, lg: 2 };
  const multiplier = multipliers[breakpoint];
  const numericValue = parseFloat(baseValue);
  const unit = baseValue.replace(numericValue.toString(), '');
  
  return `${numericValue * multiplier}${unit}`;
};

/**
 * Create a CSS custom property name
 * @param token - Token path (e.g., 'colors.primary.500')
 */
export const createCSSVar = (token: string): string => {
  return `--${token.replace(/\./g, '-')}`;
};

// Export all tokens as a single object for easy access
export const designTokens = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  zIndex,
  animation,
  components,
};

// Export type definitions for TypeScript support
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
export type Breakpoints = typeof breakpoints;
export type ZIndex = typeof zIndex;
export type Animation = typeof animation;
export type Components = typeof components;
export type DesignTokens = typeof designTokens;