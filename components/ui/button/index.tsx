import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { AlertCircleIcon, LucideIcon } from 'lucide-react-native';
import { tv, VariantProps } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';
import { SvgProps } from 'react-native-svg';

// Button Variants
const buttonStyle = tv({
  base: 'flex-row items-center justify-center rounded-lg px-4 py-2',
  variants: {
    variant: {
      solid: '',
      outline: 'border bg-transparent',
      ghost: 'bg-transparent',
    },
    colorScheme: {
      primary: '',
      secondary: '',
      danger: '',
    },
    size: {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  compoundVariants: [
    // Solid variants
    {
      variant: 'solid',
      colorScheme: 'primary',
      class: 'bg-blue-500',
    },
    {
      variant: 'solid',
      colorScheme: 'secondary',
      class: 'bg-gray-500',
    },
    {
      variant: 'solid',
      colorScheme: 'danger',
      class: 'bg-red-500',
    },
    // Outline variants
    {
      variant: 'outline',
      colorScheme: 'primary',
      class: 'border-blue-500',
    },
    {
      variant: 'outline',
      colorScheme: 'secondary',
      class: 'border-gray-500',
    },
    {
      variant: 'outline',
      colorScheme: 'danger',
      class: 'border-red-500',
    },
    // Ghost variants
    {
      variant: 'ghost',
      colorScheme: 'primary',
      class: 'text-blue-500',
    },
    {
      variant: 'ghost',
      colorScheme: 'secondary',
      class: 'text-gray-500',
    },
    {
      variant: 'ghost',
      colorScheme: 'danger',
      class: 'text-red-500',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
  },
});

// Fixed Button Props type
type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

// Fixed Button component with proper ref typing
const Button = React.forwardRef<View, ButtonProps>(
  (
    { className, variant, colorScheme, size, disabled, children, ...props },
    ref,
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        className={buttonStyle({
          variant,
          colorScheme,
          size,
          disabled,
          className,
        })}
        activeOpacity={0.8}
        disabled={disabled}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  },
);
Button.displayName = 'Button';

// ButtonText Variants
const buttonTextStyle = tv({
  base: 'font-medium text-center text-black dark:text-white',
  variants: {
    colorScheme: {
      primary: '',
      secondary: '',
      danger: '',
    },
    variant: {
      solid: 'text-white',
      outline: '',
      ghost: '',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  compoundVariants: [
    // Outline text colors
    {
      variant: 'outline',
      colorScheme: 'primary',
      class: 'text-blue-500',
    },
    {
      variant: 'outline',
      colorScheme: 'secondary',
      class: 'text-gray-500',
    },
    {
      variant: 'outline',
      colorScheme: 'danger',
      class: 'text-red-500',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
  },
});

// ButtonText
type ButtonTextProps = TextProps &
  VariantProps<typeof buttonTextStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

const ButtonText = ({
  className,
  variant,
  colorScheme,
  size,
  children,
  ...props
}: ButtonTextProps) => {
  return (
    <Text
      className={buttonTextStyle({ variant, colorScheme, size, className })}
      {...props}
    >
      {children}
    </Text>
  );
};
ButtonText.displayName = 'ButtonText';

// ButtonSpinner
type ButtonSpinnerProps = {
  size?: number | 'small' | 'large';
  color?: string;
  className?: string;
};

const ButtonSpinner = ({
  size = 'small',
  color = 'white',
  className = '',
}: ButtonSpinnerProps) => {
  return (
    <View className={className}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
ButtonSpinner.displayName = 'ButtonSpinner';

// ButtonIcon

type ButtonIconProps = {
  className?: string;
  as?: LucideIcon | React.FC<SvgProps>;
  size?: number;
  color?: string;
};

const ButtonIcon = ({
  className,
  as: IconComponent = AlertCircleIcon,
  size,
  color,
  ...props
}: ButtonIconProps) => {
  return (
    <IconComponent
      size={size}
      color={color}
      className={cn('mr-1', className)}
      {...props}
    />
  );
};
ButtonIcon.displayName = 'ButtonIcon';
// ButtonGroup
type ButtonGroupProps = ViewProps & {
  className?: string;
  children: React.ReactNode;
};

const ButtonGroup = ({
  className = '',
  children,
  ...props
}: ButtonGroupProps) => {
  return (
    <View className={cn('flex-row gap-2', className)} {...props}>
      {children}
    </View>
  );
};
ButtonGroup.displayName = 'ButtonGroup';

// Export
export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
