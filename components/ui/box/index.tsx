import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

// Define your box styles with tailwind-variants
const boxStyle = tv({
  base: '', // Start with empty base style
  variants: {
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    bg: {
      transparent: 'bg-transparent',
      white: 'bg-white dark:bg-gray-800',
      gray: 'bg-gray-100 dark:bg-gray-700',
      primary: 'bg-blue-500 dark:bg-blue-600',
      success: 'bg-green-500 dark:bg-green-600',
      danger: 'bg-red-500 dark:bg-red-600',
      warning: 'bg-yellow-500 dark:bg-yellow-600',
    },
    border: {
      none: 'border-0',
      sm: 'border',
      md: 'border-2',
      lg: 'border-4',
    },
    borderColor: {
      gray: 'border-gray-200 dark:border-gray-600',
      primary: 'border-blue-500 dark:border-blue-600',
      success: 'border-green-500 dark:border-green-600',
      danger: 'border-red-500 dark:border-red-600',
      warning: 'border-yellow-500 dark:border-yellow-600',
    },
    p: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    px: {
      none: 'px-0',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
      xl: 'px-8',
    },
    py: {
      none: 'py-0',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
      xl: 'py-8',
    },
  },
  defaultVariants: {
    rounded: 'md',
    bg: 'transparent',
    shadow: 'none',
    border: 'none',
    p: 'none',
  },
});

type BoxProps = ViewProps &
  VariantProps<typeof boxStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

const Box = React.forwardRef<View, BoxProps>(
  ({ className, ...variantProps }, ref) => {
    const boxClasses = boxStyle(variantProps);

    return (
      <View ref={ref} className={cn(boxClasses, className)} {...variantProps} />
    );
  },
);

Box.displayName = 'Box';

export { Box };
