import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

// First define the style variants
const vstackStyle = tv({
  base: 'flex-col',
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
      true: 'flex-col-reverse',
    },
  },
  defaultVariants: {
    space: 'md',
  },
});

type VStackProps = ViewProps & VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<View, VStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={vstackStyle({ space, reversed, className })}
        {...props}
      />
    );
  }
);

VStack.displayName = 'VStack';

export { VStack };