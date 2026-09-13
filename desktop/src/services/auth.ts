import { clearFrontendSession, readFrontendSession, writeFrontendSession } from '@/services/session';

export type FrontendLoginResult = {
  success: boolean;
  session?: ReturnType<typeof writeFrontendSession>;
  error?: string;
};

export function getCurrentFrontendSession() {
  return readFrontendSession();
}

export function attemptFrontendLogin(officerId: string, password: string): FrontendLoginResult {
  const trimmedOfficerId = officerId.trim();
  const trimmedPassword = password.trim();

  if (trimmedOfficerId.length === 0) {
    return {
      success: false,
      error: 'Enter an Officer ID to continue.',
    };
  }

  if (trimmedPassword.length === 0) {
    return {
      success: false,
      error: 'Enter a password to continue.',
    };
  }

  // Temporary development-only frontend access.
  // This intentionally does not authenticate against any backend API and does not store the password.
  // The real backend auth contract remains unavailable and can replace this boundary later.
  const session = writeFrontendSession(trimmedOfficerId);

  return {
    success: true,
    session,
  };
}

export function signOutFrontendSession(): void {
  clearFrontendSession();
}
