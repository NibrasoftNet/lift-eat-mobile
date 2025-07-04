import { ScanResult, ProductResult } from '@/utils/api/OpenFoodFactsService';
import { ScanHistoryItem } from '@/types/scanhistory.types';

// Type intermédiaire pour le résultat du scan avec le code-barres
export interface ScanResultWithCode extends ScanResult {
  productResult: ProductResult & { code: string } | null;
}

// Type pour le composant ScannerScreen
export interface ScannerScreenProps {
  userId: number;
  onScanSuccess?: (item: ScanHistoryItem | null) => void;
}
