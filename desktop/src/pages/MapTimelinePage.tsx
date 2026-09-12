import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import { demoRecords } from '@/data/demoRecords';
import { getResultClasses } from '@/utils/recordUtils';

const orderedRecords = [...demoRecords].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

export default function MapTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Geography</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Map & Timeline</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-primaryText">Record locations</h3>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-secondaryText">MapLibre ready</div>
          </div>
          <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-secondaryText">
            <div className="text-lg font-semibold text-primaryText">No live location data available</div>
            <p className="mt-2 max-w-md text-sm">
              This desktop frontend does not currently receive GPS coordinates or map tiles from the backend. Location data is unavailable for this view.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Timeline</h3>
          <div className="mt-5 space-y-4">
            {orderedRecords.map((record) => (
              <div key={record.id} className="rounded-xl border border-slate-200 bg-offWhite p-3">
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-secondaryText">
                  <span>{record.timestamp.slice(0, 10)}</span>
                  <span>{record.timestamp.slice(11)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold text-primaryText">{record.id}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getResultClasses(record.result)}`}>{record.result}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-secondaryText">
                  <span>Operator: {record.operator}</span>
                  <span>•</span>
                  <span>Location: {record.location}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <IntegrityStatusBadge status={record.integrityStatus} type="integrity" />
                  <IntegrityStatusBadge status={record.blockchainStatus} type="blockchain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
