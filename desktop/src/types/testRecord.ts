import type { LocationData } from '@/types/newTestWorkflow';

export type Result = 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE';
export type IntegrityStatus = 'VERIFIED' | 'PENDING' | 'FAILED' | 'UNAVAILABLE';
export type BlockchainStatus = 'VERIFIED' | 'PENDING' | 'FAILED' | 'UNAVAILABLE';
export type SyncStatus = 'SYNCED' | 'PENDING' | 'SYNCING' | 'RETRY' | 'FAILED' | 'OFFLINE';
export type DashboardScenario = 'normal' | 'empty' | 'error';
export type VerificationState = 'idle' | 'loading' | 'verified' | 'pending' | 'failed' | 'unavailable';
export type SyncUiState = 'synced' | 'pending' | 'syncing' | 'retry' | 'failed' | 'offline';

export type TestRecord = {
  id: string;
  result: Result;
  configuration: string;
  timestamp: string;
  operator: string;
  location: string;
  locationData?: LocationData | null;
  integrityStatus: IntegrityStatus;
  blockchainStatus: BlockchainStatus;
  syncStatus: SyncStatus;
  device: string;
  imageLabel: string;
  calibrationStatus?: string;
  referenceConfiguration?: string;
};

export type DashboardSummary = {
  totalTests: number;
  positive: number;
  negative: number;
  inconclusive: number;
  pendingSync: number;
  blockchainPending: number;
};

export type DashboardViewState = {
  scenario: DashboardScenario;
  records: TestRecord[];
  summary: DashboardSummary;
  errorMessage?: string;
};
