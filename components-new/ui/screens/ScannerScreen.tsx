import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Box, Text } from '@/components-new/ui/atoms';
import { useTheme } from '@/themeNew';
import { scannerPagesService } from '@/utils/services/pages/scanner-pages.service';
import  ScanOverlay  from '@/components-new/ui/organisms/scan/ScanOverlay';
import { ScanHistoryItem } from '@/types/scanhistory.types';
import { ScanResult, Product, ProductResult } from '@/utils/api/OpenFoodFactsService';
import { BarcodeRegularBoldIcon } from '@/assets/icons/figma/regular-bold/BarcodeRegularBoldIcon';
import { ScanResultWithCode } from '@/types/scanner.types';
import { CameraRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CameraRegularBoldIcon';
import { InfoCircleRegularBoldIcon } from '@/assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';
import ScanHistory from '@/components-new/ui/molecules/scan/ScanHistory';
import ScanResultCard from '@/components-new/ui/organisms/meal/ScanResultCard';

interface ScannerScreenProps {
  userId: number;
  onScanSuccess?: (item: ScanHistoryItem | null) => void;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({ userId, onScanSuccess }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // theme & styles
  // (theme already referenced above)
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [scanResult, setScanResult] = useState<ScanHistoryItem | null>(null);
  const [productResult, setProductResult] = useState<ProductResult | null>(null);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);

  // Ajout throttle scan
  const isProcessingRef = useRef(false);
  const lastBarcodeRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  const loadHistory = async () => {
    try {
      const result = await scannerPagesService.getHistory(userId);
      if (result.success && result.data?.data) {
        const formattedHistory = result.data.data.map((item: any) => ({
          id: item.id,
          barcode: item.barcode,
          name: item.name,
          scannedAt: item.scannedAt,
          userId: item.userId
        }));
        const uniqueHistory = formattedHistory.filter((item, index, self) => self.findIndex(h => h.barcode === item.barcode) === index);
      setHistory(uniqueHistory);
      } else {
        setError(result.error || 'Erreur lors de la récupération de l\'historique');
      }
    } catch (err) {
      console.error('Error loading scan history:', err);
      setError('Failed to load scan history');
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const handleClearHistory = async () => {
    try {
      const result = await scannerPagesService.clearScanHistory(userId);
      if (result.success) {
        setHistory([]);
        await loadHistory();
      } else {
        setError(result.error || 'Erreur lors de la suppression de l\'historique');
      }
    } catch (err) {
      console.error('Error clearing scan history:', err);
      setError('Failed to clear scan history');
    }
  };

  const handleScan = async (barcode: string) => {
    const now = Date.now();
    if (isProcessingRef.current) return;
    if (barcode === lastBarcodeRef.current && now - lastScanTimeRef.current < 2000) return;
    isProcessingRef.current = true;
    try {
      setScanning(true);
      const result = await scannerPagesService.scanBarcode(barcode, userId);
      if (result.isValid && result.productResult) {
        const scanResult = {
          id: Date.now(),
          barcode: (result.productResult as ProductResult & { code: string }).code,
          name: result.productResult.name,
          scannedAt: new Date().toISOString(),
          userId: userId
        } as ScanHistoryItem;
        setScanResult(scanResult);
      setProductResult(result.productResult);
      // Hide history when a new product is scanned to ensure card visibility
      setHistoryVisible(false);
        onScanSuccess?.(scanResult);
        await loadHistory();
      } else {
        setError('Scan failed');
      }
    } catch (err) {
      setError('Erreur lors du scan');
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
        <Text style={styles.title}>Scanner</Text>
        <TouchableOpacity onPress={() => setHistoryVisible(prev => !prev)}>
          <Text style={styles.toggleButton}>{historyVisible ? 'Cacher historique' : 'Voir historique'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearHistory}>
          <Text style={styles.clearButton}>Effacer l'historique</Text>
        </TouchableOpacity>
      </Box>
      <Box style={styles.content}>
        <Box style={styles.scanArea}>
          <ScanOverlay
            onScan={handleScan}
            scanning={scanning}

          />
        </Box>
        {productResult && (
          <Box style={{ padding: 16 }}>
            <ScanResultCard
              imageUrl={typeof productResult.image === 'object' && productResult.image && 'uri' in (productResult.image as any) ? (productResult.image as any).uri : ''}
              name={productResult.name}
              calories={productResult.calories}
              macros={{ carbs: productResult.carbs, protein: productResult.protein, fat: productResult.fats }}
              onAdd={() => setProductResult(null)}
            />
          </Box>
        )}
        {historyVisible && (
        <Box style={styles.history}>
          <Text style={styles.historyTitle}>Historique des scans</Text>
          <FlatList
            style={styles.historyList}
            contentContainerStyle={{ paddingBottom: 8 }}
            data={history}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }: { item: ScanHistoryItem }) => (
              <Box style={styles.historyItem}>
                <Text style={styles.historyBarcode}>{item.barcode}</Text>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyDate}>{new Date(item.scannedAt).toLocaleDateString()}</Text>
              </Box>
            )}
          />
        </Box>
        )}
      </Box>
      {error && (
        <Box style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </Box>
      )}
    </Box>
  );
};

const createStyles = (theme: any) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 8,
  },
  // Button styles
  toggleButton: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  clearButton: {
    fontSize: 16,
    color: theme.colors.error ?? '#FF3B30',
  },
  // Scanner area
  scanArea: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#000',
  },
  // History list
  history: {
    maxHeight: 250,
    flexGrow: 0,
    paddingBottom: 8,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  historyList: {
    maxHeight: 250,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  historyBarcode: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.colors.text,
    flex: 2,
    marginLeft: 8,
  },
  historyDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'right' as const,
  },
  // Error banner
  errorContainer: {
    backgroundColor: theme.colors.error ?? '#FF3B30',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center' as const,
  },

  content: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  cameraButton: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 32,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoButton: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 32,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

});

export default ScannerScreen;
