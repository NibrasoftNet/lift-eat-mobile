import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

// First define the style variants
const hstackStyle = tv({
  base: 'flex-row',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    reversed: {
      true: 'flex-row-reverse',
    },
  },
  defaultVariants: {
    space: 'md',
  },
});

type HStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<View, HStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={hstackStyle({ space, reversed, className })}
        {...props}
      />
    );
  },
);

HStack.displayName = 'HStack';

export { HStack };
