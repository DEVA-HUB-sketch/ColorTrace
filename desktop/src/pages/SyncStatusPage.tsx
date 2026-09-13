import { useMemo, useState } from 'react';
import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import type { SyncUiState, TestRecord } from '@/types/testRecord';

export default function SyncStatusPage() {
  const [syncUiState, setSyncUiState] = useState<SyncUiState>('offline');

  const queue = useMemo<TestRecord[]>(() => [], [syncUiState]);

  const pendingRecords = 0;

  const handleSyncNow = () => {
    if (syncUiState === 'syncing') {
      return;
    }

    setSyncUiState('syncing');

    window.setTimeout(() => {
      setSyncUiState('synced');
    }, 900);
  };

  const connectionLabel =
    syncUiState === 'offline'
      ? 'OFFLINE'
      : syncUiState === 'failed'
        ? 'FAILED'
        : syncUiState === 'syncing'
          ? 'SYNCING'
          : 'ONLINE';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Sync</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Sync Status</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Connection</h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Connection</span>
              <span className={`font-semibold ${syncUiState === 'offline' ? 'text-rose-700' : 'text-emerald-700'}`}>{connectionLabel}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Pending Records</span>
              <span className="font-semibold text-primaryText">{pendingRecords}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Last Successful Sync</span>
              <span className="font-semibold text-primaryText">Not available</span>
            </div>
          </div>

          <button
            onClick={handleSyncNow}
            disabled={syncUiState === 'syncing'}
            className="mt-6 w-full rounded-xl bg-primaryBlue px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncUiState === 'syncing' ? 'SYNCING...' : 'SYNC NOW'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Queue</h3>

          <div className="mt-5 space-y-3">
            {queue.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-secondaryText">
                No synchronization data is available yet.
              </div>
            ) : (
              queue.map((record) => (
                <div key={record.id} className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2 text-sm">
                  <span className="font-medium text-primaryText">{record.id}</span>
                  <IntegrityStatusBadge status={record.syncStatus} type="sync" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
