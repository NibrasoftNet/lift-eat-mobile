'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal as RNModal,
  View,
  ModalProps as RNModalProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

const modalContentVariants = tv({
  base: 'bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6',
  variants: {
    size: {
      sm: 'w-[80%] max-w-sm',
      md: 'w-[90%] max-w-md',
      lg: 'w-full max-w-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const headerVariants = tv({ base: 'mb-4' });
const bodyVariants = tv({ base: 'mb-4' });
const footerVariants = tv({ base: 'mt-2' });
const backdropVariants = tv({ base: 'absolute inset-0 bg-black/50' });

type BaseProps = { className?: string; children: React.ReactNode };

type ModalRootProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
} & Omit<RNModalProps, 'visible'>;

const Modal: React.FC<ModalRootProps> = ({
  isOpen,
  onClose,
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(isOpen);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        scale.value = withTiming(1, { duration: 250 });
        opacity.value = withTiming(1, { duration: 250 });
      });
    } else {
      scale.value = withTiming(0.95, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 }, () =>
        runOnJS(setVisible)(false),
      );
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <RNModal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
      {...props}
    >
      <View className="flex-1 justify-center items-center">{children}</View>
    </RNModal>
  );
};

const ModalBackdrop: React.FC<BaseProps> = ({ className, ...props }) => {
  return <View className={cn(backdropVariants(), className)} {...props} />;
};

type ModalContentProps = BaseProps & VariantProps<typeof modalContentVariants>;

const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
  size,
  ...props
}) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={style}
      className={cn(modalContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const ModalHeader: React.FC<BaseProps> = ({ className, ...props }) => (
  <View className={cn(headerVariants(), className)} {...props} />
);

const ModalBody: React.FC<BaseProps> = ({ className, ...props }) => (
  <View className={cn(bodyVariants(), className)} {...props} />
);

const ModalFooter: React.FC<BaseProps> = ({ className, ...props }) => (
  <View className={cn(footerVariants(), className)} {...props} />
);

export {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
};
