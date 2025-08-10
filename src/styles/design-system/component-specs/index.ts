/**
 * Component Specifications Index
 * 
 * Central export for all component specifications with implementation guidelines,
 * variants, states, and usage patterns based on Figma designs.
 */

// Import all component specifications
import buttonSpec from './button';
import cardSpec from './card';
import formSpec from './form';
import navigationSpec from './navigation';
import modalSpec from './modal';

// Import accessibility utilities
import { accessibility } from '../accessibility';

// Export individual specifications
export { buttonSpec, cardSpec, formSpec, navigationSpec, modalSpec };

// Export accessibility utilities
export { accessibility };

// Export combined specifications object
export const componentSpecs = {
  button: buttonSpec,
  card: cardSpec,
  form: formSpec,
  navigation: navigationSpec,
  modal: modalSpec,
};

// Export types for TypeScript support
export type ComponentSpecs = typeof componentSpecs;
export type ButtonSpec = typeof buttonSpec;
export type CardSpec = typeof cardSpec;
export type FormSpec = typeof formSpec;
export type NavigationSpec = typeof navigationSpec;
export type ModalSpec = typeof modalSpec;

// Utility function to get component specification
export function getComponentSpec<T extends keyof ComponentSpecs>(
  component: T
): ComponentSpecs[T] {
  return componentSpecs[component];
}

// Utility function to get component variant styles
export function getComponentVariant<
  T extends keyof ComponentSpecs,
  V extends keyof ComponentSpecs[T]['variants']
>(
  component: T,
  variant: V
): ComponentSpecs[T]['variants'][V] {
  return componentSpecs[component].variants[variant];
}

// Utility function to get component size styles
export function getComponentSize<
  T extends keyof ComponentSpecs,
  S extends keyof ComponentSpecs[T]['sizes']
>(
  component: T,
  size: S
): ComponentSpecs[T]['sizes'][S] {
  return componentSpecs[component].sizes[size];
}

// Utility function to create component styles
export function createComponentStyles<T extends keyof ComponentSpecs>(
  component: T,
  options: {
    variant?: keyof ComponentSpecs[T]['variants'];
    size?: keyof ComponentSpecs[T]['sizes'];
    state?: string;
  } = {}
): Record<string, any> {
  const spec = componentSpecs[component];
  const styles = { ...spec.base };

  // Apply variant styles
  if (options.variant && spec.variants) {
    const variantStyles = spec.variants[options.variant];
    Object.assign(styles, variantStyles);
  }

  // Apply size styles
  if (options.size && spec.sizes) {
    const sizeStyles = spec.sizes[options.size];
    Object.assign(styles, sizeStyles);
  }

  // Apply state styles
  if (options.state && options.variant && spec.variants) {
    const variantSpec = spec.variants[options.variant] as any;
    if (variantSpec.states && variantSpec.states[options.state]) {
      Object.assign(styles, variantSpec.states[options.state]);
    }
  }

  return styles;
}

// Utility function to validate component props
export function validateComponentProps<T extends keyof ComponentSpecs>(
  component: T,
  props: {
    variant?: string;
    size?: string;
  }
): {
  isValid: boolean;
  errors: string[];
} {
  const spec = componentSpecs[component];
  const errors: string[] = [];

  // Validate variant
  if (props.variant && spec.variants && !(props.variant in spec.variants)) {
    errors.push(`Invalid variant "${props.variant}" for component "${component}"`);
  }

  // Validate size
  if (props.size && spec.sizes && !(props.size in spec.sizes)) {
    errors.push(`Invalid size "${props.size}" for component "${component}"`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Utility function to get all available variants for a component
export function getComponentVariants<T extends keyof ComponentSpecs>(
  component: T
): string[] {
  const spec = componentSpecs[component];
  return spec.variants ? Object.keys(spec.variants) : [];
}

// Utility function to get all available sizes for a component
export function getComponentSizes<T extends keyof ComponentSpecs>(
  component: T
): string[] {
  const spec = componentSpecs[component];
  return spec.sizes ? Object.keys(spec.sizes) : [];
}

// Utility function to get component usage guidelines
export function getComponentUsage<T extends keyof ComponentSpecs>(
  component: T
): ComponentSpecs[T]['usage'] | undefined {
  const spec = componentSpecs[component];
  return (spec as any).usage;
}

// Utility function to get component accessibility requirements
export function getComponentAccessibility<T extends keyof ComponentSpecs>(
  component: T
): ComponentSpecs[T]['accessibility'] | undefined {
  const spec = componentSpecs[component];
  return (spec as any).accessibility;
}

// Default export
export default componentSpecs;