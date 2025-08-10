/**
 * Accessibility System - WCAG 2.1 AA compliant design system utilities
 * 
 * This file implements comprehensive accessibility features including:
 * - Color contrast validation and utilities
 * - Focus management system
 * - ARIA label and semantic markup helpers
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Responsive text scaling
 * - Accessibility testing utilities
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import { colors, typography, spacing, shadows, borderRadius } from './tokens';

// =============================================================================
// COLOR CONTRAST UTILITIES - WCAG 2.1 AA Compliance
// =============================================================================

/**
 * WCAG 2.1 AA contrast ratio requirements
 */
export const contrastRatios = {
    normal: 4.5,    // Normal text (under 18pt or under 14pt bold)
    large: 3.0,     // Large text (18pt+ or 14pt+ bold)
    ui: 3.0,        // UI components and graphical objects
    enhanced: 7.0,  // AAA level for enhanced contrast
} as const;

/**
 * Calculate relative luminance of a color
 * @param hex - Hex color string
 * @returns Relative luminance value (0-1)
 */
export const getRelativeLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const { r, g, b } = rgb;

    // Convert to sRGB
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    // Apply gamma correction
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    // Calculate relative luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Convert hex to RGB
 * @param hex - Hex color string
 * @returns RGB object or null
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getRelativeLuminance(color1);
    const lum2 = getRelativeLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color combination meets WCAG contrast requirements
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param level - WCAG level ('normal', 'large', 'ui', 'enhanced')
 * @returns Object with compliance information
 */
export const checkContrastCompliance = (
    foreground: string,
    background: string,
    level: keyof typeof contrastRatios = 'normal'
): {
    ratio: number;
    passes: boolean;
    level: string;
    recommendation?: string;
} => {
    const ratio = getContrastRatio(foreground, background);
    const requiredRatio = contrastRatios[level];
    const passes = ratio >= requiredRatio;

    let recommendation: string | undefined;
    if (!passes) {
        if (ratio < contrastRatios.large) {
            recommendation = 'Consider using a darker foreground or lighter background color';
        } else if (ratio < contrastRatios.normal) {
            recommendation = 'This combination may work for large text only';
        }
    }

    return {
        ratio: Math.round(ratio * 100) / 100,
        passes,
        level,
        recommendation,
    };
};

/**
 * Get accessible text color for a given background
 * @param backgroundColor - Background color (hex)
 * @param preferredColor - Preferred text color (optional)
 * @returns Accessible text color
 */
export const getAccessibleTextColor = (
    backgroundColor: string,
    preferredColor?: string
): string => {
    const testColors = [
        preferredColor,
        colors.semantic.text.primary,
        colors.semantic.text.inverse,
        colors.gray[900],
        colors.gray[100],
    ].filter(Boolean) as string[];

    for (const color of testColors) {
        const compliance = checkContrastCompliance(color, backgroundColor);
        if (compliance.passes) {
            return color;
        }
    }

    // Fallback to high contrast
    const backgroundLuminance = getRelativeLuminance(backgroundColor);
    return backgroundLuminance > 0.5 ? colors.gray[900] : colors.gray[100];
};

/**
 * Validate all color combinations in the design system
 * @returns Array of validation results
 */
export const validateDesignSystemContrast = (): Array<{
    combination: string;
    foreground: string;
    background: string;
    compliance: ReturnType<typeof checkContrastCompliance>;
}> => {
    const results: Array<{
        combination: string;
        foreground: string;
        background: string;
        compliance: ReturnType<typeof checkContrastCompliance>;
    }> = [];

    // Test common color combinations
    const testCombinations = [
        { name: 'Primary text on white', fg: colors.semantic.text.primary, bg: colors.semantic.background },
        { name: 'Secondary text on white', fg: colors.semantic.text.secondary, bg: colors.semantic.background },
        { name: 'White text on primary', fg: colors.semantic.text.inverse, bg: colors.primary[500] },
        { name: 'White text on secondary', fg: colors.semantic.text.inverse, bg: colors.secondary[500] },
        { name: 'Primary text on surface', fg: colors.semantic.text.primary, bg: colors.semantic.surface },
        { name: 'Error text on error bg', fg: colors.error[800], bg: colors.error[50] },
        { name: 'Success text on success bg', fg: colors.success[800], bg: colors.success[50] },
        { name: 'Warning text on warning bg', fg: colors.warning[800], bg: colors.warning[50] },
    ];

    testCombinations.forEach(({ name, fg, bg }) => {
        results.push({
            combination: name,
            foreground: fg,
            background: bg,
            compliance: checkContrastCompliance(fg, bg),
        });
    });

    return results;
};

