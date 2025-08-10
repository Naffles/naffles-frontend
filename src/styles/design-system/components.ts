/**
 * Component Specifications - Design system component definitions and patterns
 * 
 * This file contains component specifications extracted from Figma designs,
 * providing implementation guidelines, variants, states, and usage patterns
 * for all UI components in the Naffles design system.
 */

import { colors, typography, spacing, shadows, borderRadius } from './tokens';

// =============================================================================
// BUTTON COMPONENT SPECIFICATIONS
// =============================================================================

export const buttonSpecs = {
  // Base button properties
  base: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    outline: 'none',
    userSelect: 'none',
  },
  
  // Size variations
  sizes: {
    xs: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.tight,
      padding: `${spacing[1]} ${spacing[2]}`,
      height: '1.5rem',
      minWidth: '3rem',
      gap: spacing[1],
    },
    sm: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.tight,
      padding: `${spacing[2]} ${spacing[3]}`,
      height: '2rem',
      minWidth: '4rem',
      gap: spacing[1],
    },
    md: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.tight,
      padding: `${spacing[2]} ${spacing[4]}`,
      height: '2.5rem',
      minWidth: '5rem',
      gap: spacing[2],
    },
    lg: {
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.tight,
      padding: `${spacing[3]} ${spacing[6]}`,
      height: '3rem',
      minWidth: '6rem',
      gap: spacing[2],
    },
    xl: {
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.tight,
      padding: `${spacing[4]} ${spacing[8]}`,
      height: '3.5rem',
      minWidth: '7rem',
      gap: spacing[3],
    },
  },
  
  // Variant styles
  variants: {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.semantic.text.inverse,
      boxShadow: shadows.sm,
      states: {
        hover: {
          backgroundColor: colors.primary[600],
          boxShadow: shadows.md,
          transform: 'translateY(-1px)',
        },
        active: {
          backgroundColor: colors.primary[700],
          boxShadow: shadows.sm,
          transform: 'translateY(0)',
        },
        focus: {
          boxShadow: `${shadows.sm}, 0 0 0 3px ${colors.primary[200]}`,
        },
        disabled: {
          backgroundColor: colors.gray[300],
          color: colors.gray[500],
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'none',
        },
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
      states: {
        hover: {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[600],
          color: colors.primary[600],
        },
        active: {
          backgroundColor: colors.primary[100],
          borderColor: colors.primary[700],
          color: colors.primary[700],
        },
        focus: {
          boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        },
        disabled: {
          backgroundColor: 'transparent',
          color: colors.gray[400],
          borderColor: colors.gray[300],
          cursor: 'not-allowed',
        },
      },
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: colors.gray[700],
      states: {
        hover: {
          backgroundColor: colors.gray[100],
          color: colors.gray[800],
        },
        active: {
          backgroundColor: colors.gray[200],
          color: colors.gray[900],
        },
        focus: {
          boxShadow: `0 0 0 3px ${colors.gray[200]}`,
        },
        disabled: {
          backgroundColor: 'transparent',
          color: colors.gray[400],
          cursor: 'not-allowed',
        },
      },
    },
    danger: {
      backgroundColor: colors.error[500],
      color: colors.semantic.text.inverse,
      boxShadow: shadows.sm,
      states: {
        hover: {
          backgroundColor: colors.error[600],
          boxShadow: shadows.md,
          transform: 'translateY(-1px)',
        },
        active: {
          backgroundColor: colors.error[700],
          boxShadow: shadows.sm,
          transform: 'translateY(0)',
        },
        focus: {
          boxShadow: `${shadows.sm}, 0 0 0 3px ${colors.error[200]}`,
        },
        disabled: {
          backgroundColor: colors.gray[300],
          color: colors.gray[500],
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'none',
        },
      },
    },
    success: {
      backgroundColor: colors.success[500],
      color: colors.semantic.text.inverse,
      boxShadow: shadows.sm,
      states: {
        hover: {
          backgroundColor: colors.success[600],
          boxShadow: shadows.md,
          transform: 'translateY(-1px)',
        },
        active: {
          backgroundColor: colors.success[700],
          boxShadow: shadows.sm,
          transform: 'translateY(0)',
        },
        focus: {
          boxShadow: `${shadows.sm}, 0 0 0 3px ${colors.success[200]}`,
        },
        disabled: {
          backgroundColor: colors.gray[300],
          color: colors.gray[500],
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'none',
        },
      },
    },
  },
  
  // Usage guidelines
  usage: {
    primary: 'Main call-to-action buttons, form submissions, primary actions',
    secondary: 'Secondary actions, alternative options, cancel buttons',
    tertiary: 'Subtle actions, navigation links, less important actions',
    danger: 'Destructive actions, delete buttons, warning actions',
    success: 'Confirmation actions, success states, positive actions',
  },
  
  // Accessibility requirements
  accessibility: {
    minTouchTarget: '44px', // Minimum touch target size
    focusVisible: true,     // Must have visible focus indicator
    ariaLabel: 'required',  // ARIA label required for icon-only buttons
    keyboardNav: true,      // Must support keyboard navigation
  },
};

