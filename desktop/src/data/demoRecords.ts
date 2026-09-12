import type { TestRecord, DashboardSummary } from '@/types/testRecord';

export const demoRecords: TestRecord[] = [
  {
    id: 'CT-001',
    result: 'POSITIVE',
    configuration: 'Reference configuration',
    timestamp: '2026-09-12 09:42',
    operator: 'Officer 01',
    location: 'Sector A',
    integrityStatus: 'VERIFIED',
    blockchainStatus: 'PENDING',
    syncStatus: 'SYNCED',
    device: 'LT-400',
    imageLabel: 'REFERENCE-CARD-01',
    calibrationStatus: 'READY',
    referenceConfiguration: 'Reference configuration',
  },
  {
    id: 'CT-002',
    result: 'NEGATIVE',
    configuration: 'Reference configuration',
    timestamp: '2026-09-12 08:31',
    operator: 'Officer 01',
    location: 'Sector B',
    integrityStatus: 'VERIFIED',
    blockchainStatus: 'VERIFIED',
    syncStatus: 'SYNCED',
    device: 'LT-400',
    imageLabel: 'REFERENCE-CARD-02',
    calibrationStatus: 'READY',
    referenceConfiguration: 'Reference configuration',
  },
  {
    id: 'CT-003',
    result: 'INCONCLUSIVE',
    configuration: 'Reference configuration',
    timestamp: '2026-09-12 07:18',
    operator: 'Officer 02',
    location: 'Sector C',
    integrityStatus: 'PENDING',
    blockchainStatus: 'PENDING',
    syncStatus: 'OFFLINE',
    device: 'LT-400',
    imageLabel: 'REFERENCE-CARD-03',
    calibrationStatus: 'PENDING',
    referenceConfiguration: 'Reference configuration',
  },
  {
    id: 'CT-004',
    result: 'POSITIVE',
    configuration: 'Reference configuration',
    timestamp: '2026-09-12 06:10',
    operator: 'Officer 03',
    location: 'Sector D',
    integrityStatus: 'FAILED',
    blockchainStatus: 'UNAVAILABLE',
    syncStatus: 'RETRY',
    device: 'LT-400',
    imageLabel: 'REFERENCE-CARD-04',
    calibrationStatus: 'FAILED',
    referenceConfiguration: 'Reference configuration',
  },
];

export const demoSummary: DashboardSummary = {
  totalTests: demoRecords.length,
  positive: demoRecords.filter((record) => record.result === 'POSITIVE').length,
  negative: demoRecords.filter((record) => record.result === 'NEGATIVE').length,
  inconclusive: demoRecords.filter((record) => record.result === 'INCONCLUSIVE').length,
  pendingSync: demoRecords.filter((record) => record.syncStatus === 'PENDING' || record.syncStatus === 'OFFLINE' || record.syncStatus === 'RETRY').length,
  blockchainPending: demoRecords.filter((record) => record.blockchainStatus === 'PENDING' || record.blockchainStatus === 'UNAVAILABLE').length,
};

export function getFilteredDemoRecords(filters?: {
  search?: string;
  result?: string;
  integrity?: string;
  blockchain?: string;
  sync?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const normalizedSearch = (filters?.search ?? '').toLowerCase().trim();

  return demoRecords.filter((record) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      record.id.toLowerCase().includes(normalizedSearch) ||
      record.operator.toLowerCase().includes(normalizedSearch) ||
      record.location.toLowerCase().includes(normalizedSearch);

    const matchesResult = !filters?.result || filters.result === 'all' || record.result === filters.result;
    const matchesIntegrity = !filters?.integrity || filters.integrity === 'all' || record.integrityStatus === filters.integrity;
    const matchesBlockchain = !filters?.blockchain || filters.blockchain === 'all' || record.blockchainStatus === filters.blockchain;
    const matchesSync = !filters?.sync || filters.sync === 'all' || record.syncStatus === filters.sync;

    const recordDate = record.timestamp.slice(0, 10);
    const matchesDateFrom = !filters?.dateFrom || recordDate >= filters.dateFrom;
    const matchesDateTo = !filters?.dateTo || recordDate <= filters.dateTo;

    return matchesSearch && matchesResult && matchesIntegrity && matchesBlockchain && matchesSync && matchesDateFrom && matchesDateTo;
  });
}
