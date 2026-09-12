import { NavLink } from 'react-router-dom';
import { BadgeCheck, BookOpen, LayoutDashboard, ListChecks, Map, PlusSquare, RefreshCw, Settings, ShieldCheck } from 'lucide-react';
import { sidebarItems } from '@/constants/navigation';

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
  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-navy text-white">
      <div className="flex items-center gap-3 border-b border-slate-700 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primaryBlue/20 font-bold text-lightBlue">
          CT
        </div>
        <div>
          <div className="text-lg font-semibold">ColorTrace</div>
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
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primaryBlue text-white shadow-soft'
                    : 'text-slate-200 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 bg-deepNavy px-4 py-3 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span>Operator</span>
          <span className="font-semibold text-white">Officer 01</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>Device</span>
          <span>LT-400</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>Connection</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
