import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

const dividerStyle = tv({
  base: 'bg-gray-200',
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

type DividerProps = ViewProps &
  VariantProps<typeof dividerStyle> & {
    className?: string;
  };

const Divider = React.forwardRef<View, DividerProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(dividerStyle({ orientation }), className)}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';

export { Divider };
