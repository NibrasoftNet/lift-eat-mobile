export interface ScanHistoryItem {
  id: number;
  barcode: string;
  name: string;
  scannedAt: string;
  userId: number;
}

export interface ScanHistoryProps {
  userId: number;
  onSelect?: (item: ScanHistoryItem) => void;
  onClear?: () => void;
}
