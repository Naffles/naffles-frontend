# Naffles Design System

A comprehensive design system for the Naffles platform, extracted from Figma designs and implemented with TypeScript, React, and modern CSS practices.

## Overview

The Naffles Design System provides a unified visual language and component library that ensures consistency across all platform interfaces. Built with accessibility, performance, and developer experience in mind.

**Primary Figma Reference**: [Naffles Main Design](https://www.figma.com/design/rSs8qA62BJTjabjISJARW5/Naffles-Main?node-id=77706-25643)

## Table of Contents

- [Getting Started](#getting-started)
- [Design Tokens](#design-tokens)
- [Components](#components)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Implementation Guide](#implementation-guide)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## Getting Started

### Installation

```bash
# The design system is included in the main project
# No separate installation required
```

### Basic Usage

```typescript
// Import design tokens
import { colors, typography, spacing } from '@/styles/design-system';

// Import component specifications
import { componentSpecs } from '@/styles/design-system/component-specs';

// Import responsive utilities
import { responsivePatterns } from '@/styles/design-system/responsive-patterns';
```

### Quick Example

```tsx
import React from 'react';
import { colors, spacing, typography } from '@/styles/design-system';

const ExampleComponent = () => {
  return (
    <div
      style={{
        backgroundColor: colors.primary[500],
        padding: spacing[4],
        borderRadius: '0.5rem',
        color: colors.semantic.text.inverse,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
      }}
    >
      Hello, Naffles Design System!
    </div>
  );
};
```

## Design Tokens

Design tokens are the foundational elements of the design system, providing consistent values for colors, typography, spacing, and more.

### Colors

The color system is built around semantic color assignments and supports both light and dark themes.

```typescript
import { colors } from '@/styles/design-system';

// Primary brand colors
colors.primary[500]  // Main brand blue: #0ea5e9
colors.primary[600]  // Hover state: #0284c7

// Semantic colors
colors.semantic.text.primary    // Primary text color
colors.semantic.background      // Main background color
colors.semantic.border         // Default border color

// Status colors
colors.success[500]  // Success green: #22c55e
colors.error[500]    // Error red: #ef4444
colors.warning[500]  // Warning amber: #f59e0b

// Crypto-themed colors
colors.crypto.bitcoin   // Bitcoin orange: #f7931a
colors.crypto.ethereum  // Ethereum blue: #627eea
colors.crypto.solana    // Solana purple: #9945ff
```

### Typography

Typography tokens provide consistent font families, sizes, weights, and line heights.

```typescript
import { typography } from '@/styles/design-system';

// Font families
typography.fontFamily.sans     // ['Inter', 'system-ui', ...]
typography.fontFamily.mono     // ['JetBrains Mono', 'Consolas', ...]
typography.fontFamily.display  // ['Poppins', 'Inter', ...]

// Font sizes (responsive scale)
typography.fontSize.xs    // 0.75rem (12px)
typography.fontSize.base  // 1rem (16px)
typography.fontSize.xl    // 1.25rem (20px)
typography.fontSize['4xl'] // 2.25rem (36px)

// Font weights
typography.fontWeight.normal    // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

### Spacing

Spacing tokens follow an 8px grid system for consistent layouts.

```typescript
import { spacing } from '@/styles/design-system';

spacing[1]   // 0.25rem (4px)
spacing[2]   // 0.5rem (8px)
spacing[4]   // 1rem (16px)
spacing[6]   // 1.5rem (24px)
spacing[8]   // 2rem (32px)
spacing[12]  // 3rem (48px)
```

### Shadows

Shadow tokens provide consistent elevation hierarchy.

```typescript
import { shadows } from '@/styles/design-system';

shadows.sm       // Subtle elevation
shadows.DEFAULT  // Standard cards
shadows.lg       // Modals, dropdowns
shadows.xl       // Maximum elevation

// Colored shadows
shadows.colored.primary   // Primary blue shadow
shadows.colored.success   // Success green shadow
```

## Components

Component specifications provide detailed implementation guidelines for all UI components.

### Button Component

```typescript
import { buttonSpec } from '@/styles/design-system/component-specs';

// Get button styles
const primaryButton = {
  ...buttonSpec.base,
  ...buttonSpec.variants.primary,
  ...buttonSpec.sizes.md,
};

// Usage in React
<button
  className="btn btn--primary btn--md"
  style={primaryButton}
>
  Click me
</button>
```

#### Button Variants

- **Primary**: Main call-to-action buttons (`variant="primary"`)
- **Secondary**: Alternative actions (`variant="secondary"`)
- **Tertiary**: Subtle actions (`variant="tertiary"`)
- **Danger**: Destructive actions (`variant="danger"`)
- **Success**: Confirmation actions (`variant="success"`)

#### Button Sizes

- **xs**: Extra small (24px height)
- **sm**: Small (32px height)
- **md**: Medium (40px height) - Default
- **lg**: Large (48px height)
- **xl**: Extra large (56px height)

### Card Component

```typescript
import { cardSpec } from '@/styles/design-system/component-specs';

// Get card styles
const interactiveCard = {
  ...cardSpec.base,
  ...cardSpec.variants.interactive,
};
```

#### Card Variants

- **Default**: Standard content cards
- **Elevated**: Important content with higher elevation
- **Outlined**: Subtle content separation
- **Interactive**: Clickable cards with hover effects
- **Compact**: Dense layouts with reduced padding

#### Card Structure

Cards follow a consistent structure pattern:

```tsx
<Card variant="interactive">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Subtitle>Optional subtitle</Card.Subtitle>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here...</p>
  </Card.Body>
  <Card.Footer>
    <Card.Meta>Additional info</Card.Meta>
    <Card.Actions>
      <Button size="sm">Action</Button>
    </Card.Actions>
  </Card.Footer>
</Card>
```

## Responsive Design

The design system uses a mobile-first approach with consistent breakpoints and responsive patterns.

### Breakpoints

```typescript
import { responsivePatterns } from '@/styles/design-system/responsive-patterns';

// Breakpoint values
responsivePatterns.breakpoints.values.xs   // 475px
responsivePatterns.breakpoints.values.sm   // 640px
responsivePatterns.breakpoints.values.md   // 768px
responsivePatterns.breakpoints.values.lg   // 1024px
responsivePatterns.breakpoints.values.xl   // 1280px
responsivePatterns.breakpoints.values['2xl'] // 1536px

// Media query helpers
responsivePatterns.breakpoints.up('md')     // @media (min-width: 768px)
responsivePatterns.breakpoints.down('lg')   // @media (max-width: 1023px)
```

### Grid System

The grid system uses a 12-column layout with responsive column counts:

- **Mobile**: 4 columns
- **Tablet**: 8 columns  
- **Desktop**: 12 columns

```typescript
// Grid container
const container = responsivePatterns.utils.container.responsive;

// Responsive card grid
const cardGrid = {
  display: 'grid',
  gap: responsivePatterns.grid.gap.md,
  gridTemplateColumns: 'repeat(1, 1fr)', // Mobile: 1 column
  
  [responsivePatterns.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)', // Tablet: 2 columns
  },
  
  [responsivePatterns.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)', // Desktop: 3 columns
  },
};
```

### Layout Patterns

Common layout patterns for different page types:

```typescript
// Homepage layout
const homepageLayout = responsivePatterns.layouts.homepage;

// Dashboard layout
const dashboardLayout = responsivePatterns.layouts.dashboard;

// Content listing layout
const listingLayout = responsivePatterns.layouts.listing;
```

## Accessibility

The design system follows WCAG 2.1 AA standards and includes comprehensive accessibility features.

### Color Contrast

All color combinations meet WCAG contrast requirements:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Focus Management

- All interactive elements have visible focus indicators
- Focus order follows logical reading order
- Modal dialogs trap focus appropriately
- Focus is restored when modals close

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Standard keyboard shortcuts are supported (Enter, Space, Escape)
- Tab navigation follows logical order
- Skip links are provided for main content areas

### Screen Reader Support

- Semantic HTML5 elements are used appropriately
- ARIA labels and descriptions are provided where needed
- Dynamic content changes are announced
- Proper heading hierarchy is maintained

## Implementation Guide

### CSS-in-JS Integration

```typescript
import styled from 'styled-components';
import { colors, spacing, typography } from '@/styles/design-system';

const StyledButton = styled.button`
  background-color: ${colors.primary[500]};
  color: ${colors.semantic.text.inverse};
  padding: ${spacing[2]} ${spacing[4]};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${colors.primary[600]};
    transform: translateY(-1px);
  }
`;
```

### Tailwind CSS Integration

```typescript
// tailwind.config.js
import { colors, spacing, typography, shadows, borderRadius } from './src/styles/design-system/tokens';

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        gray: colors.gray,
        crypto: colors.crypto,
      },
      spacing,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      fontFamily: typography.fontFamily,
      boxShadow: shadows,
      borderRadius,
    },
  },
};
```

### React Component Example

```tsx
import React from 'react';
import { createComponentStyles } from '@/styles/design-system/component-specs';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const styles = createComponentStyles('button', { variant, size });
  
  return (
    <button
      style={styles}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};
