/**
 * Theme Configurations - Light and dark theme definitions
 * 
 * This file contains theme configurations that extend the base design tokens
 * to support light and dark mode variations throughout the application.
 */

import { colors } from './tokens';

// =============================================================================
// THEME DEFINITIONS
// =============================================================================

export const lightTheme = {
  // Background colors
  background: {
    primary: colors.semantic.background,     // Main page background
    secondary: colors.gray[50],              // Secondary background areas
    tertiary: colors.gray[100],              // Tertiary background areas
    elevated: colors.semantic.surface,       // Elevated surfaces (cards, modals)
    overlay: 'rgba(0, 0, 0, 0.5)',          // Overlay backgrounds
  },
  
  // Text colors
  text: {
    primary: colors.semantic.text.primary,   // Primary text color
    secondary: colors.semantic.text.secondary, // Secondary text color
    tertiary: colors.semantic.text.tertiary, // Tertiary text color
    inverse: colors.semantic.text.inverse,   // Text on dark backgrounds
    disabled: colors.gray[400],              // Disabled text color
    placeholder: colors.gray[500],           // Placeholder text color
  },
  
  // Border colors
  border: {
    primary: colors.semantic.border,         // Primary border color
    secondary: colors.gray[300],             // Secondary border color
    focus: colors.primary[500],              // Focus border color
    error: colors.error[500],                // Error border color
    success: colors.success[500],            // Success border color
    warning: colors.warning[500],            // Warning border color
  },
  
  // Interactive colors
  interactive: {
    primary: colors.primary[500],            // Primary interactive color
    primaryHover: colors.primary[600],       // Primary hover state
    primaryActive: colors.primary[700],      // Primary active state
    secondary: colors.gray[200],             // Secondary interactive color
    secondaryHover: colors.gray[300],        // Secondary hover state
    secondaryActive: colors.gray[400],       // Secondary active state
  },
  
  // Status colors
  status: {
    success: colors.success[500],            // Success color
    successBackground: colors.success[50],   // Success background
    error: colors.error[500],                // Error color
    errorBackground: colors.error[50],       // Error background
    warning: colors.warning[500],            // Warning color
    warningBackground: colors.warning[50],   // Warning background
    info: colors.info[500],                  // Info color
    infoBackground: colors.info[50],         // Info background
  },
};

export const darkTheme = {
  // Background colors
  background: {
    primary: colors.gray[900],               // Main page background
    secondary: colors.gray[800],             // Secondary background areas
    tertiary: colors.gray[700],              // Tertiary background areas
    elevated: colors.gray[800],              // Elevated surfaces (cards, modals)
    overlay: 'rgba(0, 0, 0, 0.7)',          // Overlay backgrounds
  },
  
  // Text colors
  text: {
    primary: colors.gray[50],                // Primary text color
    secondary: colors.gray[300],             // Secondary text color
    tertiary: colors.gray[400],              // Tertiary text color
    inverse: colors.gray[900],               // Text on light backgrounds
    disabled: colors.gray[600],              // Disabled text color
    placeholder: colors.gray[500],           // Placeholder text color
  },
  
  // Border colors
  border: {
    primary: colors.gray[700],               // Primary border color
    secondary: colors.gray[600],             // Secondary border color
    focus: colors.primary[400],              // Focus border color
    error: colors.error[400],                // Error border color
    success: colors.success[400],            // Success border color
    warning: colors.warning[400],            // Warning border color
  },
  
  // Interactive colors
  interactive: {
    primary: colors.primary[400],            // Primary interactive color
    primaryHover: colors.primary[300],       // Primary hover state
    primaryActive: colors.primary[200],      // Primary active state
    secondary: colors.gray[700],             // Secondary interactive color
    secondaryHover: colors.gray[600],        // Secondary hover state
    secondaryActive: colors.gray[500],       // Secondary active state
  },
  
  // Status colors
  status: {
    success: colors.success[400],            // Success color
    successBackground: colors.success[900],  // Success background
    error: colors.error[400],                // Error color
    errorBackground: colors.error[900],      // Error background
    warning: colors.warning[400],            // Warning color
    warningBackground: colors.warning[900],  // Warning background
    info: colors.info[400],                  // Info color
    infoBackground: colors.info[900],        // Info background
  },
};

// =============================================================================
// THEME UTILITIES
// =============================================================================

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

