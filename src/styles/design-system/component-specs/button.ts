/**
 * Button Component Specification
 * 
 * Comprehensive specification for button components based on Figma designs.
 * Includes variants, states, sizes, and implementation guidelines.
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens';

export interface ButtonVariant {
  backgroundColor: string;
  color: string;
  border?: string;
  boxShadow?: string;
  states: {
    hover: Record<string, string>;
    active: Record<string, string>;
    focus: Record<string, string>;
    disabled: Record<string, string>;
  };
}

export interface ButtonSize {
  fontSize: string;
  lineHeight: string;
  padding: string;
  height: string;
  minWidth: string;
  gap: string;
}

export const buttonSpec = {
  // Base properties applied to all buttons
  base: {
    fontFamily: typography.fontFamily.sans.join(', '),
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
    whiteSpace: 'nowrap',
  } as const,

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
  } as Record<string, ButtonSize>,

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
  } as Record<string, ButtonVariant>,

  // Icon button specifications
  iconButton: {
    sizes: {
      xs: { width: '1.5rem', height: '1.5rem', padding: spacing[1] },
      sm: { width: '2rem', height: '2rem', padding: spacing[1] },
      md: { width: '2.5rem', height: '2.5rem', padding: spacing[2] },
      lg: { width: '3rem', height: '3rem', padding: spacing[2] },
      xl: { width: '3.5rem', height: '3.5rem', padding: spacing[3] },
    },
    borderRadius: borderRadius.md,
  },

  // Loading state specifications
  loading: {
    opacity: '0.7',
    cursor: 'not-allowed',
    spinner: {
      width: '1rem',
      height: '1rem',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  },

  // Usage guidelines
  usage: {
    primary: {
      description: 'Main call-to-action buttons, form submissions, primary actions',
      examples: ['Submit', 'Save', 'Create Account', 'Buy Now'],
      maxPerPage: 1,
    },
    secondary: {
      description: 'Secondary actions, alternative options, cancel buttons',
      examples: ['Cancel', 'Learn More', 'View Details', 'Skip'],
      maxPerPage: 3,
    },
    tertiary: {
      description: 'Subtle actions, navigation links, less important actions',
      examples: ['Edit', 'Delete', 'Share', 'More Options'],
      maxPerPage: 'unlimited',
    },
    danger: {
      description: 'Destructive actions, delete buttons, warning actions',
      examples: ['Delete', 'Remove', 'Cancel Subscription', 'Clear All'],
      requiresConfirmation: true,
    },
    success: {
      description: 'Confirmation actions, success states, positive actions',
      examples: ['Confirm', 'Approve', 'Accept', 'Complete'],
      contextual: true,
    },
  },

  // Accessibility requirements
  accessibility: {
    minTouchTarget: '44px',
    focusVisible: true,
    ariaLabel: 'required for icon-only buttons',
    keyboardNav: true,
    colorContrast: {
      normal: '4.5:1',
      large: '3:1',
    },
    states: {
      disabled: 'aria-disabled="true"',
      loading: 'aria-busy="true"',
      pressed: 'aria-pressed for toggle buttons',
    },
  },

  // Implementation examples
  examples: {
    react: `
import { Button } from '@/components/ui/Button';

// Basic usage
<Button variant="primary" size="md">
  Submit
</Button>

// With icon
<Button variant="secondary" size="lg">
  <Icon name="plus" />
  Add Item
</Button>

// Loading state
<Button variant="primary" loading disabled>
  Saving...
</Button>

// Icon only
<Button variant="tertiary" size="md" aria-label="Close">
  <Icon name="x" />
</Button>
    `,
    css: `
.button {
  /* Base styles */
  font-family: ${typography.fontFamily.sans.join(', ')};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.md};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button--primary {
  background-color: ${colors.primary[500]};
  color: ${colors.semantic.text.inverse};
  box-shadow: ${shadows.sm};
}

.button--primary:hover {
  background-color: ${colors.primary[600]};
  box-shadow: ${shadows.md};
  transform: translateY(-1px);
}
    `,
    tailwind: `
// Tailwind CSS classes
const buttonClasses = {
  base: 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 cursor-pointer border-none outline-none select-none whitespace-nowrap',
  
  // Variants
  primary: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md hover:-translate-y-px active:bg-primary-700 active:shadow-sm active:translate-y-0 focus:shadow-sm focus:ring-3 focus:ring-primary-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
  
  secondary: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 active:bg-primary-100 active:border-primary-700 active:text-primary-700 focus:ring-3 focus:ring-primary-200 disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed',
  
  // Sizes
  xs: 'text-xs leading-tight px-2 py-1 h-6 min-w-12 gap-1',
  sm: 'text-sm leading-tight px-3 py-2 h-8 min-w-16 gap-1',
  md: 'text-base leading-tight px-4 py-2 h-10 min-w-20 gap-2',
  lg: 'text-lg leading-tight px-6 py-3 h-12 min-w-24 gap-2',
  xl: 'text-xl leading-tight px-8 py-4 h-14 min-w-28 gap-3',
};
    `,
  },
};

export default buttonSpec;