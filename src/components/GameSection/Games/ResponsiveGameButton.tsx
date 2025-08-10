import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/shared/Button';
import { useGameResponsive } from '@hooks/useGameResponsive';

interface ResponsiveGameButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
}

export const ResponsiveGameButton: React.FC<ResponsiveGameButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  icon,
  fullWidth = false,
  hapticFeedback = true
}) => {
  const { breakpoints, config } = useGameResponsive();

  const handleClick = () => {
    // Haptic feedback for touch devices
    if (hapticFeedback && breakpoints.isTouchDevice && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onClick();
  };

  const getVariantClasses = () => {
    const baseClasses = 'font-bold transition-all duration-200 border-2';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-nafl-aqua-500 hover:bg-nafl-aqua-600 border-nafl-aqua-500 text-white`;
      case 'secondary':
        return `${baseClasses} bg-nafl-grey-600 hover:bg-nafl-grey-500 border-nafl-grey-500 text-white`;
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 border-green-600 text-white`;
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 border-red-600 text-white`;
      case 'warning':
        return `${baseClasses} bg-nafl-sponge-500 hover:bg-nafl-sponge-600 border-nafl-sponge-500 text-black`;
      default:
        return `${baseClasses} bg-nafl-aqua-500 hover:bg-nafl-aqua-600 border-nafl-aqua-500 text-white`;
    }
  };

  const getSizeClasses = () => {
    if (breakpoints.mobile) {
      return config.touchFriendly 
        ? 'px-4 py-3 text-sm min-h-[48px]' // Touch-friendly minimum size
        : 'px-3 py-2 text-sm';
    }
    
    if (breakpoints.tablet) {
      return 'px-6 py-3 text-base min-h-[44px]';
    }
    
    // Desktop
    return 'px-8 py-4 text-lg min-h-[40px]';
  };

  const getWidthClasses = () => {
    if (fullWidth) return 'w-full';
    if (breakpoints.mobile) return 'min-w-[120px]';
    if (breakpoints.tablet) return 'min-w-[140px]';
    return 'min-w-[160px]';
  };

  const getAnimationProps = () => {
    const baseProps = {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 }
    };

    return config.getAnimationProps(baseProps);
  };

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${getWidthClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${breakpoints.mobile ? 'rounded-lg' : 'rounded-xl'}
    ${className}
    flex items-center justify-center gap-2
    select-none
    ${config.touchFriendly ? 'touch-manipulation' : ''}
  `.trim();

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      {...getAnimationProps()}
      // Accessibility
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {icon && (
        <span className={`${config.fontSize.medium} flex-shrink-0`}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-center">
        {children}
      </span>
    </motion.button>
  );
};

// Specialized button variants for common game actions
export const GameActionButton: React.FC<Omit<ResponsiveGameButtonProps, 'variant'> & { action: 'hit' | 'stand' | 'double' | 'split' | 'deal' }> = ({
  action,
  ...props
}) => {
  const getActionVariant = (): ResponsiveGameButtonProps['variant'] => {
    switch (action) {
      case 'hit':
        return 'warning';
      case 'stand':
        return 'primary';
      case 'double':
        return 'secondary';
      case 'split':
        return 'secondary';
      case 'deal':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'hit':
        return '👆';
      case 'stand':
        return '✋';
      case 'double':
        return '⬆️';
      case 'split':
        return '↔️';
      case 'deal':
        return '🃏';
      default:
        return null;
    }
  };

  return (
    <ResponsiveGameButton
      variant={getActionVariant()}
      icon={getActionIcon()}
      {...props}
    />
  );
};

export const GameChoiceButton: React.FC<Omit<ResponsiveGameButtonProps, 'variant'> & { 
  choice: string;
  isSelected?: boolean;
  choiceIcon?: React.ReactNode;
}> = ({
  choice,
  isSelected = false,
  choiceIcon,
  className = '',
  ...props
}) => {
  const selectedClasses = isSelected 
    ? 'ring-4 ring-nafl-sponge-500 ring-opacity-50 bg-nafl-sponge-500 text-black' 
    : '';

  return (
    <ResponsiveGameButton
      variant={isSelected ? 'warning' : 'primary'}
      className={`${selectedClasses} ${className}`}
      icon={choiceIcon}
      {...props}
    >
      {choice}
    </ResponsiveGameButton>
  );
};