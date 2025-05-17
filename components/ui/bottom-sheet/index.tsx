import React, { useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type SheetHeight = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface CustomBottomSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  height: SheetHeight;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  overlayClassName?: string;
  handleClassName?: string;
}

const bottomSheet = tv({
  base: 'bg-white rounded-t-3xl shadow-lg pt-5 px-4',
  variants: {
    height: {
      xs: 'h-1/6',
      sm: 'h-1/4',
      md: 'h-1/2',
      lg: 'h-3/4',
      xl: 'h-5/6',
      full: 'h-full rounded-none',
    },
  },
  defaultVariants: {
    height: 'md',
  },
});

const BottomSheet: React.FC<CustomBottomSheetProps> = ({
  open,
  setOpen,
  height,
  children,
  onClose,
  className,
  overlayClassName,
  handleClassName,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const active = useSharedValue(false);

  const heightPercentages = {
    xs: SCREEN_HEIGHT * 0.16,
    sm: SCREEN_HEIGHT * 0.25,
    md: SCREEN_HEIGHT * 0.5,
    lg: SCREEN_HEIGHT * 0.75,
    xl: SCREEN_HEIGHT * 0.83,
    full: SCREEN_HEIGHT,
  };

  const sheetHeight = heightPercentages[height];

  useEffect(() => {
    if (open) {
      active.value = true;
      translateY.value = sheetHeight;
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      translateY.value = withTiming(sheetHeight, { duration: 300 }, () => {
        runOnJS(setActive)(false);
      });
    }
  }, [open, sheetHeight]);

  const setActive = (isActive: boolean) => {
    active.value = isActive;
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 0.5 : 0, { duration: 300 }),
      display: active.value ? 'flex' : 'none',
    };
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        className={cn('bg-black', overlayClassName)}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        style={[styles.container, { height: sheetHeight }, animatedStyle]}
        className={cn(bottomSheet({ height }), className)}
      >
        <View
          className={cn(
            'w-12 h-1 bg-gray-300 rounded-full self-center mb-4',
            handleClassName,
          )}
        />
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    height: SCREEN_HEIGHT,
    zIndex: 9,
  },
  backdropTouchable: {
    height: SCREEN_HEIGHT,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    zIndex: 10,
  },
});

export default BottomSheet;
