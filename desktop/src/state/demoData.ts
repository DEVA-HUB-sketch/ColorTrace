import type { DashboardScenario, DashboardViewState, TestRecord } from '@/types/testRecord';

export type DemoStateConfig = {
  scenario: DashboardScenario;
};

const emptySummary = {
  totalTests: 0,
  positive: 0,
  negative: 0,
  inconclusive: 0,
  pendingSync: 0,
  blockchainPending: 0,
};

export const defaultDashboardState: DashboardViewState = {
  scenario: 'empty',
  records: [],
  summary: emptySummary,
};

export function getDashboardViewState(config?: DemoStateConfig): DashboardViewState {
  const scenario = config?.scenario ?? 'empty';

  if (scenario === 'error') {
    return {
      scenario,
      records: [],
      summary: emptySummary,
      errorMessage: 'Unable to load dashboard data because no backend data source is connected yet.',
    };
  }

  return {
    scenario,
    records: [],
    summary: emptySummary,
  };
}

export function getRecordById(_recordId: string): TestRecord | undefined {
  return undefined;
}

export function getDemoRecordsForTable(_filters?: {
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
