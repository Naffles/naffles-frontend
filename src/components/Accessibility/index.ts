/**
 * Accessibility Components - Export all accessibility-related components and utilities
 * 
 * This file provides a centralized export for all accessibility components,
 * hooks, and utilities to ensure easy access and consistent usage across
 * the application.
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

// Core accessibility components
export { default as AccessibleButton } from './AccessibleButton';
export { default as AccessibleInput } from './AccessibleInput';
export { default as AccessibleModal } from './AccessibleModal';

// Accessibility provider and hooks
export { 
  default as AccessibilityProvider,
  useAccessibility,
  useAnnouncement,
  useFocusManagement,
  useAccessibilityTesting
} from './AccessibilityProvider';

// Testing components
export { default as AccessibilityTestPanel } from './AccessibilityTestPanel';

// Re-export accessibility utilities from design system
export { accessibility } from '../../styles/design-system/accessibility';

// Re-export testing utilities
export { 
  AccessibilityTester,
  manualTesting,
  quickAccessibilityTest
} from '../../utils/accessibilityTesting';

// Type exports
export type { AccessibilityReport, AccessibilityTestResults } from '../../utils/accessibilityTesting';