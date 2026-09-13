import { NavLink, useNavigate } from 'react-router-dom';
import { BadgeCheck, BookOpen, LayoutDashboard, ListChecks, Map, PlusSquare, RefreshCw, Settings, ShieldCheck } from 'lucide-react';
import { sidebarItems } from '@/constants/navigation';
import { getCurrentFrontendSession, signOutFrontendSession } from '@/services/auth';

const iconMap = {
  LayoutDashboard,
  PlusSquare,
  ListChecks,
  Map,
  ShieldCheck,
  BadgeCheck,
  RefreshCw,
  BookOpen,
  Settings,
} as const;

export default function Sidebar() {
  const navigate = useNavigate();
  const session = getCurrentFrontendSession();

  const handleSignOut = () => {
    signOutFrontendSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-navy text-white dark:border-slate-700/60">
      <div className="flex items-center gap-3 border-b border-slate-700/80 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primaryBlue/30 bg-primaryBlue/20 font-bold text-blue-400">
          CT
        </div>
        <div>
          <div className="text-lg font-semibold tracking-wide text-white">ColorTrace</div>
          <div className="text-xs text-slate-300">Digital Companion</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primaryBlue font-semibold text-white shadow-soft'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-700/80 bg-deepNavy px-4 py-3.5 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Operator</span>
          <span className="font-semibold tracking-wide text-white">{session?.officerId ?? 'Not signed in'}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Device</span>
          <span className="text-slate-200">Unavailable</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Connection</span>
          <span className="text-slate-200">Unavailable</span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 w-full rounded-xl border border-slate-600/90 bg-slate-800 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:border-slate-500 hover:bg-slate-700"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
