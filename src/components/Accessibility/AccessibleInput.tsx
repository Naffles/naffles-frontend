/**
 * AccessibleInput - WCAG 2.1 AA compliant input component
 * 
 * Features:
 * - Proper color contrast ratios
 * - Visible focus indicators
 * - ARIA labels and semantic markup
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Form validation states
 * - Responsive text scaling
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { accessibility } from '../../styles/design-system/accessibility';
import { colors, typography, spacing, borderRadius } from '../../styles/design-system/tokens';

interface AccessibleInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label (required for accessibility) */
  label: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Input variant */
  variant?: 'default' | 'error' | 'success';
  /** Help text */
  helpText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Icon element */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Whether to show the label visually */
  showLabel?: boolean;
  /** Additional description for screen readers */
  description?: string;
  /** Custom container className */
  containerClassName?: string;
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      size = 'md',
      variant = 'default',
      helpText,
      error,
      success,
      required = false,
      icon,
      iconPosition = 'left',
      showLabel = true,
      description,
      containerClassName = '',
      className = '',
      id,
      disabled,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for ARIA relationships
    const inputId = id || React.useId();
    const labelId = `${inputId}-label`;
    const helpTextId = helpText ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const successId = success ? `${inputId}-success` : undefined;
    const descriptionId = description ? `${inputId}-desc` : undefined;
    
    // Determine current state
    const currentVariant = error ? 'error' : success ? 'success' : variant;
    const isInvalid = !!error;
    
    // Build aria-describedby string
    const describedByIds = [
      ariaDescribedBy,
      helpTextId,
      errorId,
      successId,
      descriptionId,
    ].filter(Boolean).join(' ');
    
    // Create ARIA attributes
    const ariaAttributes = accessibility.ariaHelpers.input(
      label,
      required,
      isInvalid,
      describedByIds || undefined
    );
    
    // Create input styles
    const inputStyles = createInputStyles(size, currentVariant, disabled || false, !!icon, iconPosition);
    const containerStyles = createContainerStyles();
    const labelStyles = createLabelStyles(showLabel, required);
    
    return (
      <div style={containerStyles} className={containerClassName}>
        {/* Label */}
        <label
          id={labelId}
          htmlFor={inputId}
          style={labelStyles}
        >
          {label}
          {required && (
            <span
              style={{ color: colors.error[500], marginLeft: spacing[1] }}
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
        
        {/* Input container with icon support */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <div
              style={{
                position: 'absolute',
                left: spacing[3],
                zIndex: 1,
                color: disabled ? colors.gray[400] : colors.gray[500],
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={className}
            style={inputStyles}
            {...ariaAttributes}
            {...(describedByIds && { 'aria-describedby': describedByIds })}
            {...props}
          />
          
          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <div
              style={{
                position: 'absolute',
                right: spacing[3],
                zIndex: 1,
                color: disabled ? colors.gray[400] : colors.gray[500],
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
        
        {/* Help text */}
        {helpText && (
          <div
            id={helpTextId}
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
              marginTop: spacing[1],
            }}
          >
            {helpText}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div
            id={errorId}
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.error[600],
              marginTop: spacing[1],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
            role="alert"
            aria-live="polite"
          >
            <span aria-hidden="true">⚠</span>
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div
            id={successId}
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.success[600],
              marginTop: spacing[1],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true">✓</span>
            {success}
          </div>
        )}
        
        {/* Additional description for screen readers */}
        {description && (
          <div
            id={descriptionId}
            style={accessibility.screenReader.srOnly}
          >
            {description}
          </div>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

/**
 * Create input styles with accessibility considerations
 */
function createInputStyles(
  size: AccessibleInputProps['size'],
  variant: 'default' | 'error' | 'success',
  isDisabled: boolean,
  hasIcon: boolean,
  iconPosition: 'left' | 'right'
) {
  // Size configurations
  const sizeConfig = {
    sm: {
      fontSize: typography.fontSize.sm,
      padding: `${spacing[2]} ${spacing[3]}`,
      height: '36px',
    },
    md: {
      fontSize: typography.fontSize.base,
      padding: `${spacing[3]} ${spacing[4]}`,
      height: '44px', // WCAG minimum touch target
    },
    lg: {
      fontSize: typography.fontSize.lg,
      padding: `${spacing[4]} ${spacing[5]}`,
      height: '52px',
    },
  };
  
  // Variant configurations with accessible colors
  const variantConfig = {
    default: {
      borderColor: colors.gray[300],
      focusBorderColor: colors.primary[500],
      focusBoxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    error: {
      borderColor: colors.error[500],
      focusBorderColor: colors.error[500],
      focusBoxShadow: `0 0 0 3px ${colors.error[200]}`,
    },
    success: {
      borderColor: colors.success[500],
      focusBorderColor: colors.success[500],
      focusBoxShadow: `0 0 0 3px ${colors.success[200]}`,
    },
  };
  
  const currentSize = sizeConfig[size || 'md'];
  const currentVariant = variantConfig[variant];
  
  // Adjust padding for icons
  let paddingLeft = currentSize.padding.split(' ')[1];
  let paddingRight = currentSize.padding.split(' ')[1];
  
  if (hasIcon) {
    if (iconPosition === 'left') {
      paddingLeft = spacing[10]; // Space for icon
    } else {
      paddingRight = spacing[10]; // Space for icon
    }
  }
  
  return {
    // Layout and sizing
    width: '100%',
    ...currentSize,
    paddingLeft,
    paddingRight,
    
    // Typography
    fontFamily: typography.fontFamily.sans.join(', '),
    lineHeight: typography.lineHeight.normal,
    
    // Visual styling
    backgroundColor: isDisabled ? colors.gray[100] : colors.semantic.background,
    border: `1px solid ${currentVariant.borderColor}`,
    borderRadius: borderRadius.md,
    color: isDisabled ? colors.gray[500] : colors.semantic.text.primary,
    
    // Interactions
    cursor: isDisabled ? 'not-allowed' : 'text',
    outline: 'none',
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Placeholder styling
    '&::placeholder': {
      color: colors.gray[500],
      opacity: 1,
    },
    
    // Focus styles
    '&:focus': {
      borderColor: currentVariant.focusBorderColor,
      boxShadow: currentVariant.focusBoxShadow,
    },
    
    // Disabled styles
    ...(isDisabled && {
      backgroundColor: colors.gray[100],
      borderColor: colors.gray[300],
      color: colors.gray[500],
      cursor: 'not-allowed',
      '&::placeholder': {
        color: colors.gray[400],
      },
    }),
    
    // Reduced motion support
    ...accessibility.responsiveText.respectMotionPreferences,
    
    // High contrast support
    ...accessibility.responsiveText.respectContrastPreferences,
  };
}

/**
 * Create container styles
 */
function createContainerStyles() {
  return {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[2],
    width: '100%',
  };
}

/**
 * Create label styles
 */
function createLabelStyles(showLabel: boolean, _required: boolean) {
  const baseStyles = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.semantic.text.primary,
    lineHeight: typography.lineHeight.normal,
    cursor: 'pointer',
  };
  
  if (!showLabel) {
    return {
      ...baseStyles,
      ...accessibility.screenReader.srOnly,
    };
  }
  
  return baseStyles;
}

export default AccessibleInput;