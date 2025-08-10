/**
 * Design System Utilities - Helper functions for working with design tokens
 * 
 * This file contains utility functions that make it easier to work with
 * design tokens in components and provide consistent styling patterns.
 */

import { colors, spacing, typography, shadows, borderRadius, breakpoints } from './tokens';

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (e.g., '#ff0000')
 * @returns RGB object with r, g, b values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Create RGBA color string from hex with opacity
 * @param hex - Hex color string
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 */
export const hexToRgba = (hex: string, opacity: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

/**
 * Get color with opacity from design tokens
 * @param colorPath - Path to color in tokens (e.g., 'primary.500')
 * @param opacity - Opacity value (0-1)
 * @returns Color string with opacity
 */
export const getColorWithOpacity = (colorPath: string, opacity: number): string => {
  const [category, shade] = colorPath.split('.');
  const colorValue = (colors as any)[category]?.[shade];
  
  if (!colorValue) {
    console.warn(`Color not found: ${colorPath}`);
    return colorPath;
  }
  
  return hexToRgba(colorValue, opacity);
};

/**
 * Get contrasting text color (black or white) for a given background color
 * @param backgroundColor - Background color hex string
 * @returns 'black' or 'white' for optimal contrast
 */
export const getContrastingTextColor = (backgroundColor: string): string => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'black';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
};

// =============================================================================
// SPACING UTILITIES
// =============================================================================

/**
 * Get spacing value by key
 * @param key - Spacing key from design tokens
 * @returns Spacing value as string
 */
export const getSpacing = (key: keyof typeof spacing): string => {
  return spacing[key];
};

/**
 * Create responsive spacing values
 * @param base - Base spacing key
 * @param multipliers - Multipliers for different breakpoints
 * @returns Object with responsive spacing values
 */
export const createResponsiveSpacing = (
  base: keyof typeof spacing,
  multipliers: { sm?: number; md?: number; lg?: number; xl?: number } = {}
) => {
  const baseValue = spacing[base];
  const numericValue = parseFloat(baseValue);
  const unit = baseValue.replace(numericValue.toString(), '');
  
  return {
    base: baseValue,
    sm: multipliers.sm ? `${numericValue * multipliers.sm}${unit}` : baseValue,
    md: multipliers.md ? `${numericValue * multipliers.md}${unit}` : baseValue,
    lg: multipliers.lg ? `${numericValue * multipliers.lg}${unit}` : baseValue,
    xl: multipliers.xl ? `${numericValue * multipliers.xl}${unit}` : baseValue,
  };
};

// =============================================================================
// TYPOGRAPHY UTILITIES
// =============================================================================

/**
 * Create typography styles object
 * @param size - Font size key
 * @param weight - Font weight key
 * @param lineHeight - Line height key
 * @returns Typography styles object
 */
export const createTypographyStyles = (
  size: keyof typeof typography.fontSize,
  weight: keyof typeof typography.fontWeight = 'normal',
  lineHeight: keyof typeof typography.lineHeight = 'normal'
) => {
  return {
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
    lineHeight: typography.lineHeight[lineHeight],
    fontFamily: typography.fontFamily.sans.join(', '),
  };
};

/**
 * Get responsive typography styles
 * @param config - Configuration object with breakpoint-specific typography
 * @returns Object with responsive typography styles
 */
export const createResponsiveTypography = (config: {
  base: { size: keyof typeof typography.fontSize; weight?: keyof typeof typography.fontWeight };
  sm?: { size: keyof typeof typography.fontSize; weight?: keyof typeof typography.fontWeight };
  md?: { size: keyof typeof typography.fontSize; weight?: keyof typeof typography.fontWeight };
  lg?: { size: keyof typeof typography.fontSize; weight?: keyof typeof typography.fontWeight };
}) => {
  return {
    base: createTypographyStyles(config.base.size, config.base.weight),
    sm: config.sm ? createTypographyStyles(config.sm.size, config.sm.weight) : undefined,
    md: config.md ? createTypographyStyles(config.md.size, config.md.weight) : undefined,
    lg: config.lg ? createTypographyStyles(config.lg.size, config.lg.weight) : undefined,
  };
};

// =============================================================================
// SHADOW UTILITIES
// =============================================================================

/**
 * Create custom shadow with color
 * @param shadowKey - Shadow key from design tokens
 * @param color - Custom color for the shadow
 * @returns Custom shadow string
 */
export const createColoredShadow = (
  shadowKey: keyof typeof shadows,
  color: string
): string => {
  const baseShadow = shadows[shadowKey];
  if (baseShadow === 'none' || typeof baseShadow !== 'string') return 'none';
  
  // Replace the default shadow color with the custom color
  return baseShadow.replace(/rgb\(0 0 0 \/ 0\.\d+\)/g, color);
};

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

/**
 * Create media query string for breakpoint
 * @param breakpoint - Breakpoint key
 * @returns Media query string
 */
export const createMediaQuery = (breakpoint: keyof typeof breakpoints): string => {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
};

/**
 * Create responsive styles object
 * @param styles - Object with breakpoint-specific styles
 * @returns Object with media query styles
 */
export const createResponsiveStyles = (styles: {
  base?: Record<string, any>;
  xs?: Record<string, any>;
  sm?: Record<string, any>;
  md?: Record<string, any>;
  lg?: Record<string, any>;
  xl?: Record<string, any>;
  '2xl'?: Record<string, any>;
}) => {
  const responsiveStyles: Record<string, any> = {};
  
  if (styles.base) {
    Object.assign(responsiveStyles, styles.base);
  }
  
  Object.entries(styles).forEach(([breakpoint, breakpointStyles]) => {
    if (breakpoint !== 'base' && breakpointStyles) {
      const mediaQuery = createMediaQuery(breakpoint as keyof typeof breakpoints);
      responsiveStyles[mediaQuery] = breakpointStyles;
    }
  });
  
  return responsiveStyles;
};