// =============================================================================
// CARD COMPONENT SPECIFICATIONS
// =============================================================================

export const cardSpecs = {
  // Base card properties
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.semantic.surface,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  },
  
  // Variant styles
  variants: {
    default: {
      boxShadow: shadows.DEFAULT,
      border: `1px solid ${colors.gray[200]}`,
      padding: spacing[6],
    },
    elevated: {
      boxShadow: shadows.lg,
      border: 'none',
      padding: spacing[6],
    },
    outlined: {
      boxShadow: 'none',
      border: `1px solid ${colors.gray[300]}`,
      padding: spacing[6],
    },
    interactive: {
      boxShadow: shadows.DEFAULT,
      border: `1px solid ${colors.gray[200]}`,
      padding: spacing[6],
      cursor: 'pointer',
      states: {
        hover: {
          boxShadow: shadows.lg,
          transform: 'translateY(-2px)',
          borderColor: colors.gray[300],
        },
        active: {
          boxShadow: shadows.md,
          transform: 'translateY(-1px)',
        },
        focus: {
          boxShadow: `${shadows.lg}, 0 0 0 3px ${colors.primary[200]}`,
          outline: 'none',
        },
      },
    },
    compact: {
      boxShadow: shadows.sm,
      border: `1px solid ${colors.gray[200]}`,
      padding: spacing[4],
    },
  },
  
  // Content structure patterns
  structure: {
    header: {
      marginBottom: spacing[4],
      paddingBottom: spacing[3],
      borderBottom: `1px solid ${colors.gray[200]}`,
    },
    body: {
      marginBottom: spacing[4],
    },
    footer: {
      marginTop: spacing[4],
      paddingTop: spacing[3],
      borderTop: `1px solid ${colors.gray[200]}`,
    },
  },
  
  // Usage guidelines
  usage: {
    default: 'Standard content cards, information display',
    elevated: 'Important content, modal-like cards, featured items',
    outlined: 'Subtle content separation, form sections',
    interactive: 'Clickable cards, navigation items, selectable content',
    compact: 'Dense layouts, list items, sidebar content',
  },
};

// =============================================================================
// INPUT COMPONENT SPECIFICATIONS
// =============================================================================

