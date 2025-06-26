import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  isValidElement,
  cloneElement,
} from 'react';
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Context
const AccordionContext = createContext<{
  expandedItems: Set<string>;
  toggleItem: (key: string) => void;
  isItemExpanded: (key: string) => boolean;
} | null>(null);

type AccordionProps = {
  children: ReactNode;
  className?: string;
};

export const Accordion = ({ children, className }: AccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const isItemExpanded = (key: string) => expandedItems.has(key);

  return (
    <AccordionContext.Provider
      value={{ expandedItems, toggleItem, isItemExpanded }}
    >
      <View className={cn(className)}>{children}</View>
    </AccordionContext.Provider>
  );
};

type AccordionItemProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export const AccordionItem = ({
  value,
  children,
  className,
}: AccordionItemProps) => (
  <View className={cn(className)}>
    {React.Children.map(children, (child) => {
      if (!isValidElement(child)) return child;
      return cloneElement(child as ReactElement<any>, { itemKey: value });
    })}
  </View>
);

// Header
export const AccordionHeader = ({ children }: { children: ReactNode }) => (
  <View>{children}</View>
);

type AccordionTriggerProps = {
  children: (props: { isExpanded: boolean }) => ReactNode;
  itemKey?: string;
  className?: string;
};

export const AccordionTrigger = ({
  children,
  itemKey = '',
  className,
}: AccordionTriggerProps) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionTrigger must be used within Accordion');

  const isExpanded = ctx.isItemExpanded(itemKey);

  return (
    <Pressable
      onPress={() => ctx.toggleItem(itemKey)}
      className={cn('flex-row items-center', className)}
    >
      {children({ isExpanded })}
    </Pressable>
  );
};

// Icon
type AccordionIconProps = {
  as: React.ComponentType<any>;
  className?: string;
};

export const AccordionIcon = ({ as: Icon, className }: AccordionIconProps) => (
  <Icon className={cn(className)} />
);

// Title Text
export const AccordionTitleText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Text className={cn('text-base font-medium text-gray-800', className)}>
    {children}
  </Text>
);

// Content
type AccordionContentProps = {
  children: ReactNode;
  itemKey?: string;
  className?: string;
};

export const AccordionContent = ({
  children,
  itemKey = '',
  className,
}: AccordionContentProps) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionContent must be used within Accordion');

  if (!ctx.isItemExpanded(itemKey)) return null;

  return <View className={cn('mt-2', className)}>{children}</View>;
};

// Content Text
export const AccordionContentText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Text className={cn('text-gray-600 text-base', className)}>{children}</Text>
);
