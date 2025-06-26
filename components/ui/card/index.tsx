import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

// Define your card styles with tailwind-variants
const cardStyle = tv({
  base: 'rounded-lg bg-white dark:bg-gray-800',
  variants: {
    variant: {
      borderless: 'p-2',
      elevated: 'border border-gray-200 dark:border-gray-700 p-2',
      outline: 'border border-gray-200 dark:border-gray-700 p-2',
      filled: 'bg-gray-100 dark:bg-gray-700 p-2',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'borderless',
  },
});

type CardProps = ViewProps &
  VariantProps<typeof cardStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

const Card = React.forwardRef<View, CardProps>(
  ({ className, size, variant, ...props }, ref) => {
    // First get the class string from cardStyle
    const cardClasses = cardStyle({ size, variant });

    // Then merge with additional classes using cn
    return <View ref={ref} className={cn(cardClasses, className)} {...props} />;
  },
);

Card.displayName = 'Card';

export { Card };