// =============================================================================
// CSS VARIABLE UTILITIES
// =============================================================================

/**
 * Create CSS custom properties from design tokens
 * @param tokenObject - Object containing design tokens
 * @param prefix - Prefix for CSS variables
 * @returns Object with CSS custom properties
 */
export const createCSSVariables = (
  tokenObject: Record<string, any>,
  prefix: string = 'naffles'
): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  const processObject = (obj: Record<string, any>, path: string[] = []) => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processObject(value, currentPath);
      } else {
        const varName = `--${prefix}-${currentPath.join('-')}`;
        cssVars[varName] = String(value);
      }
    });
  };
  
  processObject(tokenObject);
  return cssVars;
};

/**
 * Generate CSS custom properties string
 * @param tokens - Design tokens object
 * @returns CSS string with custom properties
 */
export const generateCSSVariables = (tokens: Record<string, any>): string => {
  const cssVars = createCSSVariables(tokens);
  
  const cssString = Object.entries(cssVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  
  return `:root {\n${cssString}\n}`;
};

// =============================================================================
// COMPONENT STYLE UTILITIES
// =============================================================================

/**
 * Create button styles based on variant and size
 * @param variant - Button variant
 * @param size - Button size
 * @returns Button styles object
 */
export const createButtonStyles = (
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' = 'primary',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => {
  const baseStyles = {
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  };
  
  const sizeStyles = {
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
  };
  
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.semantic.text.inverse,
      '&:hover': {
        backgroundColor: colors.primary[600],
      },
      '&:active': {
        backgroundColor: colors.primary[700],
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
      '&:hover': {
        backgroundColor: colors.primary[50],
      },
      '&:active': {
        backgroundColor: colors.primary[100],
      },
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: colors.gray[700],
      '&:hover': {
        backgroundColor: colors.gray[100],
      },
      '&:active': {
        backgroundColor: colors.gray[200],
      },
    },
    danger: {
      backgroundColor: colors.error[500],
      color: colors.semantic.text.inverse,
      '&:hover': {
        backgroundColor: colors.error[600],
      },
      '&:active': {
        backgroundColor: colors.error[700],
      },
    },
    success: {
      backgroundColor: colors.success[500],
      color: colors.semantic.text.inverse,
      '&:hover': {
        backgroundColor: colors.success[600],
      },
      '&:active': {
        backgroundColor: colors.success[700],
      },
    },
  };
  
  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

/**
 * Create card styles based on variant
 * @param variant - Card variant
 * @returns Card styles object
 */
export const createCardStyles = (
  variant: 'default' | 'elevated' | 'outlined' | 'interactive' = 'default'
) => {
  const baseStyles = {
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    backgroundColor: colors.semantic.surface,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  };
  
  const variantStyles = {
    default: {
      boxShadow: shadows.DEFAULT,
      border: `1px solid ${colors.gray[200]}`,
    },
    elevated: {
      boxShadow: shadows.lg,
      border: 'none',
    },
    outlined: {
      boxShadow: 'none',
      border: `1px solid ${colors.gray[300]}`,
    },
    interactive: {
      boxShadow: shadows.DEFAULT,
      border: `1px solid ${colors.gray[200]}`,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: shadows.lg,
        transform: 'translateY(-2px)',
      },
    },
  };
  
  return {
    ...baseStyles,
    ...variantStyles[variant],
  };
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate if a color exists in the design tokens
 * @param colorPath - Path to color (e.g., 'primary.500')
 * @returns Boolean indicating if color exists
 */
export const isValidColor = (colorPath: string): boolean => {
  const [category, shade] = colorPath.split('.');
  return !!(colors as any)[category]?.[shade];
};

/**
 * Validate if a spacing value exists in the design tokens
 * @param spacingKey - Spacing key
 * @returns Boolean indicating if spacing exists
 */
export const isValidSpacing = (spacingKey: string): boolean => {
  return spacingKey in spacing;
};

/**
 * Get all available colors as an array
 * @returns Array of color paths
 */
export const getAllColors = (): string[] => {
  const colorPaths: string[] = [];
  
  Object.entries(colors).forEach(([category, shades]) => {
    if (typeof shades === 'object' && shades !== null) {
      Object.keys(shades).forEach(shade => {
        colorPaths.push(`${category}.${shade}`);
      });
    }
  });
  
  return colorPaths;
};

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Create theme-aware color value
 * @param lightColor - Color for light theme
 * @param darkColor - Color for dark theme
 * @returns CSS custom property or color value
 */
export const createThemeColor = (lightColor: string, darkColor: string): string => {
  // Use CSS custom property that can be overridden by theme
  return `var(--theme-color, ${lightColor})`;
};

/**
 * Generate theme CSS variables
 * @param theme - Theme configuration object
 * @returns CSS string with theme variables
 */
export const generateThemeVariables = (theme: {
  light: Record<string, string>;
  dark: Record<string, string>;
}): string => {
  const lightVars = Object.entries(theme.light)
    .map(([key, value]) => `  --theme-${key}: ${value};`)
    .join('\n');
  
  const darkVars = Object.entries(theme.dark)
    .map(([key, value]) => `  --theme-${key}: ${value};`)
    .join('\n');
  
  return `
:root {
${lightVars}
}

@media (prefers-color-scheme: dark) {
  :root {
${darkVars}
  }
}

[data-theme="light"] {
${lightVars}
}

[data-theme="dark"] {
${darkVars}
}
  `.trim();
};