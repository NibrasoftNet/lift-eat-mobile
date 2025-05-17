import React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

interface PressableProps extends RNPressableProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  loadingClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  children?:
    | React.ReactNode
    | ((state: { pressed: boolean }) => React.ReactNode);
  rippleColor?: string;
  rippleOpacity?: number;
  pressedClassName?: string;
  style?: StyleProp<ViewStyle>;
}

const pressable = tv({
  slots: {
    base: 'flex flex-row items-center justify-center',
    text: 'text-center font-medium',
    loading: 'mr-2',
    leftIcon: 'mr-2',
    rightIcon: 'ml-2',
  },
  variants: {
    variant: {
      default: {
        base: 'bg-gray-100',
        text: 'text-gray-900',
      },
      primary: {
        base: 'bg-blue-600',
        text: 'text-white',
      },
      secondary: {
        base: 'bg-gray-200',
        text: 'text-gray-900',
      },
      outline: {
        base: 'border border-gray-300 bg-transparent',
        text: 'text-gray-900',
      },
      ghost: {
        base: 'bg-transparent',
        text: 'text-gray-900',
      },
      link: {
        base: 'bg-transparent p-0',
        text: 'text-blue-600 underline',
      },
      destructive: {
        base: 'bg-red-600',
        text: 'text-white',
      },
    },
    size: {
      sm: {
        base: 'px-3 py-1 rounded-md',
        text: 'text-sm',
      },
      md: {
        base: 'px-4 py-2 rounded-md',
        text: 'text-base',
      },
      lg: {
        base: 'px-5 py-3 rounded-md',
        text: 'text-lg',
      },
      icon: {
        base: 'p-2 rounded-full',
      },
    },
    fullWidth: {
      true: {
        base: 'w-full',
      },
    },
    disabled: {
      true: {
        base: 'opacity-50',
      },
    },
    isLoading: {
      true: {
        text: 'opacity-0',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    fullWidth: false,
    disabled: false,
    isLoading: false,
  },
});

const Pressable = React.forwardRef<View, PressableProps>(
  (
    {
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      textClassName,
      loadingClassName,
      iconClassName,
      disabled = false,
      children,
      rippleColor,
      rippleOpacity = 0.3,
      pressedClassName,
      style,
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const slots = pressable({
      variant,
      size,
      fullWidth,
      disabled: disabled || isLoading,
      isLoading,
    });

    const handlePress = (event: GestureResponderEvent) => {
      if (!disabled && !isLoading && onPress) {
        onPress(event);
      }
    };

    const handleLongPress = (event: GestureResponderEvent) => {
      if (!disabled && !isLoading && onLongPress) {
        onLongPress(event);
      }
    };

    const handlePressIn = (event: GestureResponderEvent) => {
      if (!disabled && !isLoading && onPressIn) {
        onPressIn(event);
      }
    };

    const handlePressOut = (event: GestureResponderEvent) => {
      if (!disabled && !isLoading && onPressOut) {
        onPressOut(event);
      }
    };

    return (
      <RNPressable
        ref={ref}
        style={({ pressed }) => [
          style,
          pressed && pressedClassName ? { opacity: 0.8 } : null,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={
          rippleColor
            ? {
                color: rippleColor,
                foreground: true,
                borderless: false,
                radius: undefined,
              }
            : undefined
        }
        disabled={disabled || isLoading}
        {...props}
      >
        {({ pressed }) => {
          if (typeof children === 'function') {
            return children({ pressed });
          }

          return (
            <View
              className={cn(
                slots.base(),
                pressed ? pressedClassName : '',
                className,
              )}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={
                    variant === 'primary' || variant === 'destructive'
                      ? 'white'
                      : '#3b82f6'
                  }
                  className={cn(slots.loading(), loadingClassName)}
                  style={StyleSheet.absoluteFill}
                />
              )}

              {leftIcon && !isLoading && (
                <View className={cn(slots.leftIcon(), iconClassName)}>
                  {leftIcon}
                </View>
              )}

              {typeof children === 'string' ? (
                <Text className={cn(slots.text(), textClassName)}>
                  {children}
                </Text>
              ) : (
                children
              )}

              {rightIcon && !isLoading && (
                <View className={cn(slots.rightIcon(), iconClassName)}>
                  {rightIcon}
                </View>
              )}
            </View>
          );
        }}
      </RNPressable>
    );
  },
);

Pressable.displayName = 'Pressable';

export { Pressable };
