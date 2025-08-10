/**
 * Modal Component Specification
 * 
 * Comprehensive specification for modal and overlay components based on Figma designs.
 * Includes dialogs, confirmations, drawers, and responsive modal patterns.
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens';

export const modalSpec = {
  // Overlay specifications
  overlay: {
    base: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[4],
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    states: {
      open: {
        opacity: 1,
        visibility: 'visible',
      },
      
      closing: {
        opacity: 0,
        visibility: 'visible',
      },
    },
    
    variants: {
      light: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      dark: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      blur: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
      },
    },
  },

  // Modal container specifications
  container: {
    base: {
      backgroundColor: colors.semantic.background,
      borderRadius: borderRadius.lg,
      boxShadow: shadows['2xl'],
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: 'auto',
      position: 'relative',
      transform: 'scale(0.95)',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    
    states: {
      open: {
        transform: 'scale(1)',
      },
      
      closing: {
        transform: 'scale(0.95)',
      },
    },
    
    sizes: {
      xs: {
        width: '20rem',
        maxWidth: '20rem',
      },
      sm: {
        width: '24rem',
        maxWidth: '24rem',
      },
      md: {
        width: '32rem',
        maxWidth: '32rem',
      },
      lg: {
        width: '48rem',
        maxWidth: '48rem',
      },
      xl: {
        width: '64rem',
        maxWidth: '64rem',
      },
      full: {
        width: '95vw',
        height: '95vh',
        maxWidth: '95vw',
        maxHeight: '95vh',
      },
    },
    
    responsive: {
      mobile: {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: '0',
        margin: '0',
      },
      
      tablet: {
        width: '90vw',
        maxWidth: '32rem',
        height: 'auto',
        maxHeight: '90vh',
        borderRadius: borderRadius.lg,
        margin: spacing[4],
      },
      
      desktop: {
        width: 'auto',
        minWidth: '24rem',
        maxWidth: '48rem',
        height: 'auto',
        maxHeight: '90vh',
        borderRadius: borderRadius.lg,
        margin: spacing[6],
      },
    },
  },

  // Modal header specifications
  header: {
    base: {
      padding: spacing[6],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.gray[200]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      color: colors.semantic.text.primary,
      lineHeight: typography.lineHeight.tight,
      margin: 0,
    },
    
    subtitle: {
      fontSize: typography.fontSize.sm,
      color: colors.gray[600],
      marginTop: spacing[1],
      margin: 0,
    },
    
    closeButton: {
      padding: spacing[2],
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      borderRadius: borderRadius.md,
      color: colors.gray[500],
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      
      '&:hover': {
        backgroundColor: colors.gray[100],
        color: colors.gray[700],
      },
      
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${colors.primary[200]}`,
      },
    },
  },

  // Modal body specifications
  body: {
    base: {
      padding: spacing[6],
      overflowY: 'auto',
      flex: 1,
      minHeight: 0, // Allow flex shrinking
    },
    
    variants: {
      default: {
        padding: spacing[6],
      },
      compact: {
        padding: spacing[4],
      },
      spacious: {
        padding: spacing[8],
      },
      flush: {
        padding: 0,
      },
    },
    
    content: {
      fontSize: typography.fontSize.base,
      color: colors.semantic.text.primary,
      lineHeight: typography.lineHeight.relaxed,
    },
  },

  // Modal footer specifications
  footer: {
    base: {
      padding: spacing[6],
      paddingTop: spacing[4],
      borderTop: `1px solid ${colors.gray[200]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing[3],
      flexShrink: 0,
    },
    
    variants: {
      default: {
        justifyContent: 'flex-end',
      },
      spaceBetween: {
        justifyContent: 'space-between',
      },
      center: {
        justifyContent: 'center',
      },
      start: {
        justifyContent: 'flex-start',
      },
    },
    
    responsive: {
      mobile: {
        flexDirection: 'column',
        gap: spacing[2],
        
        '& > *': {
          width: '100%',
        },
      },
      
      tablet: {
        flexDirection: 'row',
        gap: spacing[3],
        
        '& > *': {
          width: 'auto',
        },
      },
    },
  },

  // Modal variants
  variants: {
    dialog: {
      container: {
        maxWidth: '32rem',
      },
      header: {
        textAlign: 'center',
      },
      footer: {
        justifyContent: 'center',
        gap: spacing[4],
      },
    },
    
    confirmation: {
      container: {
        maxWidth: '24rem',
      },
      header: {
        paddingBottom: spacing[2],
        borderBottom: 'none',
      },
      body: {
        paddingTop: 0,
        textAlign: 'center',
      },
      footer: {
        justifyContent: 'center',
        gap: spacing[3],
      },
    },
    
    form: {
      container: {
        maxWidth: '48rem',
      },
      body: {
        padding: spacing[6],
      },
    },
    
    fullscreen: {
      container: {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: '0',
      },
      overlay: {
        padding: '0',
      },
    },
  },

  // Drawer specifications (side modal)
  drawer: {
    base: {
      position: 'fixed',
      top: 0,
      height: '100vh',
      backgroundColor: colors.semantic.background,
      boxShadow: shadows.xl,
      zIndex: 50,
      transform: 'translateX(-100%)',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    
    positions: {
      left: {
        left: 0,
        transform: 'translateX(-100%)',
        
        '&.open': {
          transform: 'translateX(0)',
        },
      },
      right: {
        right: 0,
        transform: 'translateX(100%)',
        
        '&.open': {
          transform: 'translateX(0)',
        },
      },
    },
    
    sizes: {
      sm: {
        width: '20rem',
      },
      md: {
        width: '24rem',
      },
      lg: {
        width: '32rem',
      },
    },
  },

  // Animation specifications
  animations: {
    fadeIn: {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    
    scaleIn: {
      from: {
        opacity: 0,
        transform: 'scale(0.95)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    
    slideInFromTop: {
      from: {
        opacity: 0,
        transform: 'translateY(-2rem)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    
    slideInFromBottom: {
      from: {
        opacity: 0,
        transform: 'translateY(2rem)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },

  // Usage guidelines
  usage: {
    dialog: {
      description: 'General purpose modal for content display',
      examples: ['Image viewer', 'Content details', 'Settings'],
      bestPractices: [
        'Use for non-critical information',
        'Provide clear close options',
        'Keep content focused',
      ],
    },
    confirmation: {
      description: 'Confirm destructive or important actions',
      examples: ['Delete confirmation', 'Save changes', 'Logout'],
      bestPractices: [
        'Use for irreversible actions',
        'Make consequences clear',
        'Provide cancel option',
      ],
    },
    form: {
      description: 'Modal forms for data entry',
      examples: ['Create item', 'Edit profile', 'Contact form'],
      bestPractices: [
        'Keep forms concise',
        'Validate on submit',
        'Save draft state when possible',
      ],
    },
    drawer: {
      description: 'Side panel for secondary content',
      examples: ['Filters', 'Navigation', 'Details panel'],
      bestPractices: [
        'Use for contextual content',
        'Allow easy dismissal',
        'Consider mobile experience',
      ],
    },
  },

  // Accessibility requirements
  accessibility: {
    focus: {
      trap: 'Focus must be trapped within the modal',
      initial: 'Focus should move to first focusable element',
      return: 'Focus should return to trigger element on close',
    },
    
    keyboard: {
      escape: 'ESC key should close the modal',
      navigation: 'Tab/Shift+Tab should cycle through focusable elements',
    },
    
    screenReader: {
      role: 'Use role="dialog" or role="alertdialog"',
      label: 'Provide aria-label or aria-labelledby',
      description: 'Use aria-describedby for additional context',
      modal: 'Use aria-modal="true"',
    },
    
    backdrop: {
      click: 'Clicking backdrop should close modal (unless prevented)',
      scroll: 'Prevent body scroll when modal is open',
    },
  },
};

export default modalSpec;