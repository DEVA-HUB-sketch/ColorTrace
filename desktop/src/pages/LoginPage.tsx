import { useState } from 'react';
import { ArrowRight, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function LoginPage() {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isValid = officerId.trim().length >= 3 && password.trim().length >= 6;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setErrorMessage('Enter a valid Officer ID and password to continue.');
      setSuccessMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    window.setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Login request accepted. Authentication endpoint is not connected in this desktop build.');
    }, 700);
  };

  return (
    <div className="flex min-h-screen bg-offWhite">
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

          <h1 className="text-4xl font-semibold leading-tight">Measure with Precision.<br />Prove with Integrity.</h1>
          <p className="mt-6 max-w-md text-base text-blue-100">
            A professional field-operations application for standardised colour measurement, evidence capture, and tamper-evident digital records.
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
              <span>Connection</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                {true ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                ONLINE
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

            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
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
