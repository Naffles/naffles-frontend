/**
 * Accessibility Testing Utilities - Automated and manual testing tools
 * 
 * This file provides utilities for testing accessibility compliance,
 * including automated checks, manual testing helpers, and reporting tools.
 * 
 * Requirement: 44.12 - Ensure accessibility compliance
 */

import { accessibility } from '../styles/design-system/accessibility';

// =============================================================================
// AUTOMATED TESTING UTILITIES
// =============================================================================

/**
 * Comprehensive accessibility test suite
 */
export class AccessibilityTester {
    private container: HTMLElement;
    private results: AccessibilityTestResults;

    constructor(container: HTMLElement = document.body) {
        this.container = container;
        this.results = {
            colorContrast: [],
            focusManagement: [],
            keyboardNavigation: [],
            ariaLabels: [],
            semanticMarkup: [],
            images: [],
            forms: [],
            headings: [],
            landmarks: [],
            overall: {
                score: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
            },
        };
    }

    /**
     * Run all accessibility tests
     */
    async runAllTests(): Promise<AccessibilityTestResults> {
        console.log('🔍 Running accessibility tests...');

        // Reset results
        this.results = {
            colorContrast: [],
            focusManagement: [],
            keyboardNavigation: [],
            ariaLabels: [],
            semanticMarkup: [],
            images: [],
            forms: [],
            headings: [],
            landmarks: [],
            overall: {
                score: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
            },
        };

        // Run individual test suites
        await this.testColorContrast();
        await this.testFocusManagement();
        await this.testKeyboardNavigation();
        await this.testAriaLabels();
        await this.testSemanticMarkup();
        await this.testImages();
        await this.testForms();
        await this.testHeadings();
        await this.testLandmarks();

        // Calculate overall score
        this.calculateOverallScore();

        console.log('✅ Accessibility tests completed');
        return this.results;
    }

    /**
     * Test color contrast compliance
     */
    private async testColorContrast(): Promise<void> {
        const elements = this.container.querySelectorAll('*');

        elements.forEach((element) => {
            const computedStyle = window.getComputedStyle(element);
            const color = computedStyle.color;
            const backgroundColor = computedStyle.backgroundColor;

            // Skip elements without visible text
            if (!element.textContent?.trim() || backgroundColor === 'rgba(0, 0, 0, 0)') {
                return;
            }

            try {
                const contrast = accessibility.getContrastRatio(color, backgroundColor);
                const fontSize = parseFloat(computedStyle.fontSize);
                const fontWeight = computedStyle.fontWeight;

                // Determine required contrast ratio
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
                const requiredRatio = isLargeText ? accessibility.contrastRatios.large : accessibility.contrastRatios.normal;

                const passes = contrast >= requiredRatio;

                this.results.colorContrast.push({
                    element: this.getElementSelector(element),
                    foreground: color,
                    background: backgroundColor,
                    contrast,
                    requiredRatio,
                    passes,
                    isLargeText,
                    recommendation: passes ? undefined : 'Increase color contrast to meet WCAG requirements',
                });

                if (passes) {
                    this.results.overall.passed++;
                } else {
                    this.results.overall.failed++;
                }
            } catch (error) {
                // Skip elements with invalid colors
            }
        });
    }

