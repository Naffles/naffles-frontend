# Figma Component Specifications

## Overview

This document contains component specifications extracted from the Naffles Figma design system. These specifications provide detailed implementation guidelines for all UI components based on the homepage design foundation.

**Primary Figma Reference**: [Naffles Main Design](https://www.figma.com/design/rSs8qA62BJTjabjISJARW5/Naffles-Main?node-id=77706-25643)

## Component Extraction Process

### 1. Button Components

**Figma Location**: Homepage navigation, CTAs, form buttons
**Node IDs**: Various throughout the design

#### Primary Button
- **Background**: `colors.primary[500]` (#0ea5e9)
- **Text Color**: `colors.semantic.text.inverse` (#ffffff)
- **Border Radius**: `borderRadius.md` (6px)
- **Padding**: `spacing[2] spacing[4]` (8px 16px)
- **Font Weight**: `typography.fontWeight.medium` (500)
- **Height**: 2.5rem (40px)
- **Shadow**: `shadows.sm`

**States**:
- Hover: Background `colors.primary[600]`, shadow `shadows.md`, transform `translateY(-1px)`
- Active: Background `colors.primary[700]`, shadow `shadows.sm`
- Focus: Box shadow with `colors.primary[200]` outline
- Disabled: Background `colors.gray[300]`, text `colors.gray[500]`

#### Secondary Button
- **Background**: Transparent
- **Text Color**: `colors.primary[500]`
- **Border**: 1px solid `colors.primary[500]`
- **Same dimensions as primary**

**States**:
- Hover: Background `colors.primary[50]`, border `colors.primary[600]`
- Active: Background `colors.primary[100]`, border `colors.primary[700]`

### 2. Card Components

**Figma Location**: Raffle cards, community cards, game cards
**Node IDs**: Homepage sliders and grid layouts

#### Default Card
- **Background**: `colors.semantic.surface` (#f9fafb)
- **Border**: 1px solid `colors.gray[200]`
- **Border Radius**: `borderRadius.lg` (8px)
- **Padding**: `spacing[6]` (24px)
- **Shadow**: `shadows.DEFAULT`

#### Interactive Card (Hover Effects)
- **Base**: Same as default card
- **Cursor**: pointer
- **Transition**: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

**States**:
- Hover: Shadow `shadows.lg`, transform `translateY(-2px)`
- Active: Shadow `shadows.md`, transform `translateY(-1px)`
- Focus: Additional outline with `colors.primary[200]`

### 3. Navigation Components

**Figma Location**: Header navigation, sidebar menu
**Node ID**: Header section of homepage

#### Header Navigation
- **Height**: 4rem (64px)
- **Background**: `colors.semantic.background`
- **Border Bottom**: 1px solid `colors.gray[200]`
- **Padding**: 0 `spacing[6]` (0 24px)
- **Position**: sticky, top: 0, z-index: 40

#### Navigation Links
- **Font Size**: `typography.fontSize.base`
- **Font Weight**: `typography.fontWeight.medium`
- **Color**: `colors.gray[700]`
- **Padding**: `spacing[2] spacing[4]`
- **Border Radius**: `borderRadius.md`

**States**:
- Hover: Background `colors.gray[100]`, color `colors.gray[900]`
- Active: Background `colors.primary[100]`, color `colors.primary[700]`

#### Sidebar Navigation
- **Width**: 16rem (256px)
- **Background**: `colors.semantic.surface`
- **Border Right**: 1px solid `colors.gray[200]`
- **Padding**: `spacing[6]`

### 4. Form Components

**Figma Location**: Search bars, form inputs throughout design
**Node IDs**: Various form elements

#### Input Fields
- **Height**: 2.5rem (40px)
- **Padding**: `spacing[2] spacing[3]` (8px 12px)
- **Border**: 1px solid `colors.gray[300]`
- **Border Radius**: `borderRadius.md`
- **Background**: `colors.semantic.background`
- **Font Size**: `typography.fontSize.base`

**States**:
- Focus: Border `colors.primary[500]`, box-shadow with `colors.primary[200]`
- Error: Border `colors.error[500]`, box-shadow with `colors.error[200]`
- Disabled: Background `colors.gray[100]`, border `colors.gray[300]`

#### Labels
- **Font Size**: `typography.fontSize.sm`
- **Font Weight**: `typography.fontWeight.medium`
- **Color**: `colors.semantic.text.primary`
- **Margin Bottom**: `spacing[2]`

### 5. Modal Components

**Figma Location**: Modal overlays, popup dialogs
**Node IDs**: Various modal states

#### Modal Overlay
- **Background**: rgba(0, 0, 0, 0.5)
- **Position**: fixed, full viewport
- **Z-Index**: 50
- **Display**: flex, center alignment

#### Modal Container
- **Background**: `colors.semantic.background`
- **Border Radius**: `borderRadius.lg`
- **Box Shadow**: `shadows.2xl`
- **Max Width**: 90vw
- **Max Height**: 90vh

#### Modal Header
- **Padding**: `spacing[6]`
- **Border Bottom**: 1px solid `colors.gray[200]`
- **Display**: flex, space-between alignment

#### Modal Body
- **Padding**: `spacing[6]`
- **Overflow Y**: auto

### 6. Table Components

**Figma Location**: Admin tables, data displays
**Node IDs**: Admin dashboard sections

#### Table Container
- **Border**: 1px solid `colors.gray[200]`
- **Border Radius**: `borderRadius.lg`
- **Overflow X**: auto

#### Table Header
- **Background**: `colors.gray[50]`
- **Font Size**: `typography.fontSize.xs`
- **Font Weight**: `typography.fontWeight.medium`
- **Color**: `colors.gray[700]`
- **Text Transform**: uppercase
- **Letter Spacing**: `typography.letterSpacing.wide`
- **Padding**: `spacing[3] spacing[4]`

#### Table Rows
- **Border Bottom**: 1px solid `colors.gray[200]`
- **Padding**: `spacing[4]`

**States**:
- Hover: Background `colors.gray[50]`
- Selected: Background `colors.primary[50]`

### 7. Loading Components

**Figma Location**: Loading states throughout design
**Node IDs**: Various loading indicators

#### Spinner
- **Size**: 1.5rem
- **Border**: 2px solid `colors.gray[200]`
- **Border Top**: 2px solid `colors.primary[500]`
- **Border Radius**: 50%
- **Animation**: spin 1s linear infinite

#### Skeleton Loader
- **Background**: `colors.gray[200]`
- **Border Radius**: `borderRadius.md`
- **Animation**: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

### 8. Notification Components

**Figma Location**: Alert messages, toast notifications
**Node IDs**: Various notification states

#### Base Notification
- **Padding**: `spacing[4]`
- **Border Radius**: `borderRadius.md`
- **Box Shadow**: `shadows.lg`
- **Display**: flex, align-items: flex-start
- **Gap**: `spacing[3]`

#### Notification Variants
- **Info**: Background `colors.info[50]`, border `colors.info[200]`, text `colors.info[800]`
- **Success**: Background `colors.success[50]`, border `colors.success[200]`, text `colors.success[800]`
- **Warning**: Background `colors.warning[50]`, border `colors.warning[200]`, text `colors.warning[800]`
- **Error**: Background `colors.error[50]`, border `colors.error[200]`, text `colors.error[800]`

## Dynamic Content Patterns

### Raffle Card Template
**Figma Location**: Homepage raffle sliders
**Data Mapping**:
- `{{raffle.title}}` - Raffle name
- `{{raffle.prize}}` - Prize description
- `{{raffle.endDate}}` - End date/time
- `{{raffle.participants}}` - Participant count
- `{{raffle.prizeImage}}` - Prize image URL

### Community Card Template
**Figma Location**: Community sections
**Data Mapping**:
- `{{community.name}}` - Community name
- `{{community.memberCount}}` - Member count
- `{{community.pointsName}}` - Custom points name
- `{{community.activity}}` - Activity indicator

### User Profile Elements
**Figma Location**: User dashboard sections
**Data Mapping**:
- `{{user.username}}` - Display name
- `{{user.avatar}}` - Profile image
- `{{user.balance}}` - Account balance
- `{{user.tier}}` - User tier/status

## Responsive Behavior

### Breakpoint Adaptations

#### Mobile (320px-767px)
- Cards: Single column layout
- Navigation: Hamburger menu
- Tables: Horizontal scroll
- Modals: Full width with margin

#### Tablet (768px-1279px)
- Cards: Two column layout
- Navigation: Collapsible sidebar
- Tables: Responsive columns
- Modals: Fixed width with padding

#### Desktop (1280px+)
- Cards: Multi-column grid
- Navigation: Full sidebar
- Tables: All columns visible
- Modals: Centered with max-width

## Implementation Guidelines

### CSS-in-JS Integration
```typescript
import { componentSpecs } from '@/styles/design-system';

const ButtonComponent = styled.button`
  ${componentSpecs.button.base}
  ${props => componentSpecs.button.variants[props.variant]}
  ${props => componentSpecs.button.sizes[props.size]}
`;
```

### Tailwind CSS Classes
```typescript
const buttonClasses = {
  base: 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200',
  primary: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md hover:-translate-y-px',
  secondary: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50',
};
```

### React Component Example
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonClasses.base,
        buttonClasses[variant],
        buttonClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Accessibility Compliance

### WCAG 2.1 AA Standards
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### Implementation Checklist
- [ ] All interactive elements have focus indicators
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works for all components
- [ ] ARIA labels are provided where needed
- [ ] Semantic HTML is used appropriately
- [ ] Screen reader testing completed

## Design System Maintenance

### Version Control
- All component changes should be documented
- Figma designs should be kept in sync with implementation
- Breaking changes require major version updates

### Testing Requirements
- Visual regression testing for all components
- Accessibility testing with screen readers
- Cross-browser compatibility testing
- Mobile device testing

### Documentation Updates
- Update this document when Figma designs change
- Maintain component usage examples
- Document any design system breaking changes
- Keep accessibility guidelines current

This specification document serves as the bridge between Figma designs and implementation, ensuring consistency and maintainability across the Naffles platform.