export const inputSpecs = {
  // Base input properties
  base: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    borderRadius: borderRadius.md,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    width: '100%',
  },
  
  // Size variations
  sizes: {
    sm: {
      fontSize: typography.fontSize.sm,
      padding: `${spacing[2]} ${spacing[3]}`,
      height: '2rem',
    },
    md: {
      fontSize: typography.fontSize.base,
      padding: `${spacing[2]} ${spacing[3]}`,
      height: '2.5rem',
    },
    lg: {
      fontSize: typography.fontSize.lg,
      padding: `${spacing[3]} ${spacing[4]}`,
      height: '3rem',
    },
  },
  
  // State styles
  states: {
    default: {
      backgroundColor: colors.semantic.background,
      border: `1px solid ${colors.gray[300]}`,
      color: colors.semantic.text.primary,
      '&::placeholder': {
        color: colors.gray[500],
      },
    },
    focus: {
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    error: {
      borderColor: colors.error[500],
      boxShadow: `0 0 0 3px ${colors.error[200]}`,
    },
    success: {
      borderColor: colors.success[500],
      boxShadow: `0 0 0 3px ${colors.success[200]}`,
    },
    disabled: {
      backgroundColor: colors.gray[100],
      borderColor: colors.gray[300],
      color: colors.gray[500],
      cursor: 'not-allowed',
      '&::placeholder': {
        color: colors.gray[400],
      },
    },
  },
  
  // Input types
  types: {
    text: {
      type: 'text',
    },
    email: {
      type: 'email',
    },
    password: {
      type: 'password',
    },
    number: {
      type: 'number',
    },
    search: {
      type: 'search',
      paddingLeft: spacing[10], // Space for search icon
    },
    textarea: {
      resize: 'vertical',
      minHeight: '6rem',
      lineHeight: typography.lineHeight.relaxed,
    },
  },
  
  // Usage guidelines
  usage: {
    text: 'General text input, names, titles',
    email: 'Email addresses with validation',
    password: 'Password fields with security considerations',
    number: 'Numeric input with validation',
    search: 'Search fields with icon integration',
    textarea: 'Multi-line text input, descriptions, comments',
  },
};

// =============================================================================
// NAVIGATION COMPONENT SPECIFICATIONS
// =============================================================================

