import type { BlockchainStatus, IntegrityStatus, SyncStatus } from '@/types/testRecord';
import { getBlockchainClasses, getIntegrityClasses, getSyncClasses } from '@/utils/recordUtils';

export type IntegrityStatusBadgeProps = {
  status: IntegrityStatus | BlockchainStatus | SyncStatus;
  type?: 'integrity' | 'blockchain' | 'sync';
};

export default function IntegrityStatusBadge({ status, type = 'integrity' }: IntegrityStatusBadgeProps) {
  const classes =
    type === 'blockchain'
      ? getBlockchainClasses(status as BlockchainStatus)
      : type === 'sync'
        ? getSyncClasses(status as SyncStatus)
        : getIntegrityClasses(status as IntegrityStatus);

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}
