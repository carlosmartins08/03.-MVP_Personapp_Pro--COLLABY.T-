import { env } from './env';
import { getAccessToken } from './auth-storage';

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  signal?: AbortSignal;
  query?: QueryParams;
};

const buildUrl = (path: string, query?: QueryParams) => {
  const base = env.API_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!query) return `${base}${normalizedPath}`;

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}${normalizedPath}?${queryString}` : `${base}${normalizedPath}`;
};

const isJsonBody = (body: unknown) =>
  body !== null && body !== undefined && !(body instanceof FormData);

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    signal,
    query,
  } = options;

  if (!env.API_URL) {
    throw new ApiError('VITE_API_URL não configurada.', 500);
  }

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (body instanceof FormData) {
    requestInit.body = body;
  } else if (isJsonBody(body)) {
    requestHeaders['Content-Type'] = requestHeaders['Content-Type'] ?? 'application/json';
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path, query), requestInit);
  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();
  const data = responseText ? safeJsonParse(responseText) : undefined;

  if (!response.ok) {
    const message = (data as { error?: string; message?: string })?.error
      || (data as { message?: string })?.message
      || response.statusText;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

const safeJsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
