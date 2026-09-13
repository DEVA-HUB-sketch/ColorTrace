import type { DashboardSummary, TestRecord } from '@/types/testRecord';

export const demoRecords: TestRecord[] = [];

export const demoSummary: DashboardSummary = {
  totalTests: 0,
  positive: 0,
  negative: 0,
  inconclusive: 0,
  pendingSync: 0,
  blockchainPending: 0,
};

export function getFilteredDemoRecords(_filters?: {
  search?: string;
  result?: string;
  integrity?: string;
  blockchain?: string;
  sync?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return [] as TestRecord[];
}
