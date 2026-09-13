import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CircleDashed, Plus, ShieldCheck, TimerReset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardViewState } from '@/state/demoData';
import type { DashboardScenario, DashboardViewState } from '@/types/testRecord';
import { getBlockchainClasses, getIntegrityClasses, getResultClasses, getSyncClasses } from '@/utils/recordUtils';

const dashboardScenario = (import.meta.env.VITE_DEMO_DASHBOARD_SCENARIO as DashboardScenario | undefined) ?? 'normal';

const baseCards = [
  { label: 'Total Tests', accent: 'bg-primaryBlue/10 text-primaryBlue' },
  { label: 'Positive', accent: 'bg-emerald-100 text-emerald-700' },
  { label: 'Negative', accent: 'bg-sky-100 text-sky-700' },
  { label: 'Inconclusive', accent: 'bg-amber-100 text-amber-700' },
  { label: 'Pending Sync', accent: 'bg-violet-100 text-violet-700' },
  { label: 'Blockchain Pending', accent: 'bg-indigo-100 text-indigo-700' },
] as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<DashboardViewState>(() => getDashboardViewState({ scenario: dashboardScenario }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewState(getDashboardViewState({ scenario: dashboardScenario }));
      setIsLoading(false);
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const cards = useMemo(
    () => [
      { ...baseCards[0], value: viewState.summary.totalTests },
      { ...baseCards[1], value: viewState.summary.positive },
      { ...baseCards[2], value: viewState.summary.negative },
      { ...baseCards[3], value: viewState.summary.inconclusive },
      { ...baseCards[4], value: viewState.summary.pendingSync },
      { ...baseCards[5], value: viewState.summary.blockchainPending },
    ],
    [viewState.summary]
  );

  const recentRecords = viewState.records.slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-secondaryText shadow-soft">Loading dashboard data...</div>
      </div>
    );
  }

  if (viewState.errorMessage) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-soft">
          {viewState.errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Overview</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Good morning, Officer</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${card.accent}`}>
              {card.label}
            </div>
            <div className="mt-6 flex items-end justify-between">
              <span className="text-3xl font-semibold text-primaryText">{card.value}</span>
              <ArrowUpRight className="h-5 w-5 text-secondaryText" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-xl font-semibold text-primaryText">Recent Tests</h3>
          <div className="flex gap-2 text-xs font-medium text-secondaryText">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Integrity
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <CircleDashed className="h-3.5 w-3.5 text-blockchainAccent" /> Blockchain
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <TimerReset className="h-3.5 w-3.5 text-warning" /> Sync
            </span>
          </div>
        </div>

        {recentRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div>
              <h4 className="text-xl font-semibold text-primaryText">No test records available</h4>
              <p className="mt-2 max-w-md text-sm text-secondaryText">
                Completed field tests will appear here once records are available.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/new-test')}
              className="inline-flex items-center gap-2 rounded-xl bg-primaryBlue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              Start New Test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-offWhite text-sm text-secondaryText">
                <tr>
                  <th className="px-5 py-3 font-medium">Record ID</th>
                  <th className="px-5 py-3 font-medium">Result</th>
                  <th className="px-5 py-3 font-medium">Configuration</th>
                  <th className="px-5 py-3 font-medium">Date/Time</th>
                  <th className="px-5 py-3 font-medium">Operator</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Integrity</th>
                  <th className="px-5 py-3 font-medium">Blockchain</th>
                  <th className="px-5 py-3 font-medium">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {recentRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-primaryText">{row.id}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getResultClasses(row.result)}`}>
                        {row.result}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-secondaryText">{row.configuration}</td>
                    <td className="px-5 py-3 text-secondaryText">{row.timestamp}</td>
                    <td className="px-5 py-3 text-secondaryText">{row.operator}</td>
                    <td className="px-5 py-3 text-secondaryText">{row.location}</td>
                    <td className="px-5 py-3 text-secondaryText">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getIntegrityClasses(row.integrityStatus)}`}>
                        {row.integrityStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-secondaryText">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getBlockchainClasses(row.blockchainStatus)}`}>
                        {row.blockchainStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-secondaryText">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getSyncClasses(row.syncStatus)}`}>
                        {row.syncStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
