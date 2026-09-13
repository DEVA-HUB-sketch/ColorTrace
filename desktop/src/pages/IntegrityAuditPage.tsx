import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';

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

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-secondaryText">
          No integrity audit records are currently available. The backend audit chain has not supplied any verifiable records yet.
        </div>
      </div>
    </div>
  );
}
