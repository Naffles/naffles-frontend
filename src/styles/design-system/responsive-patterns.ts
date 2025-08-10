/**
 * Responsive Layout Patterns
 * 
 * Comprehensive responsive design patterns extracted from Figma designs.
 * Includes breakpoints, grid systems, layout patterns, and mobile-first approaches.
 */

import { breakpoints, spacing } from './tokens';

// =============================================================================
// BREAKPOINT SYSTEM
// =============================================================================

export const responsiveBreakpoints = {
  // Breakpoint values
  values: {
    xs: '475px',    // Extra small devices - large phones
    sm: '640px',    // Small devices - small tablets
    md: '768px',    // Medium devices - tablets
    lg: '1024px',   // Large devices - small desktops
    xl: '1280px',   // Extra large devices - desktops
    '2xl': '1536px', // 2XL devices - large desktops
  },
  
  // Media query helpers
  up: (breakpoint: keyof typeof breakpoints) => `@media (min-width: ${breakpoints[breakpoint]})`,
  down: (breakpoint: keyof typeof breakpoints) => {
    const bpValues = Object.values(breakpoints);
    const bpKeys = Object.keys(breakpoints);
    const index = bpKeys.indexOf(breakpoint);
    const prevValue = index > 0 ? bpValues[index - 1] : '0px';
    return `@media (max-width: calc(${breakpoints[breakpoint]} - 1px))`;
  },
  between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => 
    `@media (min-width: ${breakpoints[min]}) and (max-width: calc(${breakpoints[max]} - 1px))`,
  only: (breakpoint: keyof typeof breakpoints) => {
    const bpKeys = Object.keys(breakpoints) as (keyof typeof breakpoints)[];
    const index = bpKeys.indexOf(breakpoint);
    const nextBp = index < bpKeys.length - 1 ? bpKeys[index + 1] : null;
    
    if (nextBp) {
      return `@media (min-width: ${breakpoints[breakpoint]}) and (max-width: calc(${breakpoints[nextBp]} - 1px))`;
    } else {
      return `@media (min-width: ${breakpoints[breakpoint]})`;
    }
  },
};

// =============================================================================
// GRID SYSTEMS
// =============================================================================

