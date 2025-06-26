import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

interface SpinnerProps extends Omit<ActivityIndicatorProps, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  fullPage?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
}

// Size mapping for the ActivityIndicator
const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 36,
  xl: 48,
};

// Color mapping for variants
const colorMap = {
  primary: '#3b82f6', // blue-500
  secondary: '#6b7280', // gray-500
  success: '#10b981', // green-500
  danger: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
  info: '#06b6d4', // cyan-500
};

const spinner = tv({
  slots: {
    container: 'flex items-center justify-center',
    label: 'text-center mt-2',
    fullPageContainer:
      'absolute inset-0 bg-white/70 flex items-center justify-center z-50',
  },
  variants: {
    labelPosition: {
      top: {
        container: 'flex-col-reverse',
        label: 'mb-2 mt-0',
      },
      bottom: {
        container: 'flex-col',
        label: 'mt-2',
      },
      left: {
        container: 'flex-row-reverse items-center',
        label: 'mr-2 ml-0 mt-0',
      },
      right: {
        container: 'flex-row items-center',
        label: 'ml-2 mt-0',
      },
    },
    fullPage: {
      true: {},
    },
  },
  defaultVariants: {
    labelPosition: 'bottom',
    fullPage: false,
  },
});

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  labelPosition = 'bottom',
  fullPage = false,
  className,
  labelClassName,
  containerClassName,
  color,
  style,
  ...props
}) => {
  // Determine the size based on predefined sizes or custom number
  const indicatorSize = typeof size === 'string' ? sizeMap[size] : size;

  // Determine the color based on variant or custom color prop
  const indicatorColor = color || colorMap[variant];

  const slots = spinner({ labelPosition, fullPage });

  // Calculate container
  const Container = fullPage ? View : React.Fragment;
  const containerProps = fullPage
    ? {
        className: cn(slots.fullPageContainer(), containerClassName),
        style: StyleSheet.create({
          fullScreen: { ...StyleSheet.absoluteFillObject },
        }).fullScreen,
      }
    : {};

  return (
    <Container {...containerProps}>
      <View className={cn(slots.container(), className)} style={style}>
        <ActivityIndicator
          size={indicatorSize > 24 ? 'large' : 'small'}
          color={indicatorColor}
          style={{
            transform: [{ scale: indicatorSize > 36 ? indicatorSize / 36 : 1 }],
          }}
          {...props}
        />

        {label && (
          <Text className={cn(slots.label(), labelClassName)}>{label}</Text>
        )}
      </View>
    </Container>
  );
};

export default Spinner;
