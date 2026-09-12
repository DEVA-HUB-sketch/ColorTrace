declare global {
  interface Window {
    colortrace?: {
      appVersion: string;
      platform: string;
    };
  }
}

export {};
