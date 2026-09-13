import { useEffect, useState } from 'react';
import { ArrowRight, Moon, ShieldCheck, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { attemptFrontendLogin } from '@/services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('colortrace-theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('colortrace-theme', theme);
  }, [theme]);

  const isValid = officerId.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setErrorMessage(officerId.trim().length === 0 ? 'Enter your officer ID.' : 'Enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const result = attemptFrontendLogin(officerId, password);

    if (!result.success) {
      setIsLoading(false);
      setErrorMessage(result.error ?? 'Unable to continue.');
      return;
    }

    window.setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard', { replace: true });
    }, 300);
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className="relative flex min-h-screen bg-pageBg">
      {/* Theme Toggle Button */}
      <button
        type="button"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
        className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-secondaryText shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-surfaceAlt"
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-navy via-deepNavy to-primaryBlue p-10 text-white">
        <div className="max-w-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold backdrop-blur-sm">
              CT
            </div>
            <div>
              <div className="text-2xl font-semibold">ColorTrace</div>
              <div className="text-sm text-blue-100">Digital Companion for Field Drug Testing</div>
            </div>
          </div>

          <h1 className="text-4xl font-semibold leading-tight">
            Measure with Precision.
            <br />
            Prove with Integrity.
          </h1>
          <p className="mt-6 max-w-md text-base text-blue-100">
            A professional field-operations application for standardised colour measurement, evidence capture, and
            tamper-evident digital records.
          </p>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
            <ShieldCheck className="h-5 w-5 text-blue-100" />
            <span className="text-sm text-blue-100">Presumptive field-test result workflow</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Access</p>
            <h2 className="mt-2 text-3xl font-semibold text-primaryText">Welcome Back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-secondaryText">
              <span>Access</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure access
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primaryText">Officer ID</label>
              <input
                value={officerId}
                onChange={(event) => setOfficerId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20"
                placeholder="Enter officer ID"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-primaryText">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20"
                placeholder="Enter password"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primaryBlue px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
