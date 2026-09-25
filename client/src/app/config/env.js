const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const env = {
  apiBaseUrl,
  appEnvironment: import.meta.env.VITE_APP_ENV ?? "local",
};
