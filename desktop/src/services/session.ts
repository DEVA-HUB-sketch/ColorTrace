export type FrontendSession = {
  authenticated: true;
  officerId: string;
  createdAt: string;
};

const SESSION_KEY = 'colortrace-frontend-session';

export function readFrontendSession(): FrontendSession | null {
  try {
    const rawSession = window.sessionStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession) as Partial<FrontendSession>;

    if (!parsedSession.authenticated || typeof parsedSession.officerId !== 'string' || parsedSession.officerId.trim().length === 0) {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      authenticated: true,
      officerId: parsedSession.officerId.trim(),
      createdAt: parsedSession.createdAt ?? new Date().toISOString(),
    };
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeFrontendSession(officerId: string): FrontendSession {
  const session: FrontendSession = {
    authenticated: true,
    officerId: officerId.trim(),
    createdAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

export function clearFrontendSession(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
}
