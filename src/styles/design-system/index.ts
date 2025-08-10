/**
 * Design System Index - Central export for all design system tokens and utilities
 * 
 * This file provides a single entry point for importing design system tokens,
 * utilities, and type definitions throughout the application.
 */

// Export all design tokens
export * from './tokens';

// Export utility functions
export * from './utils';

// Export theme configurations
export * from './themes';

// Export component specifications
export * from './components';
export * from './component-specs';

// Export responsive patterns
export * from './responsive-patterns';

// Re-export commonly used tokens for convenience
export {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
  designTokens,
} from './tokens';

// Re-export utility functions
export {
  getColor,
  getResponsiveSpacing,
  createCSSVar,
  hexToRgb,
  hexToRgba,
  getColorWithOpacity,
  createTypographyStyles,
  createResponsiveSpacing,
  createButtonStyles,
  createCardStyles,
} from './utils';

// Re-export component specifications
export {
  componentSpecs,
  getComponentSpec,
  getComponentVariant,
  getComponentSize,
  createComponentStyles,
} from './component-specs';

// Re-export responsive patterns
export {
  responsivePatterns,
  responsiveBreakpoints,
  gridSystems,
  layoutPatterns,
  componentResponsive,
  responsiveUtils,
  mobileFirst,
  nafflesResponsive,
} from './responsive-patterns';

// Re-export theme utilities
export {
  lightTheme,
  darkTheme,
  getTheme,
  createThemeCSSVariables,
  generateThemeCSS,
  componentThemes,
  themePresets,
} from './themes';