export const navigationSpecs = {
  // Header navigation
  header: {
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
    
    logo: {
      height: '2rem',
      width: 'auto',
    },
    
    navigation: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[8],
    },
    
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[4],
    },
  },
  
  // Sidebar navigation
  sidebar: {
    width: '16rem',
    backgroundColor: colors.semantic.surface,
    borderRight: `1px solid ${colors.gray[200]}`,
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    padding: spacing[6],
    overflowY: 'auto',
    
    collapsed: {
      width: '4rem',
    },
    
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
      padding: `${spacing[2]} ${spacing[3]}`,
      borderRadius: borderRadius.md,
      color: colors.gray[700],
      textDecoration: 'none',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      
      states: {
        hover: {
          backgroundColor: colors.gray[100],
          color: colors.gray[900],
        },
        active: {
          backgroundColor: colors.primary[100],
          color: colors.primary[700],
        },
      },
    },
  },
  
  // Breadcrumb navigation
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    
    item: {
      color: colors.gray[600],
      textDecoration: 'none',
      
      states: {
        hover: {
          color: colors.primary[500],
        },
        current: {
          color: colors.gray[900],
          fontWeight: typography.fontWeight.medium,
        },
      },
    },
    
    separator: {
      color: colors.gray[400],
      fontSize: typography.fontSize.xs,
    },
  },
  
  // Tab navigation
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${colors.gray[200]}`,
    
    item: {
      padding: `${spacing[3]} ${spacing[4]}`,
      borderBottom: '2px solid transparent',
      color: colors.gray[600],
      textDecoration: 'none',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      
      states: {
        hover: {
          color: colors.gray[900],
          borderBottomColor: colors.gray[300],
        },
        active: {
          color: colors.primary[600],
          borderBottomColor: colors.primary[500],
        },
      },
    },
  },
};

// =============================================================================
// MODAL COMPONENT SPECIFICATIONS
// =============================================================================

export const modalSpecs = {
  // Overlay
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing[4],
  },
  
  // Modal container
  container: {
    backgroundColor: colors.semantic.background,
    borderRadius: borderRadius.lg,
    boxShadow: shadows['2xl'],
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Size variations
  sizes: {
    sm: {
      width: '24rem',
    },
    md: {
      width: '32rem',
    },
    lg: {
      width: '48rem',
    },
    xl: {
      width: '64rem',
    },
    full: {
      width: '90vw',
      height: '90vh',
    },
  },
  
  // Modal sections
  header: {
    padding: spacing[6],
    borderBottom: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.semantic.text.primary,
    },
    
    closeButton: {
      padding: spacing[1],
      borderRadius: borderRadius.md,
      color: colors.gray[500],
      
      states: {
        hover: {
          backgroundColor: colors.gray[100],
          color: colors.gray[700],
        },
      },
    },
  },
  
  body: {
    padding: spacing[6],
    overflowY: 'auto',
  },
  
  footer: {
    padding: spacing[6],
    borderTop: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[3],
  },
};

// =============================================================================
// FORM COMPONENT SPECIFICATIONS
// =============================================================================

export const formSpecs = {
  // Form group
  group: {
    marginBottom: spacing[6],
  },
  
  // Label
  label: {
    display: 'block',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.semantic.text.primary,
    marginBottom: spacing[2],
    
    required: {
      '&::after': {
        content: '" *"',
        color: colors.error[500],
      },
    },
  },
  
  // Help text
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  
  // Error message
  errorMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.error[600],
    marginTop: spacing[1],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  
  // Success message
  successMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.success[600],
    marginTop: spacing[1],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  },
  
  // Fieldset
  fieldset: {
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    marginBottom: spacing[6],
    
    legend: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.semantic.text.primary,
      padding: `0 ${spacing[2]}`,
    },
  },
};

// =============================================================================
// TABLE COMPONENT SPECIFICATIONS
// =============================================================================

export const tableSpecs = {
  // Table container
  container: {
    overflowX: 'auto',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.gray[200]}`,
  },
  
  // Table element
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: typography.fontSize.sm,
  },
  
  // Table header
  header: {
    backgroundColor: colors.gray[50],
    
    cell: {
      padding: `${spacing[3]} ${spacing[4]}`,
      textAlign: 'left',
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.gray[700],
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
      borderBottom: `1px solid ${colors.gray[200]}`,
    },
  },
  
  // Table body
  body: {
    backgroundColor: colors.semantic.background,
    
    row: {
      borderBottom: `1px solid ${colors.gray[200]}`,
      
      states: {
        hover: {
          backgroundColor: colors.gray[50],
        },
        selected: {
          backgroundColor: colors.primary[50],
        },
      },
    },
    
    cell: {
      padding: `${spacing[4]} ${spacing[4]}`,
      color: colors.semantic.text.primary,
      verticalAlign: 'top',
    },
  },
  
  // Table variants
  variants: {
    striped: {
      'tbody tr:nth-child(even)': {
        backgroundColor: colors.gray[50],
      },
    },
    bordered: {
      'td, th': {
        border: `1px solid ${colors.gray[200]}`,
      },
    },
    compact: {
      'td, th': {
        padding: `${spacing[2]} ${spacing[3]}`,
      },
    },
  },
};

// =============================================================================
// LOADING COMPONENT SPECIFICATIONS
// =============================================================================