/**
 * Get theme configuration by mode
 * @param mode - Theme mode ('light' or 'dark')
 * @returns Theme configuration object
 */
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Create CSS custom properties for a theme
 * @param theme - Theme configuration object
 * @param prefix - Prefix for CSS variables
 * @returns Object with CSS custom properties
 */
export const createThemeCSSVariables = (
  theme: Theme,
  prefix: string = 'theme'
): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  const processThemeObject = (obj: Record<string, any>, path: string[] = []) => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processThemeObject(value, currentPath);
      } else {
        const varName = `--${prefix}-${currentPath.join('-')}`;
        cssVars[varName] = String(value);
      }
    });
  };
  
  processThemeObject(theme);
  return cssVars;
};

/**
 * Generate CSS string with theme variables
 * @param lightTheme - Light theme configuration
 * @param darkTheme - Dark theme configuration
 * @returns CSS string with theme variables
 */
export const generateThemeCSS = (
  lightTheme: Theme,
  darkTheme: Theme
): string => {
  const lightVars = createThemeCSSVariables(lightTheme);
  const darkVars = createThemeCSSVariables(darkTheme);
  
  const lightCSSString = Object.entries(lightVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  
  const darkCSSString = Object.entries(darkVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  
  return `
/* Light theme (default) */
:root {
${lightCSSString}
}

/* Dark theme (system preference) */
@media (prefers-color-scheme: dark) {
  :root {
${darkCSSString}
  }
}

/* Explicit theme classes */
[data-theme="light"] {
${lightCSSString}
}

[data-theme="dark"] {
${darkCSSString}
}
  `.trim();
};

// =============================================================================
// THEME CONTEXT VALUES
// =============================================================================

/**
 * Default theme context value for React context
 */
export const defaultThemeContext = {
  mode: 'light' as ThemeMode,
  theme: lightTheme,
  toggleTheme: () => {},
  setTheme: (mode: ThemeMode) => {},
};

// =============================================================================
// COMPONENT THEME OVERRIDES
// =============================================================================

/**
 * Component-specific theme overrides
 * These can be used to customize specific components for different themes
 */
export const componentThemes = {
  button: {
    light: {
      primary: {
        background: colors.primary[500],
        color: colors.semantic.text.inverse,
        hover: colors.primary[600],
        active: colors.primary[700],
      },
      secondary: {
        background: 'transparent',
        color: colors.primary[500],
        border: colors.primary[500],
        hover: colors.primary[50],
        active: colors.primary[100],
      },
    },
    dark: {
      primary: {
        background: colors.primary[400],
        color: colors.gray[900],
        hover: colors.primary[300],
        active: colors.primary[200],
      },
      secondary: {
        background: 'transparent',
        color: colors.primary[400],
        border: colors.primary[400],
        hover: colors.primary[900],
        active: colors.primary[800],
      },
    },
  },
  
  card: {
    light: {
      background: colors.semantic.surface,
      border: colors.gray[200],
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    dark: {
      background: colors.gray[800],
      border: colors.gray[700],
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    },
  },
  
  input: {
    light: {
      background: colors.semantic.background,
      border: colors.gray[300],
      focus: colors.primary[500],
      placeholder: colors.gray[500],
      text: colors.semantic.text.primary,
    },
    dark: {
      background: colors.gray[800],
      border: colors.gray[600],
      focus: colors.primary[400],
      placeholder: colors.gray[400],
      text: colors.gray[50],
    },
  },
};

// =============================================================================
// THEME PRESETS
// =============================================================================

/**
 * Predefined theme presets for different use cases
 */
export const themePresets = {
  // Default Naffles theme
  default: {
    light: lightTheme,
    dark: darkTheme,
  },
  
  // High contrast theme for accessibility
  highContrast: {
    light: {
      ...lightTheme,
      text: {
        ...lightTheme.text,
        primary: colors.gray[900],
        secondary: colors.gray[800],
      },
      border: {
        ...lightTheme.border,
        primary: colors.gray[900],
        secondary: colors.gray[800],
      },
    },
    dark: {
      ...darkTheme,
      text: {
        ...darkTheme.text,
        primary: colors.gray[50],
        secondary: colors.gray[100],
      },
      border: {
        ...darkTheme.border,
        primary: colors.gray[50],
        secondary: colors.gray[100],
      },
    },
  },
  
  // Reduced motion theme
  reducedMotion: {
    light: lightTheme,
    dark: darkTheme,
    // This would be combined with CSS that respects prefers-reduced-motion
  },
};

// Export theme configurations
export { lightTheme as light, darkTheme as dark };
export default { light: lightTheme, dark: darkTheme };