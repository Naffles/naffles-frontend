/**
 * AccessibilityProvider - Context provider for accessibility features
 * 
 * Features:
 * - Global accessibility settings
 * - User preference detection
 * - Accessibility testing utilities
 * - Screen reader announcements
 * - Focus management
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { accessibility } from '../../styles/design-system/accessibility';

interface AccessibilitySettings {
  /** Reduced motion preference */
  prefersReducedMotion: boolean;
  /** High contrast preference */
  prefersHighContrast: boolean;
  /** Color scheme preference */
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
  /** Font size scaling */
  fontSizeScale: number;
  /** Focus visible mode */
  focusVisible: boolean;
  /** Screen reader mode */
  screenReaderMode: boolean;
  /** Keyboard navigation mode */
  keyboardNavigation: boolean;
}

interface AccessibilityContextValue {
  /** Current accessibility settings */
  settings: AccessibilitySettings;
  /** Update accessibility settings */
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  /** Announce message to screen readers */
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  /** Test accessibility compliance */
  testCompliance: () => Promise<any>;
  /** Focus management utilities */
  focusManager: {
    trapFocus: (container: HTMLElement) => () => void;
    restoreFocus: (element: HTMLElement) => void;
    moveFocus: (direction: 'next' | 'previous' | 'first' | 'last') => void;
  };
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
  /** Initial accessibility settings */
  initialSettings?: Partial<AccessibilitySettings>;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  initialSettings = {},
}) => {
  // Default accessibility settings
  const [settings, setSettings] = useState<AccessibilitySettings>(() => ({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: 'no-preference',
    fontSizeScale: 1,
    focusVisible: true,
    screenReaderMode: false,
    keyboardNavigation: false,
    ...initialSettings,
  }));
  
  // Announcement state for screen readers
  const [announcement, setAnnouncement] = useState<{
    message: string;
    priority: 'polite' | 'assertive';
    id: number;
  } | null>(null);
  
  // Detect user preferences on mount
  useEffect(() => {
    const detectPreferences = () => {
      const updates: Partial<AccessibilitySettings> = {};
      
      // Detect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        updates.prefersReducedMotion = true;
      }
      
      // Detect high contrast preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        updates.prefersHighContrast = true;
      }
      
      // Detect color scheme preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updates.prefersColorScheme = 'dark';
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        updates.prefersColorScheme = 'light';
      }
      
      // Detect screen reader usage
      if (navigator.userAgent.includes('NVDA') || 
          navigator.userAgent.includes('JAWS') || 
          navigator.userAgent.includes('VoiceOver')) {
        updates.screenReaderMode = true;
      }
      
      // Update settings if any preferences detected
      if (Object.keys(updates).length > 0) {
        setSettings(prev => ({ ...prev, ...updates }));
      }
    };
    
    detectPreferences();
    
    // Listen for preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-color-scheme: light)'),
    ];
    
    const handleChange = () => detectPreferences();
    
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));
    
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, []);
  
  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size scaling
    root.style.fontSize = `${settings.fontSizeScale * 16}px`;
    
    // Apply reduced motion
    if (settings.prefersReducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Apply high contrast
    if (settings.prefersHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', settings.prefersColorScheme);
    
    // Apply focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    return () => {
      // Cleanup on unmount
      root.style.removeProperty('font-size');
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
      root.classList.remove('high-contrast', 'focus-visible');
      root.removeAttribute('data-color-scheme');
    };
  }, [settings]);
  
  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardNavigation: true }));
      }
    };
    
    const handleMouseDown = () => {
      setSettings(prev => ({ ...prev, keyboardNavigation: false }));
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  // Update settings function
  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };
  
  // Announce function for screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({
      message,
      priority,
      id: Date.now(),
    });
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncement(null);
    }, 1000);
  };
  
  // Test accessibility compliance
  const testCompliance = async () => {
    return accessibility.accessibilityTesting.generateReport();
  };
  
  // Focus management utilities
  const focusManager = {
    trapFocus: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      container.addEventListener('keydown', handleTabKey);
      
      // Focus first element
      if (firstElement) {
        firstElement.focus();
      }
      
      // Return cleanup function
      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },
    
    restoreFocus: (element: HTMLElement) => {
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    },
    
    moveFocus: (direction: 'next' | 'previous' | 'first' | 'last') => {
      const focusableElements = Array.from(
        document.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];
      
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      
      let targetIndex: number;
      
      switch (direction) {
        case 'next':
          targetIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'previous':
          targetIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case 'first':
          targetIndex = 0;
          break;
        case 'last':
          targetIndex = focusableElements.length - 1;
          break;
        default:
          return;
      }
      
      const targetElement = focusableElements[targetIndex];
      if (targetElement) {
        targetElement.focus();
      }
    },
  };
  
  const contextValue: AccessibilityContextValue = {
    settings,
    updateSettings,
    announce,
    testCompliance,
    focusManager,
  };
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Screen reader announcement region */}
      {announcement && (
        <div
          key={announcement.id}
          aria-live={announcement.priority}
          aria-atomic="true"
          style={accessibility.screenReader.srOnly}
        >
          {announcement.message}
        </div>
      )}
      
      {/* Skip to main content link */}
      <a
        href="#main-content"
        style={{
          ...accessibility.screenReader.srOnlyFocusable,
          position: 'fixed',
          top: spacing[4],
          left: spacing[4],
          zIndex: 9999,
        }}
      >
        Skip to main content
      </a>
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export const useAccessibility = (): AccessibilityContextValue => {
  const context = useContext(AccessibilityContext);
  
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
};

/**
 * Hook for screen reader announcements
 */
export const useAnnouncement = () => {
  const { announce } = useAccessibility();
  
  return {
    announce,
    announceError: (message: string) => announce(message, 'assertive'),
    announceSuccess: (message: string) => announce(message, 'polite'),
    announceLoading: (isLoading: boolean) => {
      if (isLoading) {
        announce('Loading', 'polite');
      } else {
        announce('Loading complete', 'polite');
      }
    },
  };
};

/**
 * Hook for focus management
 */
export const useFocusManagement = () => {
  const { focusManager } = useAccessibility();
  
  return focusManager;
};

/**
 * Hook for accessibility testing
 */
export const useAccessibilityTesting = () => {
  const { testCompliance } = useAccessibility();
  
  return {
    testCompliance,
    testColorContrast: () => accessibility.accessibilityTesting.testColorContrast(),
    testKeyboardNavigation: (container?: HTMLElement) => 
      accessibility.accessibilityTesting.testKeyboardNavigation(container || document.body),
    generateReport: (container?: HTMLElement) => 
      accessibility.accessibilityTesting.generateReport(container || document.body),
  };
};

export default AccessibilityProvider;