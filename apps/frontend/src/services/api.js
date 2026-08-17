const API_BASE = import.meta.env.VITE_API_URL || "";

export class ApiClientError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new ApiClientError("Invalid server response", response.status);
  }

  if (!response.ok || payload.success === false) {
    throw new ApiClientError(
      payload?.error?.message || "Request failed",
      response.status,
    );
  }

  return payload.data;
}
