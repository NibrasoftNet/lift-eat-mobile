import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import type { FlashMode } from 'expo-camera';
import { useTheme } from '@/themeNew';
import Box from '@/components-new/ui/atoms/base/Box';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { FlashRegularBoldIcon } from '@/assets/icons/figma/regular-bold/FlashRegularBoldIcon';
import { TimeSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TimeSquareRegularBoldIcon';
import { router } from 'expo-router';
import ScanOverlay from '../scan/ScanOverlay';

interface CameraViewProps {
  onBarCodeScanned: (result: BarcodeScanningResult) => void;
}

const CameraViewScanner: React.FC<CameraViewProps> = ({ onBarCodeScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');

  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        fab: {
          position: 'absolute',
          bottom: theme.space('10xl') ?? 40,
          right: theme.space('lg') ?? 20,
          backgroundColor: '#A4C73B',
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          opacity: 0.6,
        },
        flashButton: {
          position: 'absolute',
          top: theme.space('xl') ?? 40,
          right: theme.space('lg') ?? 20,
          backgroundColor: 'transparent',
        },
      }),
    [theme],
  );

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return null;
  }

  const toggleFlash = () => {
    const nextFlash: FlashMode = flash === 'off' ? 'on' : 'off';
    setFlash(nextFlash);
  };

  return (
    <Box style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={onBarCodeScanned}
        flash={flash}
      />
      {/* Overlay */}
      <ScanOverlay onScan={() => {}} scanning={false} />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/meals/scanner/history')}>
        <TimeSquareRegularBoldIcon width={24} height={24} color='#FFFFFF' />
      </TouchableOpacity>
      <Box style={styles.flashButton}>
        <TouchableOpacity onPress={toggleFlash}>
          <FlashRegularBoldIcon width={28} height={28} color='#A4C73B' />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default CameraViewScanner;
