import React from 'react';
import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

// First define the style variants
const textStyle = tv({
  base: 'text-black dar:text-white font-body',
  variants: {
    isTruncated: {
      true: 'truncate',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Define the variant props separately
type TextVariants = VariantProps<typeof textStyle>;

// Then combine with RN TextProps without circular reference
interface TextComponentProps extends RNTextProps, TextVariants {
  className?: string;
}

const Text = React.forwardRef<RNText, TextComponentProps>(
  (
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = 'md',
      sub,
      italic,
      highlight,
      ...props
    },
    ref,
  ) => {
    return (
      <RNText
        ref={ref}
        className={textStyle({
          isTruncated,
          bold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
          className,
        })}
        {...props}
      />
    );
  },
);

Text.displayName = 'Text';

export { Text };
