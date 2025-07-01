import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Easing, View } from 'react-native';
import { useTheme } from '@/themeNew';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Frame dimensions based on Figma (~278×184) but responsive to screen width
const FRAME_WIDTH = SCREEN_WIDTH * 0.8;
const FRAME_HEIGHT = FRAME_WIDTH * 0.66; // preserve aspect ratio
const FRAME_BORDER_RADIUS = 12;
const BORDER_WIDTH = 3;

interface ScanFrameProps {
  detected?: boolean;
  borderColor?: string;
}

const ScanFrame: React.FC<ScanFrameProps> = ({ detected = false, borderColor = '#FFFFFF' }) => {
  const theme = useTheme();
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Start / stop line animation
  useEffect(() => {
    if (detected) {
      scanAnim.stopAnimation();
      return;
    }

    scanAnim.setValue(0);
    const loopAnim = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: FRAME_HEIGHT - 2, // minus line height
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loopAnim.start();

    return () => {
      loopAnim.stop();
    };
  }, [detected]);

  return (
    <Animated.View 
      style={[
        styles.frame,
        { borderColor },
        detected ? styles.detectedFrame : styles.defaultFrame
      ]}
    >
      {/* Animated scanning line */}
      <Animated.View
        style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]}
      />
      <View style={styles.scanLine} />
      <View style={styles.scanLine} />
      <View style={styles.scanLine} />
      <View style={styles.scanLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: BORDER_WIDTH,
    borderRadius: FRAME_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultFrame: {
    backgroundColor: 'transparent',
  },
  detectedFrame: {
    backgroundColor: 'rgba(161, 206, 80, 0.2)',
  },
  scanLine: {
    position: 'absolute',
    width: FRAME_WIDTH - BORDER_WIDTH * 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
    left: BORDER_WIDTH,
  },
});

export default ScanFrame;
