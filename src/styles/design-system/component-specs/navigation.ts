/**
 * Navigation Component Specification
 * 
 * Comprehensive specification for navigation components based on Figma designs.
 * Includes header navigation, sidebar navigation, breadcrumbs, and mobile patterns.
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens';

export const navigationSpec = {
  // Header navigation specifications
  header: {
    base: {
      height: '4rem',
      backgroundColor: colors.semantic.background,
      borderBottom: `1px solid ${colors.gray[200]}`,
      padding: `0 ${spacing[6]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: shadows.sm,
    },
    
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.semantic.text.primary,
      textDecoration: 'none',
    },
    
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[6],
      
      // Hide on mobile
      '@media (max-width: 767px)': {
        display: 'none',
      },
    },
    
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
    },
    
    mobileToggle: {
      display: 'none',
      padding: spacing[2],
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      
      '@media (max-width: 767px)': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },

  // Navigation links specifications
  navLink: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
      textDecoration: 'none',
      borderRadius: borderRadius.md,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    
    states: {
      hover: {
        backgroundColor: colors.gray[100],
        color: colors.gray[900],
      },
      active: {
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
        fontWeight: typography.fontWeight.semibold,
      },
      focus: {
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      disabled: {
        color: colors.gray[400],
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
    
    icon: {
      width: '1.25rem',
      height: '1.25rem',
      flexShrink: 0,
    },
  },

  // Sidebar navigation specifications
  sidebar: {
    base: {
      width: '16rem',
      height: '100vh',
      backgroundColor: colors.semantic.surface,
      borderRight: `1px solid ${colors.gray[200]}`,
      padding: spacing[6],
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 30,
      overflowY: 'auto',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    collapsed: {
      width: '4rem',
      padding: spacing[4],
    },
    
    mobile: {
      transform: 'translateX(-100%)',
      
      '&.open': {
        transform: 'translateX(0)',
      },
    },
    
    header: {
      marginBottom: spacing[8],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[200]}`,
    },
    
    section: {
      marginBottom: spacing[6],
    },
    
    sectionTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      color: colors.gray[500],
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
      marginBottom: spacing[3],
      padding: `0 ${spacing[4]}`,
    },
    
    nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[1],
    },
  },

  // Sidebar navigation link specifications
  sidebarLink: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
      textDecoration: 'none',
      borderRadius: borderRadius.md,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      width: '100%',
    },
    
    states: {
      hover: {
        backgroundColor: colors.gray[100],
        color: colors.gray[900],
      },
      active: {
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
        fontWeight: typography.fontWeight.semibold,
        borderLeft: `3px solid ${colors.primary[500]}`,
      },
      focus: {
        outline: 'none',
        boxShadow: `0 0 0 2px ${colors.primary[200]}`,
      },
    },
    
    icon: {
      width: '1.25rem',
      height: '1.25rem',
      flexShrink: 0,
    },
    
    badge: {
      marginLeft: 'auto',
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      backgroundColor: colors.gray[200],
      color: colors.gray[700],
      padding: `${spacing[1]} ${spacing[2]}`,
      borderRadius: borderRadius.full,
      minWidth: '1.5rem',
      textAlign: 'center',
    },
  },

  // Breadcrumb specifications
  breadcrumb: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
      fontSize: typography.fontSize.sm,
      color: colors.gray[600],
      marginBottom: spacing[6],
    },
    
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
    },
    
    link: {
      color: colors.gray[600],
      textDecoration: 'none',
      transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&:hover': {
        color: colors.primary[600],
        textDecoration: 'underline',
      },
    },
    
    current: {
      color: colors.semantic.text.primary,
      fontWeight: typography.fontWeight.medium,
    },
    
    separator: {
      color: colors.gray[400],
      fontSize: typography.fontSize.sm,
    },
  },

  // Tab navigation specifications
  tabs: {
    base: {
      display: 'flex',
      borderBottom: `1px solid ${colors.gray[200]}`,
      marginBottom: spacing[6],
    },
    
    tab: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[600],
      textDecoration: 'none',
      borderBottom: '2px solid transparent',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    
    tabStates: {
      hover: {
        color: colors.gray[800],
        borderBottomColor: colors.gray[300],
      },
      active: {
        color: colors.primary[600],
        borderBottomColor: colors.primary[500],
        fontWeight: typography.fontWeight.semibold,
      },
      focus: {
        outline: 'none',
        boxShadow: `0 0 0 2px ${colors.primary[200]}`,
      },
      disabled: {
        color: colors.gray[400],
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },

  // Pagination specifications
  pagination: {
    base: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[2],
      marginTop: spacing[8],
    },
    
    item: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.5rem',
      height: '2.5rem',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
      textDecoration: 'none',
      borderRadius: borderRadius.md,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    
    itemStates: {
      hover: {
        backgroundColor: colors.gray[100],
        color: colors.gray[900],
      },
      active: {
        backgroundColor: colors.primary[500],
        color: colors.semantic.text.inverse,
      },
      disabled: {
        color: colors.gray[400],
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
    
    ellipsis: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.5rem',
      height: '2.5rem',
      color: colors.gray[500],
    },
  },

  // Mobile navigation specifications
  mobile: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 40,
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      
      '&.open': {
        opacity: 1,
        visibility: 'visible',
      },
    },
    
    menu: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '16rem',
      height: '100vh',
      backgroundColor: colors.semantic.background,
      padding: spacing[6],
      transform: 'translateX(-100%)',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 50,
      overflowY: 'auto',
      boxShadow: shadows.xl,
      
      '&.open': {
        transform: 'translateX(0)',
      },
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[6],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[200]}`,
    },
    
    closeButton: {
      padding: spacing[2],
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: borderRadius.md,
      
      '&:hover': {
        backgroundColor: colors.gray[100],
      },
    },
  },

  // Responsive patterns
  responsive: {
    mobile: {
      header: {
        padding: `0 ${spacing[4]}`,
      },
      
      nav: {
        display: 'none',
      },
      
      mobileToggle: {
        display: 'flex',
      },
    },
    
    tablet: {
      sidebar: {
        width: '14rem',
      },
    },
    
    desktop: {
      sidebar: {
        width: '16rem',
      },
      
      nav: {
        display: 'flex',
      },
      
      mobileToggle: {
        display: 'none',
      },
    },
  },

  // Usage guidelines
  usage: {
    header: {
      description: 'Primary navigation for the application',
      examples: ['Main site navigation', 'User actions', 'Search'],
      bestPractices: [
        'Keep navigation items to 7 or fewer',
        'Use clear, descriptive labels',
        'Highlight current page/section',
      ],
    },
    sidebar: {
      description: 'Secondary navigation for sections or admin areas',
      examples: ['Dashboard navigation', 'Settings sections', 'Admin panels'],
      bestPractices: [
        'Group related items together',
        'Use section headers for organization',
        'Consider collapsible sections for long lists',
      ],
    },
    breadcrumbs: {
      description: 'Show user location within site hierarchy',
      examples: ['Page hierarchy', 'Process steps', 'Category navigation'],
      bestPractices: [
        'Show full path to current page',
        'Make intermediate levels clickable',
        'Use appropriate separators',
      ],
    },
  },

  // Accessibility requirements
  accessibility: {
    keyboard: {
      navigation: 'All navigation items must be keyboard accessible',
      requirements: ['Tab order', 'Enter/Space activation', 'Arrow key navigation'],
    },
    
    screenReader: {
      landmarks: 'Use appropriate ARIA landmarks (navigation, main, etc.)',
      labels: 'Provide descriptive labels for navigation sections',
      current: 'Indicate current page with aria-current="page"',
    },
    
    mobile: {
      touchTargets: 'Minimum 44px touch targets for mobile navigation',
      gestures: 'Support swipe gestures where appropriate',
    },
    
    focus: {
      visible: 'Clear focus indicators for all navigation items',
      management: 'Proper focus management for mobile menus',
    },
  },
};

export default navigationSpec;