import { apiClient } from "./apiClient";

export const publicApi = {
  getProfile: () => apiClient.get("/profile"),
  getServices: (params) => apiClient.get("/services", params),
  getService: (slug) => apiClient.get(`/services/${slug}`),
  getProjects: (params) => apiClient.get("/projects", params),
  getProject: (slug) => apiClient.get(`/projects/${slug}`),
  getShowcaseCards: () => apiClient.get("/showcase-cards"),
  getNodeGraph: () => apiClient.get("/node-graph"),
  getResume: () => apiClient.get("/documents/resume"),
  createInquiry: (payload) => apiClient.post("/inquiries", payload),
};