// =============================================================================
// FOCUS MANAGEMENT SYSTEM
// =============================================================================

/**
 * Focus indicator styles that meet accessibility requirements
 */
export const focusStyles = {
    // Base focus ring
    base: {
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
        borderRadius: borderRadius.md,
    },

    // High contrast focus ring
    highContrast: {
        outline: `2px solid ${colors.primary[500]}`,
        outlineOffset: '2px',
        boxShadow: 'none',
    },

    // Subtle focus ring for cards and containers
    subtle: {
        outline: 'none',
        boxShadow: `0 0 0 2px ${colors.primary[300]}`,
        borderRadius: borderRadius.lg,
    },

    // Focus ring for dark backgrounds
    inverse: {
        outline: 'none',
        boxShadow: `0 0 0 3px ${colors.gray[100]}`,
        borderRadius: borderRadius.md,
    },

    // Focus ring for buttons
    button: {
        outline: 'none',
        boxShadow: `${shadows.sm}, 0 0 0 3px ${colors.primary[200]}`,
    },

    // Focus ring for inputs
    input: {
        outline: 'none',
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },

    // Focus ring for error states
    error: {
        outline: 'none',
        borderColor: colors.error[500],
        boxShadow: `0 0 0 3px ${colors.error[200]}`,
    },

    // Focus ring for success states
    success: {
        outline: 'none',
        borderColor: colors.success[500],
        boxShadow: `0 0 0 3px ${colors.success[200]}`,
    },
};

/**
 * Create focus styles based on context
 * @param context - Focus context ('default', 'button', 'input', 'card', 'inverse')
 * @param state - Component state ('default', 'error', 'success')
 * @returns Focus styles object
 */
export const createFocusStyles = (
    context: 'default' | 'button' | 'input' | 'card' | 'inverse' = 'default',
    state: 'default' | 'error' | 'success' = 'default'
) => {
    const baseStyles = {
        '&:focus': {
            outline: 'none',
        },
        '&:focus-visible': {},
    };

    let focusStyle;

    if (state === 'error') {
        focusStyle = focusStyles.error;
    } else if (state === 'success') {
        focusStyle = focusStyles.success;
    } else {
        switch (context) {
            case 'button':
                focusStyle = focusStyles.button;
                break;
            case 'input':
                focusStyle = focusStyles.input;
                break;
            case 'card':
                focusStyle = focusStyles.subtle;
                break;
            case 'inverse':
                focusStyle = focusStyles.inverse;
                break;
            default:
                focusStyle = focusStyles.base;
        }
    }

    baseStyles['&:focus-visible'] = focusStyle;

    return baseStyles;
};

/**
 * Focus trap utility for modals and dropdowns
 */
export const focusTrapStyles = {
    // Container that traps focus
    container: {
        '&:focus': {
            outline: 'none',
        },
    },

    // First focusable element
    firstFocusable: {
        // Will be focused when trap is activated
    },

    // Last focusable element
    lastFocusable: {
        // Focus will wrap to first element after this
    },
};

// =============================================================================
// ARIA LABELS AND SEMANTIC MARKUP
// =============================================================================

/**
 * ARIA label helpers and semantic markup utilities
 */
