# Design System Implementation Guide

This guide provides detailed instructions for implementing the Naffles Design System in your components and applications.

## Table of Contents

- [Quick Start](#quick-start)
- [Design Tokens Usage](#design-tokens-usage)
- [Component Implementation](#component-implementation)
- [Responsive Design](#responsive-design)
- [Theme Integration](#theme-integration)
- [Accessibility Implementation](#accessibility-implementation)
- [Performance Optimization](#performance-optimization)
- [Testing Guidelines](#testing-guidelines)

## Quick Start

### 1. Import the Design System

```typescript
// Import everything
import * as designSystem from '@/styles/design-system';

// Import specific tokens
import { colors, typography, spacing } from '@/styles/design-system';

// Import component specifications
import { componentSpecs, createComponentStyles } from '@/styles/design-system';

// Import responsive utilities
import { responsivePatterns } from '@/styles/design-system';
```

### 2. Basic Component Example

```tsx
import React from 'react';
import { colors, spacing, typography, createButtonStyles } from '@/styles/design-system';

const MyButton: React.FC<{ variant?: 'primary' | 'secondary' }> = ({ 
  variant = 'primary', 
  children 
}) => {
  const buttonStyles = createButtonStyles(variant, 'md');
  
  return (
    <button style={buttonStyles}>
      {children}
    </button>
  );
};
```

## Design Tokens Usage

### Colors

```typescript
import { colors, getColorWithOpacity } from '@/styles/design-system';

// Basic color usage
const styles = {
  backgroundColor: colors.primary[500],
  color: colors.semantic.text.inverse,
  borderColor: colors.gray[300],
};

// Color with opacity
const overlayStyles = {
  backgroundColor: getColorWithOpacity('primary.500', 0.1),
};

// Semantic colors (recommended)
const semanticStyles = {
  color: colors.semantic.text.primary,
  backgroundColor: colors.semantic.background,
  borderColor: colors.semantic.border,
};
```

### Typography

```typescript
import { typography, createTypographyStyles } from '@/styles/design-system';

// Basic typography
const textStyles = {
  fontFamily: typography.fontFamily.sans.join(', '),
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.lineHeight.tight,
};

// Using the helper function
const headingStyles = createTypographyStyles('2xl', 'bold', 'tight');

// Responsive typography
const responsiveText = {
  fontSize: typography.fontSize.base,
  '@media (min-width: 768px)': {
    fontSize: typography.fontSize.lg,
  },
  '@media (min-width: 1024px)': {
    fontSize: typography.fontSize.xl,
  },
};
```

### Spacing

```typescript
import { spacing, createResponsiveSpacing } from '@/styles/design-system';

// Basic spacing
const layoutStyles = {
  padding: spacing[4],
  margin: spacing[6],
  gap: spacing[2],
};

// Responsive spacing
const responsiveSpacing = createResponsiveSpacing(4, { md: 1.5, lg: 2 });
```

## Component Implementation

### Using Component Specifications

```typescript
import { componentSpecs, createComponentStyles } from '@/styles/design-system';

// Method 1: Direct specification usage
const ButtonComponent = ({ variant = 'primary', size = 'md', ...props }) => {
  const styles = {
    ...componentSpecs.button.base,
    ...componentSpecs.button.variants[variant],
    ...componentSpecs.button.sizes[size],
  };
  
  return <button style={styles} {...props} />;
};

// Method 2: Using helper function
const ButtonComponent2 = ({ variant = 'primary', size = 'md', ...props }) => {
  const styles = createComponentStyles('button', { variant, size });
  
  return <button style={styles} {...props} />;
};
```

### Implementing States

```typescript
import React, { useState } from 'react';
import { componentSpecs } from '@/styles/design-system';

const InteractiveButton = ({ variant = 'primary', size = 'md', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const baseStyles = {
    ...componentSpecs.button.base,
    ...componentSpecs.button.variants[variant],
    ...componentSpecs.button.sizes[size],
  };
  
  const stateStyles = {
    ...(isHovered && componentSpecs.button.variants[variant].states.hover),
    ...(isFocused && componentSpecs.button.variants[variant].states.focus),
  };
  
  return (
    <button
      style={{ ...baseStyles, ...stateStyles }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
};
```

### Card Component Implementation

```tsx
import React from 'react';
import { componentSpecs } from '@/styles/design-system';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ variant = 'default', children, onClick }) => {
  const isInteractive = variant === 'interactive' || onClick;
  
  const styles = {
    ...componentSpecs.card.base,
    ...componentSpecs.card.variants[variant],
    ...(isInteractive && { cursor: 'pointer' }),
  };
  
  return (
    <div style={styles} onClick={onClick}>
      {children}
    </div>
  );
};

// Card subcomponents
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={componentSpecs.card.structure.header}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={componentSpecs.card.structure.header.title}>
    {children}
  </h3>
);

const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={componentSpecs.card.structure.body}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={componentSpecs.card.structure.footer}>
    {children}
  </div>
);

// Attach subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
```

## Responsive Design

### Using Breakpoints

```typescript
import { responsivePatterns } from '@/styles/design-system';

const ResponsiveComponent = () => {
  const styles = {
    padding: '1rem',
    
    // Mobile-first approach
    [responsivePatterns.breakpoints.up('md')]: {
      padding: '2rem',
    },
    
    [responsivePatterns.breakpoints.up('lg')]: {
      padding: '3rem',
    },
  };
  
  return <div style={styles}>Responsive content</div>;
};
```

### Grid Layouts

```typescript
import { responsivePatterns } from '@/styles/design-system';

const GridLayout = ({ children }) => {
  const gridStyles = {
    display: 'grid',
    gap: responsivePatterns.grid.gap.md,
    gridTemplateColumns: 'repeat(1, 1fr)',
    
    [responsivePatterns.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    [responsivePatterns.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  };
  
  return <div style={gridStyles}>{children}</div>;
};
```

### Container Usage

```typescript
import { responsivePatterns } from '@/styles/design-system';

const Container = ({ children }) => {
  return (
    <div style={responsivePatterns.utils.container.responsive}>
      {children}
    </div>
  );
};
```

## Theme Integration

### Basic Theme Usage

```typescript
import { lightTheme, darkTheme, getTheme } from '@/styles/design-system';

const ThemedComponent = ({ theme = 'light' }) => {
  const currentTheme = getTheme(theme);
  
  const styles = {
    backgroundColor: currentTheme.background.primary,
    color: currentTheme.text.primary,
    borderColor: currentTheme.border.primary,
  };
  
  return <div style={styles}>Themed content</div>;
};
```

### Theme Provider Implementation

```tsx
import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme, getTheme, generateThemeCSS } from '@/styles/design-system';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const theme = getTheme(mode);
  
  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };
  
  // Inject CSS custom properties
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = generateThemeCSS(lightTheme, darkTheme);
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Set theme attribute on document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  
  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Accessibility Implementation

### Focus Management

```tsx
import React, { useRef, useEffect } from 'react';
import { componentSpecs } from '@/styles/design-system';

const AccessibleButton = ({ autoFocus, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);
  
  const styles = {
    ...componentSpecs.button.base,
    ...componentSpecs.button.variants.primary,
    
    // Ensure focus is visible
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    
    // High contrast mode support
    '@media (prefers-contrast: high)': {
      border: '2px solid currentColor',
    },
  };
  
  return (
    <button
      ref={buttonRef}
      style={styles}
      {...props}
    />
  );
};
```

### Screen Reader Support

```tsx
import React from 'react';

const AccessibleCard = ({ title, description, onClick, ...props }) => {
  return (
    <div
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={onClick ? `Click to ${title}` : undefined}
      {...props}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
```

### Color Contrast Validation

```typescript
import { colors, getContrastingTextColor } from '@/styles/design-system';

const validateContrast = (backgroundColor: string, textColor: string) => {
  // This would integrate with a contrast checking library
  // For now, use the utility function
  const recommendedTextColor = getContrastingTextColor(backgroundColor);
  
  return {
    isValid: textColor === recommendedTextColor,
    recommendedColor: recommendedTextColor,
  };
};

// Usage
const contrastCheck = validateContrast(colors.primary[500], colors.semantic.text.inverse);
```

## Performance Optimization

### Lazy Loading Design Tokens

```typescript
// Only import what you need
import { colors } from '@/styles/design-system/tokens';
// Instead of importing everything
// import * from '@/styles/design-system';
```

### CSS Custom Properties

```typescript
import { createCSSVariables, generateCSSVariables } from '@/styles/design-system';

// Generate CSS custom properties
const cssVars = createCSSVariables(colors, 'naffles');

// Inject into document
const injectCSSVariables = () => {
  const style = document.createElement('style');
  style.textContent = generateCSSVariables({ colors, spacing, typography });
  document.head.appendChild(style);
};

// Use in components
const Component = () => (
  <div style={{ color: 'var(--naffles-primary-500)' }}>
    Using CSS custom properties
  </div>
);
```

### Bundle Optimization

```typescript
// Create a custom bundle with only needed tokens
export const minimalDesignSystem = {
  colors: {
    primary: colors.primary,
    semantic: colors.semantic,
  },
  spacing: {
    2: spacing[2],
    4: spacing[4],
    6: spacing[6],
  },
  typography: {
    fontSize: {
      base: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
  },
};
```

## Testing Guidelines

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { componentSpecs } from '@/styles/design-system';
import { Button } from './Button';

describe('Button Component', () => {
  it('applies correct styles for primary variant', () => {
    render(<Button variant="primary">Test</Button>);
    const button = screen.getByRole('button');
    
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).toBe(componentSpecs.button.variants.primary.backgroundColor);
  });
  
  it('meets accessibility requirements', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    
    // Check focus visibility
    button.focus();
    expect(button).toHaveFocus();
    
    // Check minimum touch target size
    const rect = button.getBoundingClientRect();
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });
});
```

### Visual Regression Testing

```typescript
// Using a tool like Chromatic or Percy
import { componentSpecs } from '@/styles/design-system';

export const ButtonStories = {
  Primary: () => <Button variant="primary">Primary Button</Button>,
  Secondary: () => <Button variant="secondary">Secondary Button</Button>,
  AllSizes: () => (
    <div>
      {Object.keys(componentSpecs.button.sizes).map(size => (
        <Button key={size} size={size}>Size {size}</Button>
      ))}
    </div>
  ),
};
```

### Design Token Testing

```typescript
import { colors, validateComponentProps } from '@/styles/design-system';

describe('Design Tokens', () => {
  it('has valid color values', () => {
    expect(colors.primary[500]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.semantic.text.primary).toBeDefined();
  });
  
  it('validates component props correctly', () => {
    const validation = validateComponentProps('button', {
      variant: 'primary',
      size: 'md',
    });
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
```

## Common Patterns

### Form Components

```tsx
import React from 'react';
import { componentSpecs, colors, spacing } from '@/styles/design-system';

const FormField = ({ label, error, children, ...props }) => {
  return (
    <div style={{ marginBottom: spacing[6] }}>
      <label style={{
        display: 'block',
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing[2],
        color: error ? colors.error[600] : colors.semantic.text.primary,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{
          fontSize: typography.fontSize.sm,
          color: colors.error[600],
          marginTop: spacing[1],
        }}>
          {error}
        </p>
      )}
    </div>
  );
};
```

### Loading States

```tsx
import React from 'react';
import { componentSpecs } from '@/styles/design-system';

const LoadingButton = ({ loading, children, ...props }) => {
  const styles = {
    ...componentSpecs.button.base,
    ...componentSpecs.button.variants.primary,
    ...(loading && componentSpecs.button.loading),
  };
  
  return (
    <button style={styles} disabled={loading} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
};

const Spinner = () => (
  <div style={componentSpecs.button.loading.spinner} />
);
```

This implementation guide provides comprehensive examples for using the Naffles Design System effectively. Follow these patterns to ensure consistency, accessibility, and performance across your applications.