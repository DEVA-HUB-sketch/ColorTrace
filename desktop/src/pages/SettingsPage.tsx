import { actualBackendEndpoints, apiBaseUrl, backendContract } from '@/services/api';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">System</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Settings</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Account</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Application Version</span><span className="font-semibold text-primaryText">0.1.0</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Backend Connection</span><span className="font-semibold text-primaryText">{apiBaseUrl}</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Health Endpoint</span><span className="font-semibold text-primaryText">{`${apiBaseUrl}${backendContract.health.path}`}</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Current Data Source</span><span className="font-semibold text-primaryText">Local frontend dataset</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Reference Configuration Version</span><span className="font-semibold text-primaryText">v1.0.0</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Security & Integrity</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Blockchain Service Status</span><span className="font-semibold text-primaryText">Not connected</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Offline Storage</span><span className="font-semibold text-primaryText">Enabled</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Integrity Checking</span><span className="font-semibold text-primaryText">Enabled</span></div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2"><span className="text-secondaryText">Secrets Exposure</span><span className="font-semibold text-primaryText">Not exposed</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-primaryText">Backend Contract Status</h3>
        <div className="mt-4 rounded-xl border border-slate-200 bg-offWhite p-4 text-sm text-secondaryText">
          <div className="font-medium text-primaryText">Actual backend endpoints discovered</div>
          <div className="mt-2">{actualBackendEndpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`).join(', ')}</div>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          {Object.entries(backendContract).map(([key, endpoint]) => (
            <div key={key} className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">{key}</span>
              <span className={`font-semibold ${endpoint.available ? 'text-emerald-700' : 'text-slate-600'}`}>
                {endpoint.available ? `${endpoint.method} ${endpoint.path}` : 'UNAVAILABLE'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