export const ariaHelpers = {
    /**
     * Create ARIA attributes for buttons
     * @param label - Accessible label
     * @param description - Optional description
     * @param pressed - Button pressed state
     * @param expanded - Button expanded state (for dropdowns)
     * @returns ARIA attributes object
     */
    button: (
        label: string,
        description?: string,
        pressed?: boolean,
        expanded?: boolean
    ) => ({
        'aria-label': label,
        'aria-describedby': description ? `${label.replace(/\s+/g, '-').toLowerCase()}-desc` : undefined,
        'aria-pressed': pressed !== undefined ? pressed : undefined,
        'aria-expanded': expanded !== undefined ? expanded : undefined,
        role: 'button',
    }),

    /**
     * Create ARIA attributes for form inputs
     * @param label - Input label
     * @param required - Whether input is required
     * @param invalid - Whether input has validation errors
     * @param describedBy - ID of element describing the input
     * @returns ARIA attributes object
     */
    input: (
        label: string,
        required: boolean = false,
        invalid: boolean = false,
        describedBy?: string
    ) => ({
        'aria-label': label,
        'aria-required': required,
        'aria-invalid': invalid,
        'aria-describedby': describedBy,
    }),

    /**
     * Create ARIA attributes for navigation
     * @param label - Navigation label
     * @param current - Current page/section
     * @returns ARIA attributes object
     */
    navigation: (label: string, current?: string) => ({
        'aria-label': label,
        'aria-current': current,
        role: 'navigation',
    }),

    /**
     * Create ARIA attributes for tabs
     * @param label - Tab label
     * @param selected - Whether tab is selected
     * @param controls - ID of panel controlled by tab
     * @returns ARIA attributes object
     */
    tab: (label: string, selected: boolean, controls: string) => ({
        'aria-label': label,
        'aria-selected': selected,
        'aria-controls': controls,
        role: 'tab',
        tabIndex: selected ? 0 : -1,
    }),

    /**
     * Create ARIA attributes for tab panels
     * @param label - Panel label
     * @param labelledBy - ID of tab that controls this panel
     * @returns ARIA attributes object
     */
    tabPanel: (label: string, labelledBy: string) => ({
        'aria-label': label,
        'aria-labelledby': labelledBy,
        role: 'tabpanel',
        tabIndex: 0,
    }),

    /**
     * Create ARIA attributes for modals
     * @param label - Modal title
     * @param describedBy - ID of element describing modal content
     * @returns ARIA attributes object
     */
    modal: (label: string, describedBy?: string) => ({
        'aria-label': label,
        'aria-describedby': describedBy,
        'aria-modal': true,
        role: 'dialog',
    }),

    /**
     * Create ARIA attributes for live regions
     * @param politeness - How assertive the announcement should be
     * @param atomic - Whether to announce the entire region or just changes
     * @returns ARIA attributes object
     */
    liveRegion: (
        politeness: 'polite' | 'assertive' | 'off' = 'polite',
        atomic: boolean = false
    ) => ({
        'aria-live': politeness,
        'aria-atomic': atomic,
    }),

    /**
     * Create ARIA attributes for progress indicators
     * @param label - Progress label
     * @param value - Current value
     * @param min - Minimum value
     * @param max - Maximum value
     * @returns ARIA attributes object
     */
    progress: (label: string, value: number, min: number = 0, max: number = 100) => ({
        'aria-label': label,
        'aria-valuenow': value,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': `${value} of ${max}`,
        role: 'progressbar',
    }),

    /**
     * Create ARIA attributes for expandable content
     * @param label - Control label
     * @param expanded - Whether content is expanded
     * @param controls - ID of controlled content
     * @returns ARIA attributes object
     */
    expandable: (label: string, expanded: boolean, controls: string) => ({
        'aria-label': label,
        'aria-expanded': expanded,
        'aria-controls': controls,
    }),
};

/**
 * Semantic HTML element recommendations
 */
export const semanticElements = {
    // Page structure
    structure: {
        header: 'Use <header> for page/section headers',
        nav: 'Use <nav> for navigation menus',
        main: 'Use <main> for primary page content',
        aside: 'Use <aside> for sidebar content',
        footer: 'Use <footer> for page/section footers',
        section: 'Use <section> for thematic groupings',
        article: 'Use <article> for standalone content',
    },

    // Content elements
    content: {
        h1: 'Use <h1> for page title (only one per page)',
        h2: 'Use <h2> for major section headings',
        h3: 'Use <h3> for subsection headings',
        p: 'Use <p> for paragraphs of text',
        ul: 'Use <ul> for unordered lists',
        ol: 'Use <ol> for ordered lists',
        dl: 'Use <dl> for definition lists',
        blockquote: 'Use <blockquote> for quoted content',
        figure: 'Use <figure> for images with captions',
        figcaption: 'Use <figcaption> for figure captions',
    },

    // Interactive elements
    interactive: {
        button: 'Use <button> for clickable actions',
        a: 'Use <a> for navigation links',
        input: 'Use <input> for form inputs',
        textarea: 'Use <textarea> for multi-line text',
        select: 'Use <select> for dropdown selections',
        label: 'Use <label> for input labels',
        fieldset: 'Use <fieldset> to group related inputs',
        legend: 'Use <legend> for fieldset titles',
    },
};

// =============================================================================
// KEYBOARD NAVIGATION SUPPORT
// =============================================================================

