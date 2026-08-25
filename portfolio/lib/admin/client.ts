"use client";

const KEY_TOKEN = "admin_access_token";
const KEY_URL = "admin_api_url";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_TOKEN);
}

export function getApiUrl(): string {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_API_URL ?? "";
  return localStorage.getItem(KEY_URL) || process.env.NEXT_PUBLIC_API_URL || "";
}

export function setAdminUrl(url: string) {
  localStorage.setItem(KEY_URL, url.replace(/\/$/, ""));
}

export function setAdminToken(token: string) {
  localStorage.setItem(KEY_TOKEN, token);
}

export function clearAdminCredentials() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_URL);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return Array.isArray(body.message) ? body.message.join(", ") : String(body.message);
  } catch {
    /* ignore */
  }
  return `ጥያቄው አልተሳካም (${res.status})`;
}

/** Authenticated request — attaches the admin bearer token (JWT from /auth/login). */
export async function adminFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getApiUrl();
  const token = getAdminToken();
  if (!base) throw new ApiError(0, "Backend URL አልተዋቀረም።");

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) throw new ApiError(res.status, await parseErrorMessage(res));
  if (res.status === 204) return undefined as T;
  return res.json();
}

/**
 * Uploads a file (multipart/form-data) to an admin-protected endpoint, e.g.
 * "/uploads/avatar" or "/uploads/resume". Returns the hosted file's URL.
 * Deliberately does NOT set Content-Type — the browser sets the correct
 * multipart boundary automatically when given a FormData body.
 */
export async function adminUploadFile(path: string, file: File): Promise<{ url: string }> {
  const base = getApiUrl();
  const token = getAdminToken();
  if (!base) throw new ApiError(0, "Backend URL አልተዋቀረም።");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });

  if (!res.ok) throw new ApiError(res.status, await parseErrorMessage(res));
  return res.json();
}

/** Logs in with email + password against POST /auth/login and stores the returned JWT. */
export async function adminLogin(apiUrl: string, email: string, password: string): Promise<void> {
  const base = apiUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new ApiError(res.status, await parseErrorMessage(res));

  const data: { accessToken: string } = await res.json();
  setAdminUrl(base);
  setAdminToken(data.accessToken);
}
