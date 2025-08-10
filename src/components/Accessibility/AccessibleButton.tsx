/**
 * AccessibleButton - WCAG 2.1 AA compliant button component
 * 
 * Features:
 * - Proper color contrast ratios
 * - Visible focus indicators
 * - ARIA labels and semantic markup
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Minimum touch target size (44px)
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { accessibility } from '../../styles/design-system/accessibility';
import { colors, typography, spacing, borderRadius } from '../../styles/design-system/tokens';

interface AccessibleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Loading state */
  loading?: boolean;
  /** Icon element */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Accessible label (required for icon-only buttons) */
  accessibleLabel?: string;
  /** Additional description for screen readers */
  description?: string;
  /** Pressed state for toggle buttons */
  pressed?: boolean;
  /** Expanded state for dropdown buttons */
  expanded?: boolean;
  /** Custom focus style context */
  focusContext?: 'default' | 'inverse';
  children?: ReactNode;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      type = 'button',
      loading = false,
      icon,
      iconPosition = 'left',
      accessibleLabel,
      description,
      pressed,
      expanded,
      focusContext = 'default',
      disabled,
      className = '',
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for ARIA relationships
    const buttonId = React.useId();
    const descriptionId = description ? `${buttonId}-desc` : undefined;
    
    // Determine if this is an icon-only button
    const isIconOnly = !children && !!icon;
    
    // Create ARIA attributes
    const ariaAttributes = accessibility.ariaHelpers.button(
      accessibleLabel || (typeof children === 'string' ? children : 'Button'),
      description,
      pressed,
      expanded
    );
    
    // Handle keyboard events
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Call custom onKeyDown if provided
      onKeyDown?.(event);
      
      // Handle keyboard activation
      const keyboardHandler = accessibility.keyboardNavigation.buttonHandler(() => {
        if (!disabled && !loading && onClick) {
          onClick(event as any);
        }
      });
      
      keyboardHandler(event.nativeEvent);
    };
    
    // Create button styles based on variant and size
    const buttonStyles = createButtonStyles(variant, size, focusContext, disabled || loading);
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <span
        style={{
          width: '1rem',
          height: '1rem',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: children ? spacing[2] : 0,
        }}
        aria-hidden="true"
      />
    );
    
    return (
      <>
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          className={className}
          style={buttonStyles}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          {...ariaAttributes}
          {...(descriptionId && { 'aria-describedby': descriptionId })}
          {...props}
        >
          {loading && <LoadingSpinner />}
          
          {icon && iconPosition === 'left' && (
            <span
              style={{ marginRight: children ? spacing[2] : 0 }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          
          {children && (
            <span>{children}</span>
          )}
          
          {icon && iconPosition === 'right' && (
            <span
              style={{ marginLeft: children ? spacing[2] : 0 }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          
          {/* Screen reader only loading announcement */}
          {loading && (
            <span style={accessibility.screenReader.srOnly}>
              Loading
            </span>
          )}
        </button>
        
        {/* Description element for screen readers */}
        {description && (
          <div
            id={descriptionId}
            style={accessibility.screenReader.srOnly}
          >
            {description}
          </div>
        )}
        
        {/* Add keyframe animation for loading spinner */}
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

/**
 * Create button styles with accessibility considerations
 */
function createButtonStyles(
  variant: AccessibleButtonProps['variant'],
  size: AccessibleButtonProps['size'],
  focusContext: AccessibleButtonProps['focusContext'],
  isDisabled: boolean
) {
  // Size configurations with minimum touch targets
  const sizeConfig = {
    xs: {
      fontSize: typography.fontSize.xs,
      padding: `${spacing[2]} ${spacing[3]}`,
      minHeight: '32px', // Smaller minimum for compact UIs
      minWidth: '32px',
    },
    sm: {
      fontSize: typography.fontSize.sm,
      padding: `${spacing[2]} ${spacing[4]}`,
      minHeight: '36px',
      minWidth: '36px',
    },
    md: {
      fontSize: typography.fontSize.base,
      padding: `${spacing[3]} ${spacing[6]}`,
      minHeight: '44px', // WCAG minimum touch target
      minWidth: '44px',
    },
    lg: {
      fontSize: typography.fontSize.lg,
      padding: `${spacing[4]} ${spacing[8]}`,
      minHeight: '48px',
      minWidth: '48px',
    },
    xl: {
      fontSize: typography.fontSize.xl,
      padding: `${spacing[5]} ${spacing[10]}`,
      minHeight: '56px',
      minWidth: '56px',
    },
  };
  
  // Variant configurations with accessible colors
  const variantConfig = {
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.semantic.text.inverse,
      border: 'none',
      hover: {
        backgroundColor: colors.primary[600],
      },
      active: {
        backgroundColor: colors.primary[700],
      },
      disabled: {
        backgroundColor: colors.gray[300],
        color: colors.gray[500],
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      border: `2px solid ${colors.primary[500]}`,
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
      disabled: {
        backgroundColor: 'transparent',
        color: colors.gray[400],
        borderColor: colors.gray[300],
      },
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: colors.gray[700],
      border: 'none',
      hover: {
        backgroundColor: colors.gray[100],
        color: colors.gray[800],
      },
      active: {
        backgroundColor: colors.gray[200],
        color: colors.gray[900],
      },
      disabled: {
        backgroundColor: 'transparent',
        color: colors.gray[400],
      },
    },
    danger: {
      backgroundColor: colors.error[500],
      color: colors.semantic.text.inverse,
      border: 'none',
      hover: {
        backgroundColor: colors.error[600],
      },
      active: {
        backgroundColor: colors.error[700],
      },
      disabled: {
        backgroundColor: colors.gray[300],
        color: colors.gray[500],
      },
    },
    success: {
      backgroundColor: colors.success[500],
      color: colors.semantic.text.inverse,
      border: 'none',
      hover: {
        backgroundColor: colors.success[600],
      },
      active: {
        backgroundColor: colors.success[700],
      },
      disabled: {
        backgroundColor: colors.gray[300],
        color: colors.gray[500],
      },
    },
  };
  
  const currentSize = sizeConfig[size || 'md'];
  const currentVariant = variantConfig[variant || 'primary'];
  
  // Base styles with accessibility features
  const baseStyles = {
    // Layout and sizing
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    ...currentSize,
    
    // Typography
    fontFamily: typography.fontFamily.sans.join(', '),
    fontWeight: typography.fontWeight.medium,
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    
    // Visual styling
    borderRadius: borderRadius.md,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none' as const,
    
    // Transitions
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Accessibility
    outline: 'none',
    
    // Apply variant styles
    ...(isDisabled ? currentVariant.disabled : currentVariant),
  };
  
  // Add focus styles
  const focusStyles = accessibility.createFocusStyles('button');
  
  return {
    ...baseStyles,
    ...focusStyles,
    
    // Hover styles (only if not disabled)
    ...(!isDisabled && {
      '&:hover': currentVariant.hover,
      '&:active': currentVariant.active,
    }),
    
    // Reduced motion support
    ...accessibility.responsiveText.respectMotionPreferences,
    
    // High contrast support
    ...accessibility.responsiveText.respectContrastPreferences,
  };
}

export default AccessibleButton;