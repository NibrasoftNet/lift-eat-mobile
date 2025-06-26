import { cn } from '@/utils/nativewind-utils/cn';
import React, { forwardRef } from 'react';
import {
  View,
  Pressable,
  Text,
  ScrollView,
  VirtualizedList,
  FlatList,
  SectionList,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { tv, VariantProps } from 'tailwind-variants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// Styles
const actionsheetStyle = tv({
  base: 'absolute inset-0 z-50',
});

const actionsheetContentStyle = tv({
  base: 'bg-white rounded-t-3xl shadow-lg pt-5 px-4 pb-8 absolute bottom-0 left-0 right-0',
});

const actionsheetItemStyle = tv({
  base: 'w-full flex-row items-center p-3 rounded-sm active:bg-gray-100',
});

const actionsheetItemTextStyle = tv({
  base: 'text-gray-900 font-normal',
  variants: {
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const actionsheetDragIndicatorStyle = tv({
  base: 'w-16 h-1 bg-gray-300 rounded-full my-2 mx-auto',
});

const actionsheetDragIndicatorWrapperStyle = tv({
  base: 'w-full py-1 items-center',
});

const actionsheetBackdropStyle = tv({
  base: 'absolute inset-0 bg-black/50',
});

const actionsheetScrollViewStyle = tv({
  base: 'w-full',
});

const actionsheetSectionHeaderTextStyle = tv({
  base: 'text-gray-500 font-bold uppercase p-3',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

const actionsheetIconStyle = tv({
  base: 'text-gray-500',
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Components
const Actionsheet = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return <View className={actionsheetStyle()}>{children}</View>;
};

const ActionsheetContent = forwardRef<
  View,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <AnimatedView
      ref={ref}
      entering={SlideInDown.duration(300)}
      exiting={SlideOutDown.duration(300)}
      className={cn(actionsheetContentStyle(), className)}
    >
      {children}
    </AnimatedView>
  );
});

const ActionsheetBackdrop = ({ onPress }: { onPress: () => void }) => {
  return (
    <AnimatedPressable
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      onPress={onPress}
      className={actionsheetBackdropStyle()}
    />
  );
};

const ActionsheetItem = forwardRef<
  View,
  { children: React.ReactNode; onPress?: () => void; className?: string }
>(({ children, onPress, className }, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      className={cn(actionsheetItemStyle(), className)}
    >
      {children}
    </Pressable>
  );
});

const ActionsheetItemText = forwardRef<
  Text,
  VariantProps<typeof actionsheetItemTextStyle> & {
    children: React.ReactNode;
    className?: string;
  }
>(({ children, size, bold, underline, className }, ref) => {
  return (
    <Text
      ref={ref}
      className={cn(
        actionsheetItemTextStyle({ size, bold, underline }),
        className,
      )}
    >
      {children}
    </Text>
  );
});

const ActionsheetDragIndicator = forwardRef<View, { className?: string }>(
  ({ className }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(actionsheetDragIndicatorStyle(), className)}
      />
    );
  },
);

const ActionsheetDragIndicatorWrapper = forwardRef<
  View,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(actionsheetDragIndicatorWrapperStyle(), className)}
    >
      {children}
    </View>
  );
});

const ActionsheetScrollView = forwardRef<
  ScrollView,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <AnimatedScrollView
      ref={ref}
      className={cn(actionsheetScrollViewStyle(), className)}
    >
      {children}
    </AnimatedScrollView>
  );
});

const ActionsheetVirtualizedList = forwardRef<
  VirtualizedList<any>,
  { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <VirtualizedList
      renderItem={undefined}
      ref={ref}
      className={cn(actionsheetScrollViewStyle(), className)}
      {...props}
    />
  );
});

const ActionsheetFlatList = forwardRef<FlatList, { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <FlatList
        data={undefined}
        renderItem={undefined}
        ref={ref}
        className={cn(actionsheetScrollViewStyle(), className)}
        {...props}
      />
    );
  },
);

const ActionsheetSectionList = forwardRef<SectionList, { className?: string }>(
  ({ className, ...props }, ref) => {
    return (
      <SectionList
        sections={[]}
        ref={ref}
        className={cn(actionsheetScrollViewStyle(), className)}
        {...props}
      />
    );
  },
);

const ActionsheetSectionHeaderText = forwardRef<
  Text,
  VariantProps<typeof actionsheetSectionHeaderTextStyle> & {
    children: React.ReactNode;
    className?: string;
  }
>(({ children, size, className }, ref) => {
  return (
    <Text
      ref={ref}
      className={cn(actionsheetSectionHeaderTextStyle({ size }), className)}
    >
      {children}
    </Text>
  );
});

const ActionsheetIcon = forwardRef<
  View,
  VariantProps<typeof actionsheetIconStyle> & {
    as: React.ElementType;
    className?: string;
  }
>(({ as: Icon, size, className }, ref) => {
  return (
    <View ref={ref} className={cn(actionsheetIconStyle({ size }), className)}>
      <Icon
        size={actionsheetIconStyle.variants.size[size || 'md']
          ?.split(' ')[0]
          .replace('h-', '')}
      />
    </View>
  );
});

export {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetScrollView,
  ActionsheetVirtualizedList,
  ActionsheetFlatList,
  ActionsheetSectionList,
  ActionsheetSectionHeaderText,
  ActionsheetIcon,
};
