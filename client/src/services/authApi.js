import { apiClient } from "./apiClient";

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  me: (token) => apiClient.get("/auth/me", undefined, token),
};