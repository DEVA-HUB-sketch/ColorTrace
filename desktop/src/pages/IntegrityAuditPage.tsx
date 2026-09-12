import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import { demoRecords } from '@/data/demoRecords';

export default function IntegrityAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Audit</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Integrity Audit</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-primaryText">Record Chain</h3>
        </div>

        <div className="space-y-4">
          {demoRecords.map((record) => (
            <div key={record.id} className="rounded-xl border border-slate-200 bg-offWhite p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold text-primaryText">{record.id}</div>
                <IntegrityStatusBadge status={record.integrityStatus} type="integrity" />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
                <div>
                  <span className="text-secondaryText">Record Hash</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
                <div>
                  <span className="text-secondaryText">Previous Record Hash</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
                <div>
                  <span className="text-secondaryText">Digital Signature</span>
                  <div className="mt-1 font-medium text-primaryText">UNAVAILABLE</div>
                </div>
                <div>
                  <span className="text-secondaryText">Blockchain Status</span>
                  <div className="mt-1">
                    <IntegrityStatusBadge status={record.blockchainStatus} type="blockchain" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