/**
 * Keyboard navigation utilities and event handlers
 */
export const keyboardNavigation = {
    /**
     * Standard keyboard shortcuts
     */
    shortcuts: {
        ENTER: 'Enter',
        SPACE: ' ',
        ESCAPE: 'Escape',
        TAB: 'Tab',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        HOME: 'Home',
        END: 'End',
        PAGE_UP: 'PageUp',
        PAGE_DOWN: 'PageDown',
    },

    /**
     * Create keyboard event handler for buttons
     * @param onClick - Click handler function
     * @returns Keyboard event handler
     */
    buttonHandler: (onClick: () => void) => (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    },

    /**
     * Create keyboard event handler for navigation
     * @param onNavigate - Navigation handler function
     * @returns Keyboard event handler
     */
    navigationHandler: (onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void) =>
        (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    onNavigate('up');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    onNavigate('down');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    onNavigate('left');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    onNavigate('right');
                    break;
            }
        },

    /**
     * Create keyboard event handler for modals
     * @param onClose - Close handler function
     * @returns Keyboard event handler
     */
    modalHandler: (onClose: () => void) => (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
        }
    },

    /**
     * Create keyboard event handler for tabs
     * @param onTabChange - Tab change handler
     * @param tabCount - Total number of tabs
     * @param currentTab - Current active tab index
     * @returns Keyboard event handler
     */
    tabHandler: (
        onTabChange: (index: number) => void,
        tabCount: number,
        currentTab: number
    ) => (event: KeyboardEvent) => {
        let newTab = currentTab;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newTab = currentTab > 0 ? currentTab - 1 : tabCount - 1;
                break;
            case 'ArrowRight':
                event.preventDefault();
                newTab = currentTab < tabCount - 1 ? currentTab + 1 : 0;
                break;
            case 'Home':
                event.preventDefault();
                newTab = 0;
                break;
            case 'End':
                event.preventDefault();
                newTab = tabCount - 1;
                break;
        }

        if (newTab !== currentTab) {
            onTabChange(newTab);
        }
    },
};

/**
 * Tab index management utilities
 */
export const tabIndexManagement = {
    /**
     * Make element focusable
     */
    focusable: {
        tabIndex: 0,
    },

    /**
     * Remove element from tab order but keep programmatically focusable
     */
    programmaticOnly: {
        tabIndex: -1,
    },

    /**
     * Remove element from tab order completely
     */
    notFocusable: {
        tabIndex: -1,
        'aria-hidden': true,
    },

    /**
     * Skip element in tab order (for decorative elements)
     */
    skip: {
        tabIndex: -1,
        'aria-hidden': true,
    },
};

// =============================================================================
// SCREEN READER COMPATIBILITY
// =============================================================================

/**
 * Screen reader utilities and announcements
 */
export const screenReader = {
    /**
     * Visually hidden but available to screen readers
     */
    srOnly: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        border: '0',
    },

    /**
     * Show element when focused (for skip links)
     */
    srOnlyFocusable: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap' as const,
        border: '0',

        '&:focus': {
            position: 'static',
            width: 'auto',
            height: 'auto',
            padding: spacing[2],
            margin: '0',
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
            border: `2px solid ${colors.primary[500]}`,
            backgroundColor: colors.semantic.background,
            color: colors.semantic.text.primary,
            textDecoration: 'none',
            zIndex: 9999,
        },
    },

    /**
     * Create announcement for screen readers
     * @param message - Message to announce
     * @param priority - Announcement priority
     * @returns Announcement element props
     */
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => ({
        'aria-live': priority,
        'aria-atomic': true,
        style: screenReader.srOnly,
        children: message,
    }),

    /**
     * Create loading announcement
     * @param isLoading - Loading state
     * @param message - Custom loading message
     * @returns Loading announcement props
     */
    loadingAnnouncement: (isLoading: boolean, message: string = 'Loading') => ({
        'aria-live': 'polite' as const,
        'aria-atomic': true,
        style: screenReader.srOnly,
        children: isLoading ? message : '',
    }),

    /**
     * Create error announcement
     * @param error - Error message
     * @returns Error announcement props
     */
    errorAnnouncement: (error: string | null) => ({
        'aria-live': 'assertive' as const,
        'aria-atomic': true,
        style: screenReader.srOnly,
        children: error || '',
    }),
};

/**
 * Alt text guidelines and helpers
 */
