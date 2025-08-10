/**
 * AccessibleModal - WCAG 2.1 AA compliant modal component
 * 
 * Features:
 * - Focus management and trapping
 * - Keyboard navigation (ESC to close)
 * - ARIA labels and semantic markup
 * - Screen reader announcements
 * - Backdrop click handling
 * - Proper z-index layering
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import React, { useEffect, useRef, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { accessibility } from '../../styles/design-system/accessibility';
import { colors, spacing, borderRadius, shadows } from '../../styles/design-system/tokens';

interface AccessibleModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Modal title (required for accessibility) */
  title: string;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether clicking the backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether pressing ESC closes the modal */
  closeOnEscape?: boolean;
  /** Additional description for screen readers */
  description?: string;
  /** Custom header content */
  header?: ReactNode;
  /** Modal body content */
  children: ReactNode;
  /** Custom footer content */
  footer?: ReactNode;
  /** Custom container className */
  containerClassName?: string;
  /** Custom modal className */
  modalClassName?: string;
  /** Initial focus element selector */
  initialFocus?: string;
  /** Element to return focus to when modal closes */
  returnFocus?: HTMLElement;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  description,
  header,
  children,
  footer,
  containerClassName = '',
  modalClassName = '',
  initialFocus,
  returnFocus,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);
  
  // Generate unique IDs for ARIA relationships
  const modalId = React.useId();
  const titleId = `${modalId}-title`;
  const descriptionId = description ? `${modalId}-desc` : undefined;
  
  // Get focusable elements within the modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ];
    
    return Array.from(
      modalRef.current.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];
  }, []);
  
  // Handle focus trapping
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    const focusableElements = getFocusableElements();
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
      onClose();
    } else if (event.key === 'Tab') {
      handleTabKey(event);
    }
  }, [closeOnEscape, onClose, handleTabKey]);
  
  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);
  
  // Manage focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus management
      setTimeout(() => {
        if (modalRef.current) {
          // Try to focus the initial focus element
          if (initialFocus) {
            const initialElement = modalRef.current.querySelector(initialFocus) as HTMLElement;
            if (initialElement) {
              initialElement.focus();
              return;
            }
          }
          
          // Focus the first focusable element
          const focusableElements = getFocusableElements();
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            // Focus the modal itself if no focusable elements
            modalRef.current.focus();
          }
        }
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus
      if (returnFocus) {
        returnFocus.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, initialFocus, returnFocus, getFocusableElements]);
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Create modal styles
  const overlayStyles = createOverlayStyles();
  const modalStyles = createModalStyles(size);
  const headerStyles = createHeaderStyles();
  const bodyStyles = createBodyStyles();
  const footerStyles = createFooterStyles();
  
  // Create ARIA attributes
  const ariaAttributes = accessibility.ariaHelpers.modal(title, descriptionId);
  
  const modalContent = (
    <div
      style={overlayStyles}
      className={containerClassName}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        style={modalStyles}
        className={modalClassName}
        tabIndex={-1}
        {...ariaAttributes}
      >
        {/* Header */}
        <div style={headerStyles}>
          {header || (
            <>
              <h2
                id={titleId}
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: colors.semantic.text.primary,
                }}
              >
                {title}
              </h2>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: spacing[2],
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    color: colors.gray[500],
                    fontSize: '1.5rem',
                    lineHeight: 1,
                    transition: 'all 200ms ease',
                    ...accessibility.createFocusStyles('button'),
                  }}
                  aria-label="Close modal"
                >
                  ×
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Body */}
        <div style={bodyStyles}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div style={footerStyles}>
            {footer}
          </div>
        )}
        
        {/* Description for screen readers */}
        {description && (
          <div
            id={descriptionId}
            style={accessibility.screenReader.srOnly}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
  
  // Render modal in portal
  return createPortal(modalContent, document.body);
};

/**
 * Create overlay styles
 */
function createOverlayStyles() {
  return {
    position: 'fixed' as const,
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
    
    // Reduced motion support
    ...accessibility.responsiveText.respectMotionPreferences,
  };
}

/**
 * Create modal styles based on size
 */
function createModalStyles(size: AccessibleModalProps['size']) {
  const sizeConfig = {
    sm: {
      width: '24rem',
      maxWidth: '90vw',
    },
    md: {
      width: '32rem',
      maxWidth: '90vw',
    },
    lg: {
      width: '48rem',
      maxWidth: '90vw',
    },
    xl: {
      width: '64rem',
      maxWidth: '90vw',
    },
    full: {
      width: '90vw',
      height: '90vh',
    },
  };
  
  const currentSize = sizeConfig[size || 'md'];
  
  return {
    backgroundColor: colors.semantic.background,
    borderRadius: borderRadius.lg,
    boxShadow: shadows['2xl'],
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    outline: 'none',
    ...currentSize,
    
    // Focus styles
    ...accessibility.createFocusStyles('card'),
    
    // High contrast support
    ...accessibility.responsiveText.respectContrastPreferences,
  };
}

/**
 * Create header styles
 */
function createHeaderStyles() {
  return {
    padding: spacing[6],
    borderBottom: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };
}

/**
 * Create body styles
 */
function createBodyStyles() {
  return {
    padding: spacing[6],
    overflowY: 'auto' as const,
    flex: 1,
  };
}

/**
 * Create footer styles
 */
function createFooterStyles() {
  return {
    padding: spacing[6],
    borderTop: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[3],
    flexShrink: 0,
  };
}

export default AccessibleModal;