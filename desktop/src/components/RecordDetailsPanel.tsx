import type { TestRecord } from '@/types/testRecord';
import { getBlockchainClasses, getIntegrityClasses, getResultClasses, getSyncClasses } from '@/utils/recordUtils';

export type RecordDetailsPanelProps = {
  record: TestRecord;
};

const displayValue = (value?: string) => value?.trim() || 'UNAVAILABLE';

export default function RecordDetailsPanel({ record }: RecordDetailsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Record</p>
            <h2 className="mt-1 text-3xl font-semibold text-primaryText">{record.id}</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getResultClasses(record.result)}`}>
            {record.result}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Timestamp</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.timestamp)}</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Location</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.location)}</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Operator</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.operator)}</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Device</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.device)}</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Configuration</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.configuration)}</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Image</div>
            <div className="mt-2 font-medium text-primaryText">{displayValue(record.imageLabel)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Measurement</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Result</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${getResultClasses(record.result)}`}>{record.result}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Calibration</span>
              <span className="font-medium text-primaryText">{displayValue(record.calibrationStatus)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Reference Configuration</span>
              <span className="font-medium text-primaryText">{displayValue(record.referenceConfiguration)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Integrity</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Integrity Status</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${getIntegrityClasses(record.integrityStatus)}`}>{record.integrityStatus}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Blockchain Status</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${getBlockchainClasses(record.blockchainStatus)}`}>{record.blockchainStatus}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Sync Status</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${getSyncClasses(record.syncStatus)}`}>{record.syncStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-primaryText">Evidence & Provenance</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Record Hash</div>
            <div className="mt-2 font-medium text-primaryText">UNAVAILABLE</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Previous Record Hash</div>
            <div className="mt-2 font-medium text-primaryText">UNAVAILABLE</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Digital Signature</div>
            <div className="mt-2 font-medium text-primaryText">UNAVAILABLE</div>
          </div>
          <div className="rounded-xl bg-offWhite p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-secondaryText">Provenance</div>
            <div className="mt-2 font-medium text-primaryText">UNAVAILABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
