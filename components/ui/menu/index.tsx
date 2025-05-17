import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/utils/nativewind-utils/cn';
import { Pressable } from '@/components/ui/pressable';

export type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

interface MenuProps {
  placement?: Placement;
  offset?: number;
  disabledKeys?: string[];
  trigger: (props: any) => React.ReactNode;
  children: ReactNode;
}

export const Menu = ({
  placement = 'bottom',
  offset = 0,
  trigger,
  children,
}: MenuProps) => {
  // You can use floating-ui or custom logic here for actual placement behavior
  return (
    <View className="relative">
      {trigger({})}
      <View
        className={cn(
          'absolute z-50 rounded-md border border-gray-200 bg-white shadow-md',
          placement.includes('top') && 'bottom-full mb-2',
          placement.includes('bottom') && 'top-full mt-2',
          placement.includes('right') && 'left-full ml-2',
          placement.includes('left') && 'right-full mr-2',
        )}
      >
        {children}
      </View>
    </View>
  );
};

// MenuItem

interface MenuItemProps {
  key: string;
  textValue: string;
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const MenuItem = ({
  onPress,
  disabled,
  children,
  className,
}: MenuItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn('flex-row items-center px-4 py-2', className)}
    >
      {children}
    </Pressable>
  );
};

// MenuItemLabel
export const MenuItemLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Text className={cn('text-sm text-gray-900', className)}>{children}</Text>
  );
};

export const MenuSeparator = () => {
  return <View className="h-[1px] bg-gray-200 my-1 w-full" />;
};
