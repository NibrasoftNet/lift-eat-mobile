import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Easing, Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/themeNew';
import { useTranslation } from 'react-i18next';
import Box from '@/components-new/ui/atoms/base/Box';
import { BarcodeRegularBoldIcon } from '@/assets/icons/figma/regular-bold/BarcodeRegularBoldIcon';
import { CameraRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CameraRegularBoldIcon';
import { InfoCircleRegularBoldIcon } from '@/assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';

interface ScanOverlayProps {
  onScan: (barcode: string) => void;
  scanning: boolean;
  detected?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Frame dimensions based on Figma (~278×184) but responsive to screen width
const FRAME_WIDTH = SCREEN_WIDTH * 0.8;
const FRAME_HEIGHT = FRAME_WIDTH * 0.66; // preserve aspect ratio
const FRAME_BORDER_RADIUS = 15;
const LINE_HEIGHT = 2;
const BORDER_WIDTH = 3;

const ScanOverlay: React.FC<ScanOverlayProps> = ({ onScan, scanning, detected = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Start / stop line animation
  useEffect(() => {
    if (detected) {
      scanAnim.stopAnimation();
      return;
    }

    scanAnim.setValue(-FRAME_HEIGHT * 0.5); // Commence 50% plus haut
    const loopAnim = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: FRAME_HEIGHT * 0.5 - LINE_HEIGHT, // Termine à 50% de la hauteur
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
    <Box style={styles.container}>
      <Animated.View style={[styles.scanFrame, { borderColor: '#A4C73B' }]}>
        <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAnim }] }]} />
        <Animated.View style={[styles.scanLine, { backgroundColor: '#A4C73B' }]} />
        <Animated.View style={[styles.scanLine, { backgroundColor: '#A4C73B' }]} />
        <Animated.View style={[styles.scanLine, { backgroundColor: '#A4C73B' }]} />
        <Animated.View style={[styles.scanLine, { backgroundColor: '#A4C73B' }]} />
      </Animated.View>
      


      <Box style={styles.scanTextContainer}>
        <Box style={styles.scanText}>
          <Text style={styles.scanTextContent}>{t('scanner.overlayInstruction')}</Text>
        </Box>
      </Box>


    </Box>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: BORDER_WIDTH,
    borderRadius: FRAME_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    height: LINE_HEIGHT,
    position: 'absolute',
    width: FRAME_WIDTH - BORDER_WIDTH * 3,
    backgroundColor: '#A4C73B',
    opacity: 0.8,
    left: BORDER_WIDTH,

  },
  scanTextContainer: {
    position: 'absolute',
    bottom: FRAME_HEIGHT * 0.1,
    width: '100%',
  },
  scanText: {
    backgroundColor: '#A4C73B',
    padding: 12,
    borderRadius: 8,
    opacity: 0.6,
  },
  scanTextContent: {
    color: theme.colors.textInverse,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },

});

export default ScanOverlay;