export const altTextHelpers = {
    /**
     * Generate alt text for decorative images
     */
    decorative: '',

    /**
     * Generate alt text for informative images
     * @param description - Image description
     * @returns Alt text
     */
    informative: (description: string) => description,

    /**
     * Generate alt text for functional images (buttons, links)
     * @param action - Action the image performs
     * @returns Alt text
     */
    functional: (action: string) => action,

    /**
     * Generate alt text for complex images (charts, graphs)
     * @param summary - Brief summary
     * @param detailsId - ID of element with detailed description
     * @returns Alt text and aria-describedby
     */
    complex: (summary: string, detailsId: string) => ({
        alt: summary,
        'aria-describedby': detailsId,
    }),
};

// =============================================================================
// RESPONSIVE TEXT SCALING
// =============================================================================

/**
 * Base font sizes that scale with user preferences
 */
const responsiveTextScalable = {
    xs: {
        fontSize: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        lineHeight: typography.lineHeight.tight,
    },
    sm: {
        fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        lineHeight: typography.lineHeight.normal,
    },
    base: {
        fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        lineHeight: typography.lineHeight.normal,
    },
    lg: {
        fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        lineHeight: typography.lineHeight.snug,
    },
    xl: {
        fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        lineHeight: typography.lineHeight.snug,
    },
    '2xl': {
        fontSize: 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        lineHeight: typography.lineHeight.tight,
    },
    '3xl': {
        fontSize: 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        lineHeight: typography.lineHeight.tight,
    },
    '4xl': {
        fontSize: 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
        lineHeight: typography.lineHeight.none,
    },
} as const;

/**
 * Responsive text scaling that respects user preferences
 */
export const responsiveText = {
    /**
     * Base font sizes that scale with user preferences
     */
    scalable: responsiveTextScalable,

    /**
     * Create responsive text styles
     * @param size - Base size key
     * @param weight - Font weight
     * @returns Responsive text styles
     */
    create: (
        size: keyof typeof responsiveTextScalable,
        weight: keyof typeof typography.fontWeight = 'normal'
    ) => ({
        ...responsiveTextScalable[size],
        fontWeight: typography.fontWeight[weight],
        fontFamily: typography.fontFamily.sans.join(', '),
    }),

    /**
     * Respect user's motion preferences
     */
    respectMotionPreferences: {
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            animation: 'none',
        },
    },

    /**
     * Respect user's contrast preferences
     */
    respectContrastPreferences: {
        '@media (prefers-contrast: high)': {
            borderWidth: '2px',
            outline: `2px solid ${colors.primary[500]}`,
        },
    },
};

// =============================================================================
// ACCESSIBILITY TESTING UTILITIES
// =============================================================================

/**
 * Automated accessibility testing helpers
 */
