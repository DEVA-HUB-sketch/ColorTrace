import { useState } from 'react';
import IntegrityStatusBadge from '@/components/IntegrityStatusBadge';
import type { TestRecord, VerificationState } from '@/types/testRecord';

export default function BlockchainVerificationPage() {
  const [recordId, setRecordId] = useState('');
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);
  const [message, setMessage] = useState('Enter a record ID to inspect the current verification state.');

  const handleVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedId = recordId.trim().toUpperCase();

    if (!trimmedId) {
      setVerificationState('failed');
      setSelectedRecord(null);
      setMessage('Please enter a record ID before running a verification check.');
      return;
    }

    setVerificationState('loading');
    setMessage('Checking the current local dataset...');

    window.setTimeout(() => {
      setVerificationState('unavailable');
      setSelectedRecord(null);
      setMessage('No matching record is available in the current frontend dataset. Blockchain provenance is not connected to a real backend API yet.');
    }, 500);
  };

  const resultStateStyles =
    verificationState === 'verified'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : verificationState === 'pending'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : verificationState === 'failed'
          ? 'border-rose-200 bg-rose-50 text-rose-800'
          : verificationState === 'unavailable'
            ? 'border-slate-200 bg-slate-100 text-slate-700'
            : 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Verification</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Blockchain Verification</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Verify Record Provenance</h3>

          <form onSubmit={handleVerify} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-primaryText">Record ID</label>
              <input
                value={recordId}
                onChange={(event) => setRecordId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20"
                placeholder="Enter Record ID"
              />
            </div>

            <button
              type="submit"
              disabled={verificationState === 'loading'}
              className="rounded-xl bg-primaryBlue px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verificationState === 'loading' ? 'VERIFYING...' : 'VERIFY RECORD'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Verification Result</h3>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span>Record structure</span>
              <span className="font-semibold text-success">✓</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span>Image reference</span>
              <span className="font-semibold text-success">✓</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span>Integrity status</span>
              <span className="font-semibold text-success">✓</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span>Current blockchain status</span>
              <span className="font-semibold text-success">✓</span>
            </div>
          </div>

          <div className={`mt-6 rounded-xl border p-4 text-sm ${resultStateStyles}`}>
            <div className="font-semibold uppercase">
              {verificationState === 'idle' && 'IDLE'}
              {verificationState === 'loading' && 'CHECKING'}
              {verificationState === 'verified' && 'RECORD PROVENANCE VERIFIED'}
              {verificationState === 'pending' && 'RECORD PROVENANCE PENDING'}
              {verificationState === 'failed' && 'RECORD PROVENANCE FAILED'}
              {verificationState === 'unavailable' && 'RECORD PROVENANCE UNAVAILABLE'}
            </div>
            <div className="mt-2">{message}</div>
            {selectedRecord && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Selected record</span>
                  <span className="font-medium text-primaryText">{selectedRecord.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Integrity</span>
                  <IntegrityStatusBadge status={selectedRecord.integrityStatus} type="integrity" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Blockchain</span>
                  <IntegrityStatusBadge status={selectedRecord.blockchainStatus} type="blockchain" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondaryText">Sync</span>
                  <IntegrityStatusBadge status={selectedRecord.syncStatus} type="sync" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
