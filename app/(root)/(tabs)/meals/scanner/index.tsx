import React, { useMemo, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Box, Text } from '@/components-new/ui/atoms';
import { useTheme } from '@/themeNew';
import CameraViewScanner from '@/components-new/ui/organisms/meal/CameraView';
import { scannerPagesService } from '@/utils/services/pages/scanner-pages.service';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { useTranslation } from 'react-i18next';
// (icône inutile pour l'instant)
import { ScanHistoryItem } from '@/types/scanhistory.types';

const ScannerIndexScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const userId = useMemo(() => getCurrentUserIdSync(), []); // number | null
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // anti-rebond
  const isProcessingRef = useRef(false);
  const lastBarcodeRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const handleScan = async (barcode: string) => {
    const now = Date.now();
    if (isProcessingRef.current) return;
    if (barcode === lastBarcodeRef.current && now - lastScanTimeRef.current < 2000) return;
    isProcessingRef.current = true;
    try {
      setScanning(true);
      // on valide coté backend (optionnel) – mais on navigue quoiqu'il arrive
      if (userId === null) {
        setError(t('meal.scanner.error'));
      } else {
        await scannerPagesService.scanBarcode(barcode, userId);
      }
      router.push({ pathname: '/meals/scanner/product/[code]', params: { code: barcode } });
    } catch (e) {
      setError(t('meal.scanner.scanError'));
    } finally {
      setScanning(false);
      isProcessingRef.current = false;
      lastBarcodeRef.current = barcode;
      lastScanTimeRef.current = Date.now();
    }
  };

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CloseSquareRegularBoldIcon width={28} height={28} color='#A4C73B' />
        </TouchableOpacity>
        <Text style={styles.title}>{t('meal.scanner.title')}</Text>
      </Box>
      <Box style={styles.cameraContainer}>
        <CameraViewScanner
          onBarCodeScanned={(result: any) => {
            if (result?.data) handleScan(result.data);
          }}
        />
      </Box>
      {error && (
        <Box style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </Box>
      )}
    </Box>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 22, backgroundColor: theme.colors.surface, flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '600', color: theme.colors.text, marginLeft: 30, padding: 10 },
    cameraContainer: { flex: 1 },
    errorContainer: { backgroundColor: theme.colors.error, padding: 12, margin: 16, borderRadius: 8 },
    errorText: { color: '#fff', textAlign: 'center' },
  });

export default ScannerIndexScreen;
