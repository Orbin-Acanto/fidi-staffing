export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(!!token);
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      onTokenRefreshed("refreshed");
      isRefreshing = false;
      return true;
    } else {
      isRefreshing = false;
      return false;
    }
  } catch (error) {
    isRefreshing = false;
    return false;
  }
}

export async function apiFetch<T = any>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  retryCount = 0,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401 && retryCount === 0) {
    const isAuthError =
      data?.message?.toLowerCase().includes("token") ||
      data?.message?.toLowerCase().includes("authentication") ||
      data?.message?.toLowerCase().includes("unauthorized") ||
      data?.errors?.auth;

    if (isAuthError) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        return apiFetch<T>(input, init, retryCount + 1);
      } else {
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "";
        if (typeof window !== "undefined") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        throw new AuthError("Session expired. Please login again.");
      }
    }
  }

  if (res.status === 401 && retryCount > 0) {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (typeof window !== "undefined") {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
    throw new AuthError("Session expired. Please login again.");
  }

  if (!res.ok) {
    const msg =
      data?.message || data?.detail || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}
