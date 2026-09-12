import { demoRecords, demoSummary, getFilteredDemoRecords } from '@/data/demoRecords';
import type { DashboardScenario, DashboardViewState, TestRecord } from '@/types/testRecord';

export type DemoStateConfig = {
  scenario: DashboardScenario;
};

export const defaultDashboardState: DashboardViewState = {
  scenario: 'normal',
  records: demoRecords,
  summary: demoSummary,
};

export function getDashboardViewState(config?: DemoStateConfig): DashboardViewState {
  const scenario = config?.scenario ?? 'normal';

  if (scenario === 'empty') {
    return {
      scenario,
      records: [],
      summary: {
        totalTests: 0,
        positive: 0,
        negative: 0,
        inconclusive: 0,
        pendingSync: 0,
        blockchainPending: 0,
      },
    };
  }

  if (scenario === 'error') {
    return {
      scenario,
      records: [],
      summary: {
        totalTests: 0,
        positive: 0,
        negative: 0,
        inconclusive: 0,
        pendingSync: 0,
        blockchainPending: 0,
      },
      errorMessage: 'Unable to load dashboard data from the current reference dataset.',
    };
  }

  return {
    scenario,
    records: demoRecords,
    summary: demoSummary,
  };
}

export function getRecordById(recordId: string): TestRecord | undefined {
  return demoRecords.find((record) => record.id === recordId);
}

export function getDemoRecordsForTable(filters?: {
  search?: string;
  result?: string;
  integrity?: string;
  blockchain?: string;
  sync?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return getFilteredDemoRecords(filters);
}
