import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  });

  const handleToggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('colortrace-theme', newTheme);
  };

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
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Application Version</span>
              <span className="font-semibold text-primaryText">0.1.0</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Current Data Source</span>
              <span className="font-semibold text-primaryText">Local session view</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Authentication Mode</span>
              <span className="font-semibold text-primaryText">Session access</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Application</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Theme Mode</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleTheme('light')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    theme === 'light'
                      ? 'bg-primaryBlue text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-secondaryText hover:bg-slate-100'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleTheme('dark')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    theme === 'dark'
                      ? 'bg-primaryBlue text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-secondaryText hover:bg-slate-100'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Data Availability</span>
              <span className="font-semibold text-primaryText">No backend records available</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
              <span className="text-secondaryText">Operational Status</span>
              <span className="font-semibold text-primaryText">Desktop frontend only</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-primaryText">Security & Integrity</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
            <span className="text-secondaryText">Session Handling</span>
            <span className="font-semibold text-primaryText">Session-only storage</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
            <span className="text-secondaryText">Stored Passwords</span>
            <span className="font-semibold text-primaryText">Not stored</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-offWhite px-3 py-2">
            <span className="text-secondaryText">Backend Authentication</span>
            <span className="font-semibold text-primaryText">Not connected</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-primaryText">About</h3>
        <div className="mt-4 rounded-xl border border-slate-200 bg-offWhite p-4 text-sm text-secondaryText">
          ColorTrace desktop currently runs with the frontend interface active while the backend authentication,
          records, verification, and provenance services are not yet connected.
        </div>
      </div>
    </div>
  );
}