```

## Best Practices

### Design Token Usage

1. **Always use design tokens** instead of hardcoded values
2. **Use semantic color names** when available (e.g., `colors.semantic.text.primary`)
3. **Follow the spacing scale** for consistent layouts
4. **Use appropriate font weights** for hierarchy

```typescript
// ✅ Good
const styles = {
  color: colors.semantic.text.primary,
  fontSize: typography.fontSize.lg,
  padding: spacing[4],
};

// ❌ Bad
const styles = {
  color: '#111827',
  fontSize: '18px',
  padding: '16px',
};
```

### Component Implementation

1. **Follow component specifications** for consistent behavior
2. **Include all required states** (hover, focus, disabled, loading)
3. **Implement proper accessibility** features
4. **Use responsive patterns** for mobile-first design

### Responsive Design

1. **Start with mobile styles** as the base
2. **Use min-width media queries** for progressive enhancement
3. **Follow established breakpoints** and grid systems
4. **Test on real devices** for optimal experience

### Performance

1. **Use CSS custom properties** for dynamic theming
2. **Implement lazy loading** for non-critical components
3. **Optimize bundle size** by importing only needed tokens
4. **Use appropriate image formats** and compression

## Contributing

### Adding New Components

1. Create component specification in `component-specs/`
2. Include all variants, sizes, and states
3. Add accessibility requirements
4. Provide implementation examples
5. Update this documentation

### Modifying Design Tokens

1. Update tokens in `tokens.ts`
2. Ensure backward compatibility
3. Update component specifications if needed
4. Test across all components
5. Update documentation

### Design System Updates

1. Keep Figma designs in sync with implementation
2. Document any breaking changes
3. Provide migration guides for major updates
4. Maintain version history

## File Structure

```
src/styles/design-system/
├── README.md                    # This documentation
├── index.ts                     # Main export file
├── tokens.ts                    # Design tokens
├── themes.ts                    # Theme configurations
├── utils.ts                     # Utility functions
├── responsive-patterns.ts       # Responsive design patterns
├── figma-components.md         # Figma component specifications
├── component-specs/            # Component specifications
│   ├── index.ts               # Component specs export
│   ├── button.ts              # Button component spec
│   ├── card.ts                # Card component spec
│   └── ...                    # Additional component specs
└── components.ts               # Legacy component definitions
```

## Resources

- [Figma Design File](https://www.figma.com/design/rSs8qA62BJTjabjISJARW5/Naffles-Main?node-id=77706-25643)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)

## Support

For questions about the design system:

1. Check this documentation first
2. Review component specifications
3. Consult Figma designs for visual reference
4. Create an issue for bugs or feature requests

---

**Version**: 1.0.0  
**Last Updated**: August 2025  
**Maintainers**: Naffles Development Team