export const loadingSpecs = {
  // Spinner
  spinner: {
    width: '1.5rem',
    height: '1.5rem',
    border: `2px solid ${colors.gray[200]}`,
    borderTop: `2px solid ${colors.primary[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  // Skeleton
  skeleton: {
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.md,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    
    variants: {
      text: {
        height: '1rem',
        width: '100%',
      },
      title: {
        height: '1.5rem',
        width: '75%',
      },
      avatar: {
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%',
      },
      button: {
        height: '2.5rem',
        width: '6rem',
      },
    },
  },
  
  // Progress bar
  progressBar: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    
    fill: {
      height: '100%',
      backgroundColor: colors.primary[500],
      transition: 'width 300ms ease-in-out',
    },
  },
};

// =============================================================================
// NOTIFICATION COMPONENT SPECIFICATIONS
// =============================================================================

export const notificationSpecs = {
  // Base notification
  base: {
    padding: spacing[4],
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[3],
    boxShadow: shadows.lg,
    border: '1px solid transparent',
  },
  
  // Notification variants
  variants: {
    info: {
      backgroundColor: colors.info[50],
      borderColor: colors.info[200],
      color: colors.info[800],
    },
    success: {
      backgroundColor: colors.success[50],
      borderColor: colors.success[200],
      color: colors.success[800],
    },
    warning: {
      backgroundColor: colors.warning[50],
      borderColor: colors.warning[200],
      color: colors.warning[800],
    },
    error: {
      backgroundColor: colors.error[50],
      borderColor: colors.error[200],
      color: colors.error[800],
    },
  },
  
  // Notification positions
  positions: {
    topRight: {
      position: 'fixed',
      top: spacing[4],
      right: spacing[4],
      zIndex: 50,
    },
    topLeft: {
      position: 'fixed',
      top: spacing[4],
      left: spacing[4],
      zIndex: 50,
    },
    bottomRight: {
      position: 'fixed',
      bottom: spacing[4],
      right: spacing[4],
      zIndex: 50,
    },
    bottomLeft: {
      position: 'fixed',
      bottom: spacing[4],
      left: spacing[4],
      zIndex: 50,
    },
  },
};

// =============================================================================
// COMPONENT USAGE GUIDELINES
// =============================================================================

export const usageGuidelines = {
  buttons: {
    hierarchy: 'Use primary for main actions, secondary for alternatives, tertiary for subtle actions',
    spacing: 'Maintain consistent spacing between button groups',
    loading: 'Show loading states for async actions',
    disabled: 'Clearly indicate disabled states with reduced opacity and cursor changes',
  },
  
  cards: {
    content: 'Keep card content focused and scannable',
    actions: 'Place primary actions at the bottom right',
    hierarchy: 'Use elevation to indicate importance',
    responsive: 'Ensure cards adapt well to different screen sizes',
  },
  
  forms: {
    validation: 'Provide real-time validation feedback',
    labels: 'Always include clear, descriptive labels',
    grouping: 'Group related fields together',
    progress: 'Show progress for multi-step forms',
  },
  
  navigation: {
    consistency: 'Maintain consistent navigation patterns across the app',
    breadcrumbs: 'Use breadcrumbs for deep navigation hierarchies',
    active: 'Clearly indicate the current page/section',
    responsive: 'Adapt navigation for mobile devices',
  },
};

// =============================================================================
// ACCESSIBILITY SPECIFICATIONS
// =============================================================================

export const accessibilitySpecs = {
  colorContrast: {
    normal: '4.5:1', // WCAG AA standard for normal text
    large: '3:1',    // WCAG AA standard for large text
    ui: '3:1',       // WCAG AA standard for UI components
  },
  
  focusManagement: {
    visible: 'All interactive elements must have visible focus indicators',
    order: 'Tab order should follow logical reading order',
    trap: 'Modal dialogs should trap focus within the modal',
    restore: 'Focus should be restored when modals close',
  },
  
  semantics: {
    headings: 'Use proper heading hierarchy (h1, h2, h3, etc.)',
    landmarks: 'Use semantic HTML5 landmarks (nav, main, aside, etc.)',
    labels: 'All form inputs must have associated labels',
    descriptions: 'Provide descriptions for complex UI elements',
  },
  
  keyboard: {
    navigation: 'All interactive elements must be keyboard accessible',
    shortcuts: 'Provide keyboard shortcuts for common actions',
    escape: 'ESC key should close modals and dropdowns',
    enter: 'ENTER key should activate buttons and submit forms',
  },
  
  screenReader: {
    altText: 'All images must have descriptive alt text',
    ariaLabels: 'Use ARIA labels for complex components',
    liveRegions: 'Use ARIA live regions for dynamic content updates',
    roles: 'Use appropriate ARIA roles for custom components',
  },
};

// Export all component specifications
export const componentSpecs = {
  button: buttonSpecs,
  card: cardSpecs,
  input: inputSpecs,
  navigation: navigationSpecs,
  modal: modalSpecs,
  form: formSpecs,
  table: tableSpecs,
  loading: loadingSpecs,
  notification: notificationSpecs,
};

export default componentSpecs;