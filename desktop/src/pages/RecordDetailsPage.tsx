import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecordDetailsPanel from '@/components/RecordDetailsPanel';
import { getRecordById } from '@/state/demoData';

export default function RecordDetailsPage() {
  const { recordId } = useParams();
  const navigate = useNavigate();

  const record = useMemo(() => {
    if (!recordId) {
      return undefined;
    }

    return getRecordById(recordId.toUpperCase());
  }, [recordId]);

  if (!record) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-secondaryText shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-primaryText">Record not found</h2>
              <p className="mt-2 text-sm text-secondaryText">The selected record ID is not present in the current local dataset.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/records')}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-primaryText"
            >
              Back to records
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecordDetailsPanel record={record} />
    </div>
  );
}
