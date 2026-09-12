import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

type ThemeMode = 'light' | 'dark';

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem('colortrace-theme');
  return storedTheme === 'dark' ? 'dark' : 'light';
}

export default function AppLayout() {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('colortrace-theme', theme);
  }, [theme]);

  const isDarkMode = theme === 'dark';

  return (
    <div className="flex h-full min-h-screen bg-offWhite text-primaryText">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondaryText">Field Operations</p>
            <h1 className="text-2xl font-semibold text-primaryText">ColorTrace</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium">
              <span>Officer</span>
              <ChevronDown className="h-4 w-4 text-secondaryText" />
            </div>

            <button
              type="button"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-secondaryText transition hover:border-slate-300 hover:bg-slate-100"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