export const gridSystems = {
  // 12-column grid system
  columns: {
    mobile: 4,    // 4 columns on mobile
    tablet: 8,    // 8 columns on tablet
    desktop: 12,  // 12 columns on desktop
  },
  
  // Grid container
  container: {
    maxWidth: {
      xs: '100%',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    padding: {
      xs: spacing[4],  // 16px
      sm: spacing[6],  // 24px
      md: spacing[8],  // 32px
      lg: spacing[12], // 48px
      xl: spacing[16], // 64px
    },
    margin: '0 auto',
  },
  
  // Grid gaps
  gap: {
    xs: spacing[4],  // 16px
    sm: spacing[6],  // 24px
    md: spacing[8],  // 32px
    lg: spacing[10], // 40px
    xl: spacing[12], // 48px
  },
  
  // Column spans
  spans: {
    1: '8.333333%',
    2: '16.666667%',
    3: '25%',
    4: '33.333333%',
    5: '41.666667%',
    6: '50%',
    7: '58.333333%',
    8: '66.666667%',
    9: '75%',
    10: '83.333333%',
    11: '91.666667%',
    12: '100%',
  },
};

// =============================================================================
// LAYOUT PATTERNS
// =============================================================================

export const layoutPatterns = {
  // Homepage layout pattern
  homepage: {
    mobile: {
      structure: 'single-column',
      navigation: 'hamburger-menu',
      hero: 'full-width-stacked',
      sections: 'vertical-stack',
      cards: 'single-column-grid',
      footer: 'stacked-links',
    },
    tablet: {
      structure: 'sidebar-content',
      navigation: 'collapsible-sidebar',
      hero: 'two-column-split',
      sections: 'two-column-grid',
      cards: 'two-column-grid',
      footer: 'multi-column-grid',
    },
    desktop: {
      structure: 'sidebar-main-aside',
      navigation: 'full-sidebar',
      hero: 'hero-with-sidebar',
      sections: 'multi-column-grid',
      cards: 'three-four-column-grid',
      footer: 'horizontal-layout',
    },
  },
  
  // Dashboard layout pattern
  dashboard: {
    mobile: {
      structure: 'single-column',
      navigation: 'bottom-tab-bar',
      header: 'compact-header',
      content: 'vertical-stack',
      widgets: 'single-column',
    },
    tablet: {
      structure: 'sidebar-content',
      navigation: 'collapsible-sidebar',
      header: 'full-header',
      content: 'two-column-grid',
      widgets: 'two-column-grid',
    },
    desktop: {
      structure: 'sidebar-main-aside',
      navigation: 'persistent-sidebar',
      header: 'full-header-with-breadcrumbs',
      content: 'multi-column-grid',
      widgets: 'dashboard-grid',
    },
  },
  
  // Content listing pattern
  listing: {
    mobile: {
      structure: 'single-column',
      filters: 'collapsible-drawer',
      content: 'vertical-list',
      pagination: 'load-more-button',
    },
    tablet: {
      structure: 'sidebar-content',
      filters: 'sidebar-filters',
      content: 'two-column-grid',
      pagination: 'numbered-pagination',
    },
    desktop: {
      structure: 'filters-content-aside',
      filters: 'persistent-sidebar',
      content: 'three-four-column-grid',
      pagination: 'full-pagination',
    },
  },
  
  // Detail page pattern
  detail: {
    mobile: {
      structure: 'single-column',
      header: 'compact-header',
      content: 'vertical-stack',
      sidebar: 'bottom-sheet',
      actions: 'sticky-bottom-bar',
    },
    tablet: {
      structure: 'main-sidebar',
      header: 'full-header',
      content: 'two-column-layout',
      sidebar: 'right-sidebar',
      actions: 'inline-actions',
    },
    desktop: {
      structure: 'main-sidebar-aside',
      header: 'full-header-with-breadcrumbs',
      content: 'main-content-area',
      sidebar: 'persistent-sidebar',
      actions: 'header-actions',
    },
  },
};

// =============================================================================
// COMPONENT RESPONSIVE PATTERNS
// =============================================================================

export const componentResponsive = {
  // Navigation patterns
  navigation: {
    mobile: {
      type: 'hamburger-menu',
      position: 'fixed-top',
      overlay: 'full-screen',
      animation: 'slide-in-from-left',
    },
    tablet: {
      type: 'collapsible-sidebar',
      position: 'fixed-left',
      width: '16rem',
      collapsedWidth: '4rem',
    },
    desktop: {
      type: 'persistent-sidebar',
      position: 'fixed-left',
      width: '16rem',
      persistent: true,
    },
  },
  
  // Card grid patterns
  cardGrid: {
    mobile: {
      columns: 1,
      gap: spacing[4],
      padding: spacing[4],
    },
    tablet: {
      columns: 2,
      gap: spacing[6],
      padding: spacing[6],
    },
    desktop: {
      columns: 3,
      gap: spacing[8],
      padding: spacing[8],
      maxColumns: 4,
    },
  },
  
  // Modal patterns
  modal: {
    mobile: {
      width: '100vw',
      height: '100vh',
      borderRadius: '0',
      position: 'fixed',
      top: '0',
      left: '0',
    },
    tablet: {
      width: '90vw',
      maxWidth: '32rem',
      height: 'auto',
      maxHeight: '90vh',
      borderRadius: '0.5rem',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    desktop: {
      width: 'auto',
      minWidth: '24rem',
      maxWidth: '48rem',
      height: 'auto',
      maxHeight: '90vh',
      borderRadius: '0.5rem',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  
  // Table patterns
  table: {
    mobile: {
      display: 'block',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      cardLayout: true, // Convert to card layout on mobile
    },
    tablet: {
      display: 'table',
      overflowX: 'auto',
      responsiveColumns: true, // Hide less important columns
    },
    desktop: {
      display: 'table',
      overflowX: 'visible',
      allColumns: true, // Show all columns
    },
  },
  
  // Form patterns
  form: {
    mobile: {
      layout: 'single-column',
      fieldSpacing: spacing[4],
      buttonLayout: 'full-width-stacked',
    },
    tablet: {
      layout: 'two-column',
      fieldSpacing: spacing[6],
      buttonLayout: 'inline-right-aligned',
    },
    desktop: {
      layout: 'multi-column',
      fieldSpacing: spacing[6],
      buttonLayout: 'inline-right-aligned',
      maxWidth: '48rem',
    },
  },
};

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

export const responsiveUtils = {
  // Hide/show utilities
  visibility: {
    hideOnMobile: {
      [responsiveBreakpoints.down('md')]: {
        display: 'none',
      },
    },
    hideOnTablet: {
      [responsiveBreakpoints.between('md', 'lg')]: {
        display: 'none',
      },
    },
    hideOnDesktop: {
      [responsiveBreakpoints.up('lg')]: {
        display: 'none',
      },
    },
    showOnMobile: {
      display: 'block',
      [responsiveBreakpoints.up('md')]: {
        display: 'none',
      },
    },
    showOnTablet: {
      display: 'none',
      [responsiveBreakpoints.between('md', 'lg')]: {
        display: 'block',
      },
    },
    showOnDesktop: {
      display: 'none',
      [responsiveBreakpoints.up('lg')]: {
        display: 'block',
      },
    },
  },
  
  // Spacing utilities
  spacing: {
    responsive: (mobile: string, tablet?: string, desktop?: string) => ({
      padding: mobile,
      [responsiveBreakpoints.up('md')]: {
        padding: tablet || mobile,
      },
      [responsiveBreakpoints.up('lg')]: {
        padding: desktop || tablet || mobile,
      },
    }),
    
    responsiveMargin: (mobile: string, tablet?: string, desktop?: string) => ({
      margin: mobile,
      [responsiveBreakpoints.up('md')]: {
        margin: tablet || mobile,
      },
      [responsiveBreakpoints.up('lg')]: {
        margin: desktop || tablet || mobile,
      },
    }),
  },
  
  // Typography utilities
  typography: {
    responsive: (mobileSize: string, tabletSize?: string, desktopSize?: string) => ({
      fontSize: mobileSize,
      [responsiveBreakpoints.up('md')]: {
        fontSize: tabletSize || mobileSize,
      },
      [responsiveBreakpoints.up('lg')]: {
        fontSize: desktopSize || tabletSize || mobileSize,
      },
    }),
  },
  
  // Container utilities
  container: {
    responsive: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: spacing[4],
      paddingRight: spacing[4],
      
      [responsiveBreakpoints.up('sm')]: {
        maxWidth: gridSystems.container.maxWidth.sm,
        paddingLeft: spacing[6],
        paddingRight: spacing[6],
      },
      
      [responsiveBreakpoints.up('md')]: {
        maxWidth: gridSystems.container.maxWidth.md,
        paddingLeft: spacing[8],
        paddingRight: spacing[8],
      },
      
      [responsiveBreakpoints.up('lg')]: {
        maxWidth: gridSystems.container.maxWidth.lg,
        paddingLeft: spacing[12],
        paddingRight: spacing[12],
      },
      
      [responsiveBreakpoints.up('xl')]: {
        maxWidth: gridSystems.container.maxWidth.xl,
        paddingLeft: spacing[16],
        paddingRight: spacing[16],
      },
      
      [responsiveBreakpoints.up('2xl')]: {
        maxWidth: gridSystems.container.maxWidth['2xl'],
      },
    },
  },
};

// =============================================================================
// MOBILE-FIRST APPROACH
// =============================================================================

export const mobileFirst = {
  // Design principles
  principles: {
    contentFirst: 'Prioritize essential content and functionality',
    progressiveEnhancement: 'Add features and complexity for larger screens',
    touchFriendly: 'Design for touch interactions with appropriate target sizes',
    performance: 'Optimize for slower connections and limited resources',
    accessibility: 'Ensure accessibility across all device types',
  },
  
  // Implementation strategy
  strategy: {
    baseStyles: 'Define mobile styles as the default',
    mediaQueries: 'Use min-width media queries to enhance for larger screens',
    contentStrategy: 'Show essential content first, progressive disclosure for details',
    navigationStrategy: 'Prioritize primary navigation, hide secondary options',
    imageStrategy: 'Serve appropriate image sizes for device capabilities',
  },
  
  // Touch targets
  touchTargets: {
    minimum: '44px', // iOS and Android minimum
    recommended: '48px', // Material Design recommendation
    comfortable: '56px', // Comfortable touch target
    spacing: '8px', // Minimum spacing between touch targets
  },
  
  // Performance considerations
  performance: {
    criticalCSS: 'Inline critical CSS for above-the-fold content',
    lazyLoading: 'Lazy load images and non-critical content',
    codesplitting: 'Split JavaScript bundles by route/feature',
    compression: 'Use appropriate image formats and compression',
    caching: 'Implement aggressive caching strategies',
  },
};

// =============================================================================
// RESPONSIVE DESIGN PATTERNS FOR NAFFLES PLATFORM
// =============================================================================

export const nafflesResponsive = {
  // Homepage specific patterns
  homepage: {
    hero: {
      mobile: 'single-column-centered',
      tablet: 'two-column-split',
      desktop: 'hero-with-sidebar-navigation',
    },
    
    raffleSliders: {
      mobile: 'single-card-carousel',
      tablet: 'two-card-carousel',
      desktop: 'three-four-card-carousel',
    },
    
    gameShowcase: {
      mobile: 'vertical-stack',
      tablet: 'two-column-grid',
      desktop: 'three-column-grid-with-featured',
    },
  },
  
  // Gaming interface patterns
  gaming: {
    gameArea: {
      mobile: 'full-screen-game',
      tablet: 'game-with-sidebar-controls',
      desktop: 'game-with-dual-sidebars',
    },
    
    controls: {
      mobile: 'bottom-sheet-controls',
      tablet: 'sidebar-controls',
      desktop: 'persistent-sidebar-controls',
    },
    
    history: {
      mobile: 'modal-overlay',
      tablet: 'slide-out-panel',
      desktop: 'persistent-sidebar',
    },
  },
  
  // Community patterns
  community: {
    listing: {
      mobile: 'single-column-cards',
      tablet: 'two-column-cards',
      desktop: 'three-column-cards-with-filters',
    },
    
    detail: {
      mobile: 'single-column-with-tabs',
      tablet: 'main-content-with-sidebar',
      desktop: 'main-content-with-dual-sidebars',
    },
  },
  
  // Admin patterns
  admin: {
    dashboard: {
      mobile: 'single-column-widgets',
      tablet: 'two-column-widgets',
      desktop: 'dashboard-grid-layout',
    },
    
    tables: {
      mobile: 'card-based-layout',
      tablet: 'horizontal-scroll-table',
      desktop: 'full-table-with-filters',
    },
    
    forms: {
      mobile: 'single-column-forms',
      tablet: 'two-column-forms',
      desktop: 'multi-column-forms-with-sidebar',
    },
  },
};

// Export all responsive patterns
export const responsivePatterns = {
  breakpoints: responsiveBreakpoints,
  grid: gridSystems,
  layouts: layoutPatterns,
  components: componentResponsive,
  utils: responsiveUtils,
  mobileFirst,
  naffles: nafflesResponsive,
};

export default responsivePatterns;