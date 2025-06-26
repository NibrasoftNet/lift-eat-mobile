import React from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
  SlideInUp,
  SlideOutUp,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

const sizes: { [key: string]: number } = {
  xs: 0.15,
  sm: 0.25,
  md: 0.5,
  lg: 0.75,
  full: 1,
};

const drawerStyle = tv({
  base: 'w-full h-full web:pointer-events-none relative',
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
    anchor: {
      left: 'items-start',
      right: 'items-end',
      top: 'justify-start',
      bottom: 'justify-end',
    },
  },
});

const drawerBackdropStyle = tv({
  base: 'absolute left-0 top-0 right-0 bottom-0 bg-background-dark web:cursor-default',
});

const drawerContentStyle = tv({
  base: 'bg-background-0 overflow-scroll border-outline-100 p-6 absolute',
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
    anchor: {
      left: 'h-full border-r',
      right: 'h-full border-l',
      top: 'w-full border-b',
      bottom: 'w-full border-t',
    },
  },
  compoundVariants: [
    {
      anchor: ['left', 'right'],
      size: 'sm',
      class: 'w-1/4',
    },
    {
      anchor: ['left', 'right'],
      size: 'md',
      class: 'w-1/2',
    },
    {
      anchor: ['left', 'right'],
      size: 'lg',
      class: 'w-3/4',
    },
    {
      anchor: ['left', 'right'],
      size: 'full',
      class: 'w-full',
    },
    {
      anchor: ['top', 'bottom'],
      size: 'sm',
      class: 'h-1/4',
    },
    {
      anchor: ['top', 'bottom'],
      size: 'md',
      class: 'h-1/2',
    },
    {
      anchor: ['top', 'bottom'],
      size: 'lg',
      class: 'h-3/4',
    },
    {
      anchor: ['top', 'bottom'],
      size: 'full',
      class: 'h-full',
    },
  ],
});

const drawerCloseButtonStyle = tv({
  base: 'z-10 rounded data-[focus-visible=true]:web:bg-background-100 web:outline-0 cursor-pointer',
});

const drawerHeaderStyle = tv({
  base: 'justify-between items-center flex-row',
});

const drawerBodyStyle = tv({
  base: 'mt-4 mb-6 shrink-0',
});

const drawerFooterStyle = tv({
  base: 'flex-row justify-end items-center',
});

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
};

type DrawerBackdropProps = {
  onPress: () => void;
  className?: string;
};

type DrawerContentProps = {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
};

type DrawerHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

type DrawerBodyProps = {
  children: React.ReactNode;
  className?: string;
};

type DrawerFooterProps = {
  children: React.ReactNode;
  className?: string;
};

type DrawerCloseButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
};

const Drawer = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'sm',
  anchor = 'left',
}: DrawerProps) => {
  if (!isOpen) return null;

  return (
    <View
      // @ts-ignore
      className={drawerStyle({ size, anchor, className })}
      pointerEvents="box-none"
    >
      {children}
    </View>
  );
};

const DrawerBackdrop = ({ onPress, className }: DrawerBackdropProps) => {
  return (
    <AnimatedPressable
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(250)}
      onPress={onPress}
      className={drawerBackdropStyle({ className })}
    />
  );
};

const DrawerContent = ({
  children,
  className,
  size = 'sm',
  anchor = 'left',
}: DrawerContentProps) => {
  const getAnimation = () => {
    switch (anchor) {
      case 'left':
        return {
          entering: SlideInLeft.duration(300),
          exiting: SlideOutLeft.duration(300),
        };
      case 'right':
        return {
          entering: SlideInRight.duration(300),
          exiting: SlideOutRight.duration(300),
        };
      case 'top':
        return {
          entering: SlideInUp.duration(300),
          exiting: SlideOutUp.duration(300),
        };
      case 'bottom':
        return {
          entering: SlideInDown.duration(300),
          exiting: SlideOutDown.duration(300),
        };
    }
  };

  const animation = getAnimation();

  return (
    <AnimatedView
      entering={animation.entering}
      exiting={animation.exiting}
      // @ts-ignore
      className={drawerContentStyle({ size, anchor, className })}
      pointerEvents="auto"
    >
      {children}
    </AnimatedView>
  );
};

const DrawerHeader = ({ children, className }: DrawerHeaderProps) => {
  return <View className={drawerHeaderStyle({ className })}>{children}</View>;
};

const DrawerBody = ({ children, className }: DrawerBodyProps) => {
  return (
    <ScrollView className={drawerBodyStyle({ className })}>
      {children}
    </ScrollView>
  );
};

const DrawerFooter = ({ children, className }: DrawerFooterProps) => {
  return <View className={drawerFooterStyle({ className })}>{children}</View>;
};

const DrawerCloseButton = ({
  onPress,
  children,
  className,
}: DrawerCloseButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={drawerCloseButtonStyle({ className })}
    >
      {children}
    </Pressable>
  );
};

Drawer.displayName = 'Drawer';
DrawerBackdrop.displayName = 'DrawerBackdrop';
DrawerContent.displayName = 'DrawerContent';
DrawerHeader.displayName = 'DrawerHeader';
DrawerBody.displayName = 'DrawerBody';
DrawerFooter.displayName = 'DrawerFooter';
DrawerCloseButton.displayName = 'DrawerCloseButton';

export {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
};
