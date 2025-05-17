import React, { forwardRef, memo } from 'react';
import { H1, H2, H3, H4, H5, H6 } from '@expo/html-elements';
import { cssInterop } from 'nativewind';
import { tv, VariantProps } from 'tailwind-variants';

export const headingStyle = tv({
  base: `text-typography-900 font-bold font-heading tracking-sm my-0`,
  variants: {
    isTruncated: {
      true: 'truncate',
    },
    bold: {
      true: 'font-bold font-ubuntu-light',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
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
    size: {
      '5xl': 'text-6xl',
      '4xl': 'text-5xl',
      '3xl': 'text-4xl',
      '2xl': 'text-3xl',
      xl: 'text-2xl',
      lg: 'text-xl',
      md: 'text-lg',
      sm: 'text-base',
      xs: 'text-sm',
    },
  },
});

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentPropsWithoutRef<typeof H1> & {
    as?: React.ElementType;
  };

cssInterop(H1, { className: 'style' });
cssInterop(H2, { className: 'style' });
cssInterop(H3, { className: 'style' });
cssInterop(H4, { className: 'style' });
cssInterop(H5, { className: 'style' });
cssInterop(H6, { className: 'style' });

const MappedHeading = memo(
  forwardRef<React.ComponentRef<typeof H1>, IHeadingProps>(
    (
      {
        size,
        className,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
        ...props
      },
      ref,
    ) => {
      switch (size) {
        case '5xl':
        case '4xl':
        case '3xl':
          return (
            <H1
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case '2xl':
          return (
            <H2
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'xl':
          return (
            <H3
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'lg':
          return (
            <H4
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'md':
          return (
            <H5
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        case 'sm':
        case 'xs':
          return (
            <H6
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
        default:
          return (
            <H4
              className={headingStyle({
                size,
                isTruncated,
                bold,
                underline,
                strikeThrough,
                sub,
                italic,
                highlight,
                class: className,
              })}
              {...props}
              // @ts-expect-error
              ref={ref}
            />
          );
      }
    },
  ),
);

const Heading = memo(
  forwardRef<React.ComponentRef<typeof H1>, IHeadingProps>(
    ({ className, size = 'lg', as: AsComp, ...props }, ref) => {
      const {
        isTruncated,
        bold,
        underline,
        strikeThrough,
        sub,
        italic,
        highlight,
      } = props;

      if (AsComp) {
        return (
          <AsComp
            className={headingStyle({
              size,
              isTruncated,
              bold,
              underline,
              strikeThrough,
              sub,
              italic,
              highlight,
              class: className,
            })}
            {...props}
          />
        );
      }

      return (
        <MappedHeading className={className} size={size} ref={ref} {...props} />
      );
    },
  ),
);

Heading.displayName = 'Heading';

export { Heading };