    /**
     * Test focus management
     */
    private async testFocusManagement(): Promise<void> {
        const focusableElements = this.container.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((element) => {
            const computedStyle = window.getComputedStyle(element, ':focus-visible');
            const hasOutline = computedStyle.outline !== 'none';
            const hasBoxShadow = computedStyle.boxShadow !== 'none';
            const hasFocusIndicator = hasOutline || hasBoxShadow;

            this.results.focusManagement.push({
                element: this.getElementSelector(element),
                hasFocusIndicator,
                focusStyle: {
                    outline: computedStyle.outline,
                    boxShadow: computedStyle.boxShadow,
                },
                passes: hasFocusIndicator,
                recommendation: hasFocusIndicator ? undefined : 'Add visible focus indicator',
            });

            if (hasFocusIndicator) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Test keyboard navigation
     */
    private async testKeyboardNavigation(): Promise<void> {
        const interactiveElements = this.container.querySelectorAll(
            'button, input, select, textarea, a[href], [role="button"], [role="tab"], [role="menuitem"]'
        );

        interactiveElements.forEach((element) => {
            const tabIndex = element.getAttribute('tabindex');
            const isDisabled = element.hasAttribute('disabled');
            const isKeyboardAccessible = !isDisabled && (tabIndex === null || parseInt(tabIndex) >= 0);

            // Check minimum touch target size
            const rect = element.getBoundingClientRect();
            const meetsMinimumSize = rect.width >= 44 && rect.height >= 44;

            this.results.keyboardNavigation.push({
                element: this.getElementSelector(element),
                isKeyboardAccessible,
                tabIndex: tabIndex || '0',
                meetsMinimumSize,
                size: {
                    width: rect.width,
                    height: rect.height,
                },
                passes: isKeyboardAccessible && meetsMinimumSize,
                recommendation: !isKeyboardAccessible
                    ? 'Make element keyboard accessible'
                    : !meetsMinimumSize
                        ? 'Increase touch target size to minimum 44px'
                        : undefined,
            });

            if (isKeyboardAccessible && meetsMinimumSize) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Test ARIA labels and attributes
     */
    private async testAriaLabels(): Promise<void> {
        const interactiveElements = this.container.querySelectorAll(
            'button, input, select, textarea, a[href], [role="button"], [role="tab"], [role="menuitem"]'
        );

        interactiveElements.forEach((element) => {
            const ariaLabel = element.getAttribute('aria-label');
            const ariaLabelledBy = element.getAttribute('aria-labelledby');
            const ariaDescribedBy = element.getAttribute('aria-describedby');
            const hasLabel = !!(ariaLabel || ariaLabelledBy || element.textContent?.trim());

            // Check for form labels
            let hasFormLabel = false;
            if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select') {
                const id = element.getAttribute('id');
                if (id) {
                    const label = this.container.querySelector(`label[for="${id}"]`);
                    hasFormLabel = !!label;
                }
            }

            const hasAccessibleName = hasLabel || hasFormLabel;

            this.results.ariaLabels.push({
                element: this.getElementSelector(element),
                hasAccessibleName,
                ariaLabel,
                ariaLabelledBy,
                ariaDescribedBy,
                hasFormLabel,
                passes: hasAccessibleName,
                recommendation: hasAccessibleName ? undefined : 'Add accessible name (aria-label, aria-labelledby, or label)',
            });

            if (hasAccessibleName) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Test semantic markup
     */
    private async testSemanticMarkup(): Promise<void> {
        // Test for proper heading hierarchy
        const headings = this.container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let hasH1 = false;

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.charAt(1));

            if (level === 1) {
                hasH1 = true;
            }

            const isProperHierarchy = level <= previousLevel + 1;

            this.results.semanticMarkup.push({
                element: this.getElementSelector(heading),
                type: 'heading',
                level,
                isProperHierarchy,
                passes: isProperHierarchy,
                recommendation: isProperHierarchy ? undefined : 'Fix heading hierarchy - don\'t skip levels',
            });

            if (isProperHierarchy) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }

            previousLevel = level;
        });

        // Check for H1
        if (headings.length > 0) {
            this.results.semanticMarkup.push({
                element: 'document',
                type: 'h1-presence',
                hasH1,
                passes: hasH1,
                recommendation: hasH1 ? undefined : 'Add an H1 heading to the page',
            });

            if (hasH1) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        }

        // Test for semantic elements
        const semanticElements = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
        semanticElements.forEach((tagName) => {
            const elements = this.container.querySelectorAll(tagName);
            const hasElement = elements.length > 0;

            this.results.semanticMarkup.push({
                element: tagName,
                type: 'semantic-element',
                hasElement,
                count: elements.length,
                passes: hasElement,
                recommendation: hasElement ? undefined : `Consider using <${tagName}> for better semantic structure`,
            });

            if (hasElement) {
                this.results.overall.passed++;
            } else {
                this.results.overall.warnings++;
            }
        });
    }

    /**
     * Test images for alt text
     */
    private async testImages(): Promise<void> {
        const images = this.container.querySelectorAll('img');

        images.forEach((img) => {
            const alt = img.getAttribute('alt');
            const hasAlt = alt !== null;
            const isDecorative = alt === '';
            const hasDescriptiveAlt = hasAlt && alt.trim().length > 0;

            // Check if image is inside a link
            const isInLink = img.closest('a[href]') !== null;

            this.results.images.push({
                element: this.getElementSelector(img),
                src: img.src,
                alt: alt || '',
                hasAlt,
                isDecorative,
                hasDescriptiveAlt,
                isInLink,
                passes: hasAlt && (isDecorative || hasDescriptiveAlt),
                recommendation: !hasAlt
                    ? 'Add alt attribute (empty string for decorative images)'
                    : !hasDescriptiveAlt && !isDecorative
                        ? 'Provide descriptive alt text'
                        : undefined,
            });

            if (hasAlt && (isDecorative || hasDescriptiveAlt)) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Test form accessibility
     */
    private async testForms(): Promise<void> {
        const formElements = this.container.querySelectorAll('input, textarea, select');

        formElements.forEach((element) => {
            const id = element.getAttribute('id');
            const label = id ? this.container.querySelector(`label[for="${id}"]`) : null;
            const ariaLabel = element.getAttribute('aria-label');
            const ariaLabelledBy = element.getAttribute('aria-labelledby');
            const hasLabel = !!(label || ariaLabel || ariaLabelledBy);

            const required = element.hasAttribute('required');
            const ariaRequired = element.getAttribute('aria-required') === 'true';
            const hasRequiredIndicator = required || ariaRequired;

            const type = element.getAttribute('type');
            const isInput = element.tagName.toLowerCase() === 'input';

            this.results.forms.push({
                element: this.getElementSelector(element),
                type: type || element.tagName.toLowerCase(),
                hasLabel,
                hasRequiredIndicator,
                labelText: label?.textContent?.trim() || ariaLabel || '',
                passes: hasLabel,
                recommendation: hasLabel ? undefined : 'Associate form control with a label',
            });

            if (hasLabel) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Test heading structure
     */
    private async testHeadings(): Promise<void> {
        const headings = Array.from(this.container.querySelectorAll('h1, h2, h3, h4, h5, h6'));

        if (headings.length === 0) {
            this.results.headings.push({
                element: 'document',
                issue: 'No headings found',
                passes: false,
                recommendation: 'Add headings to structure content',
            });
            this.results.overall.failed++;
            return;
        }

        let previousLevel = 0;
        let hasH1 = false;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent?.trim() || '';

            if (level === 1) {
                hasH1 = true;
            }

            // Check for proper hierarchy
            const skipsLevel = level > previousLevel + 1;
            const isEmpty = text.length === 0;

            this.results.headings.push({
                element: this.getElementSelector(heading),
                level,
                text,
                position: index + 1,
                skipsLevel,
                isEmpty,
                passes: !skipsLevel && !isEmpty,
                recommendation: skipsLevel
                    ? 'Don\'t skip heading levels'
                    : isEmpty
                        ? 'Provide heading text'
                        : undefined,
            });

            if (!skipsLevel && !isEmpty) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }

            previousLevel = level;
        });

        // Check for H1
        if (!hasH1) {
            this.results.headings.push({
                element: 'document',
                issue: 'No H1 heading found',
                passes: false,
                recommendation: 'Add an H1 heading as the main page title',
            });
            this.results.overall.failed++;
        }
    }

    /**
     * Test landmark regions
     */
    private async testLandmarks(): Promise<void> {
        const landmarks = [
            { selector: 'main, [role="main"]', name: 'main', required: true },
            { selector: 'nav, [role="navigation"]', name: 'navigation', required: false },
            { selector: 'header, [role="banner"]', name: 'banner', required: false },
            { selector: 'footer, [role="contentinfo"]', name: 'contentinfo', required: false },
            { selector: 'aside, [role="complementary"]', name: 'complementary', required: false },
        ];

        landmarks.forEach(({ selector, name, required }) => {
            const elements = this.container.querySelectorAll(selector);
            const count = elements.length;
            const hasLandmark = count > 0;

            this.results.landmarks.push({
                landmark: name,
                count,
                hasLandmark,
                required,
                passes: hasLandmark || !required,
                recommendation: !hasLandmark && required
                    ? `Add a ${name} landmark to the page`
                    : count > 1
                        ? `Consider using aria-label to distinguish multiple ${name} landmarks`
                        : undefined,
            });

            if (hasLandmark || !required) {
                this.results.overall.passed++;
            } else {
                this.results.overall.failed++;
            }
        });
    }

    /**
     * Calculate overall accessibility score
     */
    private calculateOverallScore(): void {
        const total = this.results.overall.passed + this.results.overall.failed + this.results.overall.warnings;

        if (total === 0) {
            this.results.overall.score = 0;
            return;
        }

        // Calculate score: passed tests / total tests * 100
        // Warnings count as half points
        const weightedPassed = this.results.overall.passed + (this.results.overall.warnings * 0.5);
        this.results.overall.score = Math.round((weightedPassed / total) * 100);
    }

    /**
     * Get CSS selector for an element
     */
    private getElementSelector(element: Element): string {
        if (element.id) {
            return `#${element.id}`;
        }

        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
                return `${element.tagName.toLowerCase()}.${classes[0]}`;
            }
        }

        return element.tagName.toLowerCase();
    }

    /**
     * Generate accessibility report
     */
    generateReport(): AccessibilityReport {
        const report: AccessibilityReport = {
            timestamp: new Date().toISOString(),
            overall: this.results.overall,
            summary: {
                colorContrast: {
                    total: this.results.colorContrast.length,
                    passed: this.results.colorContrast.filter(r => r.passes).length,
                    failed: this.results.colorContrast.filter(r => !r.passes).length,
                },
                focusManagement: {
                    total: this.results.focusManagement.length,
                    passed: this.results.focusManagement.filter(r => r.passes).length,
                    failed: this.results.focusManagement.filter(r => !r.passes).length,
                },
                keyboardNavigation: {
                    total: this.results.keyboardNavigation.length,
                    passed: this.results.keyboardNavigation.filter(r => r.passes).length,
                    failed: this.results.keyboardNavigation.filter(r => !r.passes).length,
                },
                ariaLabels: {
                    total: this.results.ariaLabels.length,
                    passed: this.results.ariaLabels.filter(r => r.passes).length,
                    failed: this.results.ariaLabels.filter(r => !r.passes).length,
                },
                images: {
                    total: this.results.images.length,
                    passed: this.results.images.filter(r => r.passes).length,
                    failed: this.results.images.filter(r => !r.passes).length,
                },
                forms: {
                    total: this.results.forms.length,
                    passed: this.results.forms.filter(r => r.passes).length,
                    failed: this.results.forms.filter(r => !r.passes).length,
                },
            },
            details: this.results,
            recommendations: this.generateRecommendations(),
        };

        return report;
    }

    /**
     * Generate prioritized recommendations
     */
    private generateRecommendations(): string[] {
        const recommendations: string[] = [];

        // High priority issues
        const failedContrast = this.results.colorContrast.filter(r => !r.passes);
        if (failedContrast.length > 0) {
            recommendations.push(`Fix ${failedContrast.length} color contrast issues for better readability`);
        }

        const missingLabels = this.results.ariaLabels.filter(r => !r.passes);
        if (missingLabels.length > 0) {
            recommendations.push(`Add accessible names to ${missingLabels.length} interactive elements`);
        }

        const missingFocus = this.results.focusManagement.filter(r => !r.passes);
        if (missingFocus.length > 0) {
            recommendations.push(`Add focus indicators to ${missingFocus.length} interactive elements`);
        }

        // Medium priority issues
        const keyboardIssues = this.results.keyboardNavigation.filter(r => !r.passes);
        if (keyboardIssues.length > 0) {
            recommendations.push(`Improve keyboard accessibility for ${keyboardIssues.length} elements`);
        }

        const imageIssues = this.results.images.filter(r => !r.passes);
        if (imageIssues.length > 0) {
            recommendations.push(`Add alt text to ${imageIssues.length} images`);
        }

        // Low priority issues
        const formIssues = this.results.forms.filter(r => !r.passes);
        if (formIssues.length > 0) {
            recommendations.push(`Associate ${formIssues.length} form controls with labels`);
        }

        const headingIssues = this.results.headings.filter(r => !r.passes);
        if (headingIssues.length > 0) {
            recommendations.push(`Fix heading structure issues`);
        }

        return recommendations;
    }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface AccessibilityTestResults {
    colorContrast: ColorContrastResult[];
    focusManagement: FocusManagementResult[];
    keyboardNavigation: KeyboardNavigationResult[];
    ariaLabels: AriaLabelsResult[];
    semanticMarkup: SemanticMarkupResult[];
    images: ImageResult[];
    forms: FormResult[];
    headings: HeadingResult[];
    landmarks: LandmarkResult[];
    overall: {
        score: number;
        passed: number;
        failed: number;
        warnings: number;
    };
}

interface ColorContrastResult {
    element: string;
    foreground: string;
    background: string;
    contrast: number;
    requiredRatio: number;
    passes: boolean;
    isLargeText: boolean;
    recommendation?: string;
}

interface FocusManagementResult {
    element: string;
    hasFocusIndicator: boolean;
    focusStyle: {
        outline: string;
        boxShadow: string;
    };
    passes: boolean;
    recommendation?: string;
}

interface KeyboardNavigationResult {
    element: string;
    isKeyboardAccessible: boolean;
    tabIndex: string;
    meetsMinimumSize: boolean;
    size: {
        width: number;
        height: number;
    };
    passes: boolean;
    recommendation?: string;
}

interface AriaLabelsResult {
    element: string;
    hasAccessibleName: boolean;
    ariaLabel?: string | null;
    ariaLabelledBy?: string | null;
    ariaDescribedBy?: string | null;
    hasFormLabel: boolean;
    passes: boolean;
    recommendation?: string;
}

interface SemanticMarkupResult {
    element: string;
    type: string;
    level?: number;
    isProperHierarchy?: boolean;
    hasH1?: boolean;
    hasElement?: boolean;
    count?: number;
    passes: boolean;
    recommendation?: string;
}

interface ImageResult {
    element: string;
    src: string;
    alt: string;
    hasAlt: boolean;
    isDecorative: boolean;
    hasDescriptiveAlt: boolean;
    isInLink: boolean;
    passes: boolean;
    recommendation?: string;
}

interface FormResult {
    element: string;
    type: string;
    hasLabel: boolean;
    hasRequiredIndicator: boolean;
    labelText: string;
    passes: boolean;
    recommendation?: string;
}

interface HeadingResult {
    element: string;
    level?: number;
    text?: string;
    position?: number;
    skipsLevel?: boolean;
    isEmpty?: boolean;
    issue?: string;
    passes: boolean;
    recommendation?: string;
}

interface LandmarkResult {
    landmark: string;
    count: number;
    hasLandmark: boolean;
    required: boolean;
    passes: boolean;
    recommendation?: string;
}

interface AccessibilityReport {
    timestamp: string;
    overall: {
        score: number;
        passed: number;
        failed: number;
        warnings: number;
    };
    summary: {
        colorContrast: { total: number; passed: number; failed: number };
        focusManagement: { total: number; passed: number; failed: number };
        keyboardNavigation: { total: number; passed: number; failed: number };
        ariaLabels: { total: number; passed: number; failed: number };
        images: { total: number; passed: number; failed: number };
        forms: { total: number; passed: number; failed: number };
    };
    details: AccessibilityTestResults;
    recommendations: string[];
}

// =============================================================================
// MANUAL TESTING UTILITIES
// =============================================================================

/**
 * Manual accessibility testing helpers
 */
export const manualTesting = {
    /**
     * Test keyboard navigation manually
     */
    testKeyboardNavigation: () => {
        console.log('🎹 Testing keyboard navigation...');
        console.log('Use Tab to navigate forward, Shift+Tab to navigate backward');
        console.log('Press Enter or Space to activate buttons');
        console.log('Use arrow keys in menus and tab panels');
        console.log('Press Escape to close modals and dropdowns');

        // Highlight current focus
        const highlightFocus = () => {
            const focused = document.activeElement as HTMLElement;
            if (focused && focused !== document.body) {
                focused.style.outline = '3px solid red';
                focused.style.outlineOffset = '2px';
                console.log('Currently focused:', focused.tagName, focused.className, focused.textContent?.slice(0, 50));
            }
        };

        document.addEventListener('focusin', highlightFocus);

        return () => {
            document.removeEventListener('focusin', highlightFocus);
            // Remove all outlines
            document.querySelectorAll('*').forEach(el => {
                (el as HTMLElement).style.outline = '';
                (el as HTMLElement).style.outlineOffset = '';
            });
        };
    },

    /**
     * Test screen reader compatibility
     */
    testScreenReader: () => {
        console.log('🔊 Testing screen reader compatibility...');
        console.log('Enable your screen reader and navigate through the page');
        console.log('Check that all content is announced properly');
        console.log('Verify that interactive elements have proper labels');
        console.log('Test form controls and their associations');

        // Add screen reader testing styles
        const style = document.createElement('style');
        style.textContent = `
      .sr-test-highlight {
        background-color: yellow !important;
        outline: 2px solid orange !important;
      }
    `;
        document.head.appendChild(style);

        // Highlight elements as they receive focus
        const highlightForScreenReader = (event: FocusEvent) => {
            document.querySelectorAll('.sr-test-highlight').forEach(el => {
                el.classList.remove('sr-test-highlight');
            });

            if (event.target instanceof HTMLElement) {
                event.target.classList.add('sr-test-highlight');
            }
        };

        document.addEventListener('focusin', highlightForScreenReader);

        return () => {
            document.removeEventListener('focusin', highlightForScreenReader);
            document.querySelectorAll('.sr-test-highlight').forEach(el => {
                el.classList.remove('sr-test-highlight');
            });
            style.remove();
        };
    },

    /**
     * Test color contrast visually
     */
    testColorContrast: () => {
        console.log('🎨 Testing color contrast...');

        // Create contrast testing overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      z-index: 10000;
      overflow: auto;
      font-family: monospace;
    `;

        const results = accessibility.validateDesignSystemContrast();

        overlay.innerHTML = `
      <h2>Color Contrast Test Results</h2>
      <button onclick="this.parentElement.remove()" style="float: right; padding: 10px;">Close</button>
      <div style="clear: both; margin-top: 20px;">
        ${results.map(result => `
          <div style="margin-bottom: 15px; padding: 10px; background: ${result.compliance.passes ? '#006600' : '#660000'};">
            <strong>${result.combination}</strong><br>
            Contrast: ${result.compliance.ratio}:1 (Required: ${result.compliance.level === 'normal' ? '4.5' : '3.0'}:1)<br>
            Status: ${result.compliance.passes ? '✅ PASS' : '❌ FAIL'}<br>
            ${result.compliance.recommendation ? `Recommendation: ${result.compliance.recommendation}` : ''}
          </div>
        `).join('')}
      </div>
    `;

        document.body.appendChild(overlay);
    },

    /**
     * Test responsive text scaling
     */
    testTextScaling: () => {
        console.log('📏 Testing text scaling...');

        const originalFontSize = document.documentElement.style.fontSize;
        const scales = [1, 1.25, 1.5, 2];
        let currentScale = 0;

        const applyScale = (scale: number) => {
            document.documentElement.style.fontSize = `${16 * scale}px`;
            console.log(`Applied ${scale * 100}% text scaling`);
        };

        const nextScale = () => {
            currentScale = (currentScale + 1) % scales.length;
            applyScale(scales[currentScale]);
        };

        // Create control panel
        const panel = document.createElement('div');
        panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px solid black;
      padding: 15px;
      z-index: 10000;
      font-family: sans-serif;
    `;

        panel.innerHTML = `
      <h3>Text Scaling Test</h3>
      <button onclick="nextScale()">Next Scale (${scales[currentScale] * 100}%)</button>
      <button onclick="resetScale()">Reset</button>
      <button onclick="this.parentElement.remove()">Close</button>
    `;

        (window as any).nextScale = nextScale;
        (window as any).resetScale = () => {
            document.documentElement.style.fontSize = originalFontSize;
            console.log('Reset to original font size');
        };

        document.body.appendChild(panel);
    },
};

// =============================================================================
// EXPORT UTILITIES
// =============================================================================

/**
 * Quick accessibility test function
 */
export const quickAccessibilityTest = async (container?: HTMLElement): Promise<AccessibilityReport> => {
    const tester = new AccessibilityTester(container);
    await tester.runAllTests();
    return tester.generateReport();
};

/**
 * Export accessibility testing utilities
 */
export type { AccessibilityReport, AccessibilityTestResults };