import { BasicResult } from './plan-interfaces';

export interface AddScanHistoryParams {
  barcode: string;
  name: string;
  userId: number;
}

export interface AddScanHistoryResult extends BasicResult {
  id?: number;
}

export interface GetScanHistoryParams {
  limit?: number;
  userId: number;
}

export interface GetScanHistoryResult extends BasicResult {
  data?: Array<{
    id: number;
    barcode: string;
    name: string;
    scannedAt: string;
    userId: number;
  }>;
}

export type ClearScanHistoryResult = BasicResult;
