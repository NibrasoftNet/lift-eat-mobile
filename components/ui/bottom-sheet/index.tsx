import React, { useEffect, useContext } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { tv } from 'tailwind-variants';
import { cn } from '@/utils/nativewind-utils/cn';
import { UIContext } from '@/utils/providers/UiProvider';

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

const BottomSheet = ({
  open,
  setOpen,
  height,
  children,
  onClose,
  className,
  overlayClassName,
  handleClassName,
}: any) => {
  const ui = useContext(UIContext);
  const screenHeight = ui?.screenHeight ?? 800;

  const heightMap = {
    xs: screenHeight * 0.16,
    sm: screenHeight * 0.25,
    md: screenHeight * 0.5,
    lg: screenHeight * 0.75,
    xl: screenHeight * 0.83,
    full: screenHeight,
  };
  // @ts-ignore
  const sheetHeight = heightMap[height];
  const translateY = useSharedValue(sheetHeight);

  useEffect(() => {
    if (open) {
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      translateY.value = sheetHeight;
    }
  }, [open, sheetHeight]);

  const handleClose = () => {
    translateY.value = withTiming(sheetHeight, {}, () => {
      runOnJS(setOpen)(false);
      onClose?.();
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > sheetHeight * 0.4) {
        translateY.value = withTiming(sheetHeight, {}, () => {
          runOnJS(setOpen)(false);
          runOnJS(onClose)?.();
        });
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(open ? 0.5 : 0, { duration: 300 }),
  }));

  return (
    <Modal visible={open} transparent animationType="none">
      <Animated.View
        style={[StyleSheet.absoluteFillObject, overlayStyle]}
        className={cn('bg-black', overlayClassName)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.container,
            { height: sheetHeight, bottom: -1 },
            animatedStyle,
          ]}
          className={cn(bottomSheet({ height }), className)}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClose}
            className="w-full items-center pb-2"
          >
            <View
              className={cn(
                'w-12 h-1 bg-gray-300 rounded-full mb-2',
                handleClassName,
              )}
            />
          </TouchableOpacity>
          {children}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default BottomSheet;
