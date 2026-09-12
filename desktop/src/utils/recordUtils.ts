import type { TestRecord } from '@/types/testRecord';

export function getResultClasses(result: TestRecord['result']) {
  switch (result) {
    case 'POSITIVE':
      return 'bg-emerald-100 text-emerald-700';
    case 'NEGATIVE':
      return 'bg-sky-100 text-sky-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

export function getIntegrityClasses(status: TestRecord['integrityStatus']) {
  switch (status) {
    case 'VERIFIED':
      return 'bg-emerald-100 text-emerald-700';
    case 'PENDING':
      return 'bg-amber-100 text-amber-700';
    case 'FAILED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export function getBlockchainClasses(status: TestRecord['blockchainStatus']) {
  switch (status) {
    case 'VERIFIED':
      return 'bg-emerald-100 text-emerald-700';
    case 'PENDING':
      return 'bg-violet-100 text-violet-700';
    case 'FAILED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export function getSyncClasses(status: TestRecord['syncStatus']) {
  switch (status) {
    case 'SYNCED':
      return 'bg-emerald-100 text-emerald-700';
    case 'PENDING':
      return 'bg-amber-100 text-amber-700';
    case 'SYNCING':
      return 'bg-blue-100 text-blue-700';
    case 'RETRY':
      return 'bg-orange-100 text-orange-700';
    case 'FAILED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}
