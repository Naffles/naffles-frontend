/**
 * Form Component Specification
 * 
 * Comprehensive specification for form components based on Figma designs.
 * Includes input fields, labels, validation states, and form layouts.
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens';

export interface FormFieldVariant {
  backgroundColor: string;
  border: string;
  borderRadius: string;
  padding: string;
  fontSize: string;
  color: string;
  states: {
    focus: Record<string, string>;
    error: Record<string, string>;
    success: Record<string, string>;
    disabled: Record<string, string>;
  };
}

export const formSpec = {
  // Base properties for all form elements
  base: {
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
  } as const,

  // Input field specifications
  input: {
    base: {
      width: '100%',
      height: '2.5rem',
      padding: `${spacing[2]} ${spacing[3]}`,
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.semantic.background,
      color: colors.semantic.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.sans.join(', '),
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
    },
    
    states: {
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
      },
    },
    
    sizes: {
      sm: {
        height: '2rem',
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        height: '2.5rem',
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        height: '3rem',
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.lg,
      },
    },
  },

  // Label specifications
  label: {
    base: {
      display: 'block',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.semantic.text.primary,
      marginBottom: spacing[2],
      lineHeight: typography.lineHeight.tight,
    },
    
    states: {
      required: {
        '&::after': {
          content: '" *"',
          color: colors.error[500],
        },
      },
      disabled: {
        color: colors.gray[500],
      },
    },
  },

  // Textarea specifications
  textarea: {
    base: {
      width: '100%',
      minHeight: '6rem',
      padding: `${spacing[3]} ${spacing[3]}`,
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.semantic.background,
      color: colors.semantic.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.sans.join(', '),
      resize: 'vertical',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
    },
    
    states: {
      focus: {
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      error: {
        borderColor: colors.error[500],
        boxShadow: `0 0 0 3px ${colors.error[200]}`,
      },
      disabled: {
        backgroundColor: colors.gray[100],
        borderColor: colors.gray[300],
        color: colors.gray[500],
        cursor: 'not-allowed',
        resize: 'none',
      },
    },
  },

  // Select dropdown specifications
  select: {
    base: {
      width: '100%',
      height: '2.5rem',
      padding: `${spacing[2]} ${spacing[3]}`,
      paddingRight: spacing[8], // Space for dropdown arrow
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.semantic.background,
      color: colors.semantic.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.sans.join(', '),
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
    },
    
    states: {
      focus: {
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      error: {
        borderColor: colors.error[500],
        boxShadow: `0 0 0 3px ${colors.error[200]}`,
      },
      disabled: {
        backgroundColor: colors.gray[100],
        borderColor: colors.gray[300],
        color: colors.gray[500],
        cursor: 'not-allowed',
      },
    },
  },

  // Checkbox specifications
  checkbox: {
    base: {
      width: '1rem',
      height: '1rem',
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: borderRadius.sm,
      backgroundColor: colors.semantic.background,
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      appearance: 'none',
      position: 'relative',
    },
    
    states: {
      checked: {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '1px',
          left: '4px',
          width: '6px',
          height: '10px',
          border: `2px solid ${colors.semantic.text.inverse}`,
          borderTop: 'none',
          borderLeft: 'none',
          transform: 'rotate(45deg)',
        },
      },
      focus: {
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      disabled: {
        backgroundColor: colors.gray[100],
        borderColor: colors.gray[300],
        cursor: 'not-allowed',
      },
    },
  },

  // Radio button specifications
  radio: {
    base: {
      width: '1rem',
      height: '1rem',
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: '50%',
      backgroundColor: colors.semantic.background,
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      appearance: 'none',
      position: 'relative',
    },
    
    states: {
      checked: {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '2px',
          left: '2px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: colors.semantic.text.inverse,
        },
      },
      focus: {
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
      },
      disabled: {
        backgroundColor: colors.gray[100],
        borderColor: colors.gray[300],
        cursor: 'not-allowed',
      },
    },
  },

  // Form group specifications
  formGroup: {
    base: {
      marginBottom: spacing[6],
    },
    
    inline: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
      marginBottom: spacing[4],
    },
    
    grid: {
      display: 'grid',
      gap: spacing[4],
      gridTemplateColumns: '1fr',
      
      // Responsive grid
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      
      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
    },
  },

  // Help text specifications
  helpText: {
    base: {
      fontSize: typography.fontSize.sm,
      color: colors.gray[600],
      marginTop: spacing[1],
      lineHeight: typography.lineHeight.relaxed,
    },
    
    states: {
      error: {
        color: colors.error[600],
      },
      success: {
        color: colors.success[600],
      },
    },
  },

  // Form validation specifications
  validation: {
    message: {
      fontSize: typography.fontSize.sm,
      marginTop: spacing[1],
      lineHeight: typography.lineHeight.relaxed,
      display: 'flex',
      alignItems: 'center',
      gap: spacing[1],
    },
    
    states: {
      error: {
        color: colors.error[600],
      },
      success: {
        color: colors.success[600],
      },
      warning: {
        color: colors.warning[600],
      },
    },
    
    icon: {
      width: '1rem',
      height: '1rem',
      flexShrink: 0,
    },
  },

  // Form layout patterns
  layouts: {
    vertical: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[6],
    },
    
    horizontal: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: spacing[4],
      alignItems: 'start',
      
      '@media (max-width: 767px)': {
        gridTemplateColumns: '1fr',
      },
    },
    
    inline: {
      display: 'flex',
      alignItems: 'end',
      gap: spacing[3],
      flexWrap: 'wrap',
    },
  },

  // Usage guidelines
  usage: {
    input: {
      description: 'Standard text input for single-line text entry',
      examples: ['Name', 'Email', 'Username', 'Search'],
      bestPractices: [
        'Use appropriate input types (email, tel, url)',
        'Provide clear labels and placeholders',
        'Include validation feedback',
      ],
    },
    textarea: {
      description: 'Multi-line text input for longer content',
      examples: ['Comments', 'Descriptions', 'Messages'],
      bestPractices: [
        'Set appropriate minimum height',
        'Allow vertical resizing',
        'Consider character limits',
      ],
    },
    select: {
      description: 'Dropdown selection for choosing from predefined options',
      examples: ['Country', 'Category', 'Status'],
      bestPractices: [
        'Use when options are limited and known',
        'Consider searchable dropdowns for many options',
        'Provide default selection when appropriate',
      ],
    },
  },

  // Accessibility requirements
  accessibility: {
    labels: {
      required: 'All form controls must have associated labels',
      methods: ['<label> element', 'aria-label', 'aria-labelledby'],
    },
    
    validation: {
      required: 'Validation messages must be announced to screen readers',
      methods: ['aria-describedby', 'aria-invalid', 'role="alert"'],
    },
    
    keyboard: {
      navigation: 'All form controls must be keyboard accessible',
      requirements: ['Tab order', 'Enter/Space activation', 'Arrow key navigation for groups'],
    },
    
    contrast: {
      text: 'Minimum 4.5:1 contrast ratio for text',
      focus: 'Clear focus indicators with sufficient contrast',
      error: 'Error states must be distinguishable without color alone',
    },
  },
};

export default formSpec;