export const accessibilityTesting = {
    /**
     * Test all color combinations for contrast compliance
     * @returns Test results
     */
    testColorContrast: () => {
        return validateDesignSystemContrast();
    },

    /**
     * Test focus indicators
     * @param element - Element to test
     * @returns Test result
     */
    testFocusIndicators: (element: HTMLElement) => {
        const computedStyle = window.getComputedStyle(element, ':focus-visible');
        const hasOutline = computedStyle.outline !== 'none';
        const hasBoxShadow = computedStyle.boxShadow !== 'none';

        return {
            hasFocusIndicator: hasOutline || hasBoxShadow,
            outline: computedStyle.outline,
            boxShadow: computedStyle.boxShadow,
        };
    },

    /**
     * Test keyboard navigation
     * @param container - Container element
     * @returns Focusable elements
     */
    testKeyboardNavigation: (container: HTMLElement) => {
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
        ];

        const focusableElements = container.querySelectorAll(focusableSelectors.join(', '));

        return {
            count: focusableElements.length,
            elements: Array.from(focusableElements),
            hasTabOrder: Array.from(focusableElements).every(el => {
                const tabIndex = el.getAttribute('tabindex');
                return tabIndex === null || parseInt(tabIndex) >= 0;
            }),
        };
    },

    /**
     * Test ARIA labels
     * @param element - Element to test
     * @returns ARIA label information
     */
    testAriaLabels: (element: HTMLElement) => {
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        const ariaDescribedBy = element.getAttribute('aria-describedby');

        return {
            hasLabel: !!(ariaLabel || ariaLabelledBy),
            ariaLabel,
            ariaLabelledBy,
            ariaDescribedBy,
            isInteractive: ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()),
        };
    },

    /**
     * Generate accessibility report
     * @param container - Container to test
     * @returns Comprehensive accessibility report
     */
    generateReport: (container: HTMLElement = document.body) => {
        const colorTests = accessibilityTesting.testColorContrast();
        const keyboardTests = accessibilityTesting.testKeyboardNavigation(container);

        const interactiveElements = container.querySelectorAll('button, input, select, textarea, a[href]');
        const ariaTests = Array.from(interactiveElements).map(el =>
            accessibilityTesting.testAriaLabels(el as HTMLElement)
        );

        const images = container.querySelectorAll('img');
        const imageTests = Array.from(images).map(img => ({
            src: img.src,
            alt: img.alt,
            hasAlt: !!img.alt,
            isDecorative: img.alt === '',
        }));

        return {
            colorContrast: {
                total: colorTests.length,
                passed: colorTests.filter(test => test.compliance.passes).length,
                failed: colorTests.filter(test => !test.compliance.passes).length,
                details: colorTests,
            },
            keyboardNavigation: keyboardTests,
            ariaLabels: {
                total: ariaTests.length,
                withLabels: ariaTests.filter(test => test.hasLabel).length,
                withoutLabels: ariaTests.filter(test => !test.hasLabel).length,
                details: ariaTests,
            },
            images: {
                total: imageTests.length,
                withAlt: imageTests.filter(test => test.hasAlt).length,
                withoutAlt: imageTests.filter(test => !test.hasAlt && !test.isDecorative).length,
                decorative: imageTests.filter(test => test.isDecorative).length,
                details: imageTests,
            },
        };
    },
};

// =============================================================================
// ACCESSIBILITY COMPONENT MIXINS
// =============================================================================

/**
 * Pre-built accessibility mixins for common components
 */
export const accessibilityMixins = {
    /**
     * Accessible button mixin
     */
    button: {
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '44px', // Minimum touch target
        minWidth: '44px',
        ...createFocusStyles('button'),

        '&:disabled': {
            cursor: 'not-allowed',
            opacity: 0.6,
        },

        '&[aria-pressed="true"]': {
            // Pressed state styles
        },
    },

    /**
     * Accessible input mixin
     */
    input: {
        font: 'inherit',
        border: `1px solid ${colors.gray[300]}`,
        borderRadius: borderRadius.md,
        padding: `${spacing[2]} ${spacing[3]}`,
        minHeight: '44px', // Minimum touch target
        ...createFocusStyles('input'),

        '&:invalid': {
            borderColor: colors.error[500],
        },

        '&:disabled': {
            backgroundColor: colors.gray[100],
            cursor: 'not-allowed',
            opacity: 0.6,
        },
    },

    /**
     * Accessible card mixin
     */
    card: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.semantic.surface,
        border: `1px solid ${colors.gray[200]}`,
        ...createFocusStyles('card'),

        '&[role="button"]': {
            cursor: 'pointer',
            transition: 'all 200ms ease',

            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: shadows.lg,
            },
        },
    },

    /**
     * Accessible navigation mixin
     */
    navigation: {
        '& a': {
            textDecoration: 'none',
            color: colors.semantic.text.primary,
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borderRadius.md,
            display: 'block',
            ...createFocusStyles(),

            '&:hover': {
                backgroundColor: colors.gray[100],
            },

            '&[aria-current="page"]': {
                backgroundColor: colors.primary[100],
                color: colors.primary[700],
                fontWeight: typography.fontWeight.medium,
            },
        },
    },

    /**
     * Accessible modal mixin
     */
    modal: {
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

        '& [role="dialog"]': {
            backgroundColor: colors.semantic.background,
            borderRadius: borderRadius.lg,
            boxShadow: shadows['2xl'],
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            ...createFocusStyles(),
        },
    },
};

// Export all accessibility utilities
export const accessibility = {
    contrastRatios,
    getRelativeLuminance,
    getContrastRatio,
    checkContrastCompliance,
    getAccessibleTextColor,
    validateDesignSystemContrast,
    focusStyles,
    createFocusStyles,
    focusTrapStyles,
    ariaHelpers,
    semanticElements,
    keyboardNavigation,
    tabIndexManagement,
    screenReader,
    altTextHelpers,
    responsiveText,
    accessibilityTesting,
    accessibilityMixins,
};

export default accessibility;