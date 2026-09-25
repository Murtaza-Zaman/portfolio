import { env } from "../app/config/env";

async function request(path, options = {}) {
  const queryParams = options.params ? Object.entries(options.params).filter(([, value]) => value !== undefined && value !== null && value !== "") : [];
  const query = queryParams.length ? `?${new URLSearchParams(queryParams)}` : "";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  let response;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  try {
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    };

    response = await fetch(`${env.apiBaseUrl}${path}${query}`, {
      ...options,
      headers,
      body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    const requestError = new Error(error.name === "AbortError" ? "Request timed out" : "Network request failed");
    requestError.code = error.name === "AbortError" ? "REQUEST_TIMEOUT" : "NETWORK_ERROR";
    throw requestError;
  } finally {
    window.clearTimeout(timeout);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      try {
        localStorage.removeItem("murtaza_access_token");
        localStorage.removeItem("murtaza_auth_user");
        sessionStorage.removeItem("murtaza_access_token");
      } catch {
        // ignore
      }
    }
    const error = new Error(payload?.error?.message ?? "Request failed");
    error.code = payload?.error?.code;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export const apiClient = {
  baseUrl: env.apiBaseUrl,
  get: (path, params, token) => request(path, { method: "GET", params, token }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  delete: (path, token) => request(path, { method: "DELETE", token }),
  upload: (path, formData, token) => request(path, { method: "POST", body: formData, token }),
};
