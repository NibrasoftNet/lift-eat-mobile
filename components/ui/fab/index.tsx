import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { LucideIcon } from 'lucide-react-native';
import { cn } from '@/utils/nativewind-utils/cn';

// Type definitions
type FabSize = 'sm' | 'md' | 'lg';
type FabPlacement =
  | 'bottom right'
  | 'bottom left'
  | 'bottom center'
  | 'top right'
  | 'top left'
  | 'top center';

// Props interfaces
interface FabProps {
  children: React.ReactNode;
  size?: FabSize;
  placement?: FabPlacement;
  isHovered?: boolean;
  isPressed?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  className?: string;
}

interface FabIconProps {
  as: LucideIcon | React.FC<SvgProps>;
  color?: string;
  size?: number;
  className?: string;
}

interface FabLabelProps {
  children: React.ReactNode;
  className?: string;
}

// Size mappings
const sizeMap = {
  sm: {
    button: 'h-10 px-3',
    icon: 16,
    text: 'text-xs',
  },
  md: {
    button: 'h-12 px-4',
    icon: 20,
    text: 'text-sm',
  },
  lg: {
    button: 'h-14 px-5',
    icon: 24,
    text: 'text-base',
  },
};

// Placement mappings
const placementMap = {
  'bottom right': 'bottom-4 right-4',
  'bottom left': 'bottom-4 left-4',
  'bottom center': 'bottom-4 left-1/2 -translate-x-1/2',
  'top right': 'top-4 right-4',
  'top left': 'top-4 left-4',
  'top center': 'top-4 left-1/2 -translate-x-1/2',
};

// FabIcon Component
const FabIcon = forwardRef<View, FabIconProps>(
  ({ as: Icon, color = 'white', size, className }, ref) => {
    return (
      <View ref={ref} className={cn('mr-2', className)}>
        <Icon color={color} size={size} />
      </View>
    );
  },
);

// FabLabel Component
const FabLabel = forwardRef<Text, FabLabelProps>(
  ({ children, className }, ref) => {
    return (
      <Text ref={ref} className={cn('text-white font-medium', className)}>
        {children}
      </Text>
    );
  },
);

// Main Fab Component
const Fab: React.FC<FabProps> = ({
  children,
  size = 'md',
  placement = 'bottom right',
  isHovered = false,
  isPressed = false,
  isDisabled = false,
  onPress,
  className,
}) => {
  // Get size and placement styles
  const sizeStyle = sizeMap[size];
  const placementStyle = placementMap[placement];

  // Prepare child components with proper sizing
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<FabIconProps | FabLabelProps>(child)) {
      // Check if the child is a FabIcon
      if (child.type === FabIcon) {
        const props = child.props as FabIconProps;
        // @ts-ignore
        return React.cloneElement<FabIconProps>(child, {
          ...props,
          size: props.size || sizeStyle.icon,
        });
      }

      // Check if the child is a FabLabel
      if (child.type === FabLabel) {
        const props = child.props as FabLabelProps;
        // @ts-ignore
        return React.cloneElement<FabLabelProps>(child, {
          ...props,
          className: cn(sizeStyle.text, props.className),
        });
      }
    }
    return child;
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={styles.fabContainer}
      className={cn(
        'absolute rounded-full flex-row items-center justify-center',
        placementStyle,
        sizeStyle.button,
        'bg-blue-500',
        isHovered && 'bg-blue-600',
        isPressed && 'bg-blue-700',
        isDisabled && 'bg-gray-400',
        className,
      )}
    >
      {childrenWithProps}
    </TouchableOpacity>
  );
};

// Additional styles
const styles = StyleSheet.create({
  fabContainer: {
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10,
  },
});

// Set Display Names
FabIcon.displayName = 'FabIcon';
FabLabel.displayName = 'FabLabel';
Fab.displayName = 'Fab';

export { Fab, FabLabel, FabIcon };
