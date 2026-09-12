import axios, { AxiosError } from 'axios';

export interface BackendHealthResponse {
  status: string;
  service: string;
}

export type ApiErrorCode =
  | 'network-unavailable'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'validation'
  | 'rate-limit'
  | 'server-error'
  | 'unknown';

export interface ApiErrorInfo {
  code: ApiErrorCode;
  endpoint: string;
  status?: number;
  message: string;
}

export interface BackendContractEndpoint {
  method: string;
  path: string;
  available: boolean;
  notes: string;
}

export interface BackendContractCatalog {
  health: BackendContractEndpoint;
  auth: BackendContractEndpoint;
  dashboard: BackendContractEndpoint;
  records: BackendContractEndpoint;
  recordDetails: BackendContractEndpoint;
  verification: BackendContractEndpoint;
  sync: BackendContractEndpoint;
  provenance: BackendContractEndpoint;
}

export const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const backendContract: BackendContractCatalog = {
  health: {
    method: 'GET',
    path: '/health',
    available: true,
    notes: 'Confirmed by the current desktop frontend and settings page.',
  },
  auth: {
    method: 'POST',
    path: '/auth/login',
    available: false,
    notes: 'No auth endpoint was found in the repository. Authentication is unavailable in this desktop build.',
  },
  dashboard: {
    method: 'GET',
    path: '/dashboard',
    available: false,
    notes: 'No dashboard statistics endpoint was found in the repository. Dashboard data is currently sourced from the shared reference dataset.',
  },
  records: {
    method: 'GET',
    path: '/records',
    available: false,
    notes: 'No records list endpoint was found in the repository. Table data is currently sourced from the shared reference dataset.',
  },
  recordDetails: {
    method: 'GET',
    path: '/records/:id',
    available: false,
    notes: 'No record-details endpoint was found in the repository. Record details are currently sourced from the shared reference dataset.',
  },
  verification: {
    method: 'GET',
    path: '/verification/:id',
    available: false,
    notes: 'No verification endpoint was found in the repository. Verification remains unavailable in this desktop build.',
  },
  sync: {
    method: 'GET',
    path: '/sync',
    available: false,
    notes: 'No sync endpoint was found in the repository. Sync remains unavailable in this desktop build.',
  },
  provenance: {
    method: 'GET',
    path: '/provenance/:id',
    available: false,
    notes: 'No provenance endpoint was found in the repository. Blockchain provenance remains unavailable/pending.',
  },
};

export const actualBackendEndpoints = Object.values(backendContract).filter((endpoint) => endpoint.available);

export function normalizeApiError(error: unknown, endpoint: string): ApiErrorInfo {
  const axiosError = error as AxiosError;

  if (!axiosError || !axiosError.isAxiosError) {
    return {
      code: 'unknown',
      endpoint,
      message: 'An unknown frontend error occurred.',
    };
  }

  if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ERR_NETWORK') {
    return {
      code: 'network-unavailable',
      endpoint,
      status: axiosError.response?.status,
      message: 'The backend is unavailable. Check the configured API base URL and server status.',
    };
  }

  if (axiosError.code === 'ECONNABORTED') {
    return {
      code: 'timeout',
      endpoint,
      status: axiosError.response?.status,
      message: 'The backend request timed out.',
    };
  }

  if (axiosError.response?.status === 401) {
    return {
      code: 'unauthorized',
      endpoint,
      status: 401,
      message: 'Unauthorized. Please sign in again with a valid session.',
    };
  }

  if (axiosError.response?.status === 403) {
    return {
      code: 'forbidden',
      endpoint,
      status: 403,
      message: 'Forbidden. The current session is not allowed to access this resource.',
    };
  }

  if (axiosError.response?.status === 404) {
    return {
      code: 'not-found',
      endpoint,
      status: 404,
      message: 'The requested backend endpoint was not found.',
    };
  }

  if (axiosError.response?.status === 409) {
    return {
      code: 'conflict',
      endpoint,
      status: 409,
      message: 'The backend rejected this request because of a conflict.',
    };
  }

  if (axiosError.response?.status === 422) {
    return {
      code: 'validation',
      endpoint,
      status: 422,
      message: 'The backend rejected the request because the payload was invalid.',
    };
  }

  if (axiosError.response?.status === 429) {
    return {
      code: 'rate-limit',
      endpoint,
      status: 429,
      message: 'The backend rate limit was exceeded. Please retry later.',
    };
  }

  if (axiosError.response && axiosError.response.status >= 500) {
    return {
      code: 'server-error',
      endpoint,
      status: axiosError.response.status,
      message: 'The backend returned a server error.',
    };
  }

  return {
    code: 'unknown',
    endpoint,
    status: axiosError.response?.status,
    message: 'An unexpected API error occurred.',
  };
}

export function getApiErrorMessage(error: unknown, endpoint: string): string {
  return normalizeApiError(error, endpoint).message;
}

export async function getBackendHealth(): Promise<BackendHealthResponse> {
  const { data } = await apiClient.get<BackendHealthResponse>(backendContract.health.path);
  return data;
}
