// Low-level HTTP client for the Django API: base URL, JWT token storage,
// automatic access-token refresh, and typed error handling.

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

const ACCESS_KEY = "pusab_access";
const REFRESH_KEY = "pusab_refresh";
const isBrowser = typeof window !== "undefined";

export const tokenStore = {
  get access(): string | null {
    return isBrowser ? localStorage.getItem(ACCESS_KEY) : null;
  },
  get refresh(): string | null {
    return isBrowser ? localStorage.getItem(REFRESH_KEY) : null;
  },
  save(access: string, refresh?: string) {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function firstFieldError(d: Record<string, unknown>): string | undefined {
  const key = Object.keys(d)[0];
  if (!key) return undefined;
  const v = d[key];
  if (Array.isArray(v)) return `${key}: ${String(v[0])}`;
  if (typeof v === "string") return v;
  return undefined;
}

async function toApiError(res: Response): Promise<ApiError> {
  let data: unknown = null;
  let message = res.statusText || "Request failed";
  try {
    data = await res.json();
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      message = (typeof d.detail === "string" ? d.detail : undefined) ?? firstFieldError(d) ?? message;
    }
  } catch {
    /* non-JSON body */
  }
  return new ApiError(res.status, message, data);
}

// Single in-flight refresh shared across concurrent 401s.
let refreshing: Promise<boolean> | null = null;
async function refreshAccess(): Promise<boolean> {
  const refresh = tokenStore.refresh;
  if (!refresh) return false;
  if (!refreshing) {
    refreshing = fetch(`${API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
      .then(async (r) => {
        if (!r.ok) {
          tokenStore.clear();
          return false;
        }
        const d = (await r.json()) as { access: string };
        tokenStore.save(d.access);
        return true;
      })
      .catch(() => {
        tokenStore.clear();
        return false;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

interface FetchOptions {
  /** Attach the JWT access token (default true). Set false for public/auth calls. */
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options: FetchOptions = {},
): Promise<T> {
  const useAuth = options.auth ?? true;

  const send = async (): Promise<Response> => {
    const headers = new Headers(init.headers);
    const isForm = init.body instanceof FormData;
    if (init.body && !isForm && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (useAuth && tokenStore.access) {
      headers.set("Authorization", `Bearer ${tokenStore.access}`);
    }
    return fetch(`${API_URL}${path}`, { ...init, headers });
  };

  let res = await send();
  if (res.status === 401 && useAuth && tokenStore.refresh) {
    if (await refreshAccess()) res = await send();
  }

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export { API_URL };
