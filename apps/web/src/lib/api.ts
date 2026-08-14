/** Always call the API directly — Next rewrites break multipart uploads and hide errors. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function messageFromBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const o = body as Record<string, unknown>;
  if (typeof o.error === "string") return o.error;
  if (typeof o.message === "string") return o.message;
  return fallback;
}

function handleUnauthorized(path: string) {
  // Don't loop on the login/register endpoints themselves
  if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) return;
  clearTokens();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Cannot reach API at " +
        API_URL +
        ". Keep this running: pnpm --filter @doc-vault/api dev"
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = messageFromBody(body, res.statusText || "Request failed");

    if (res.status === 401) {
      handleUnauthorized(path);
      throw new Error(
        detail.includes("Invalid credentials")
          ? "Invalid email or password. Use demo@docvault.local / demo1234 (run pnpm db:seed if needed)."
          : "Session expired — please sign in again."
      );
    }

    throw new Error(`${detail} (HTTP ${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function uploadDocumentVersion(
  documentId: string,
  file: File,
  year: number
): Promise<{ fileName: string; year: number; ocrExtracted: boolean }> {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  form.append("year", String(year));

  let res: Response;
  try {
    res = await fetch(`${API_URL}/documents/${documentId}/versions`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
  } catch {
    throw new Error("Upload failed — API not reachable at " + API_URL);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      handleUnauthorized("/documents");
      throw new Error("Session expired — please sign in again.");
    }
    throw new Error(body.error ?? `Upload failed (HTTP ${res.status})`);
  }
  return body;
}

export function downloadUrl(documentId: string, versionId: string): string {
  return `${API_URL}/documents/${documentId}/versions/${versionId}/download`;
}

export { API_URL };
