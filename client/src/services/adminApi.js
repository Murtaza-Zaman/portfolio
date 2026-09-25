import { apiClient } from "./apiClient";

const resourcePath = {
  hero: "/admin/profiles",
  profile: "/admin/profiles",
  profiles: "/admin/profiles",
  projects: "/admin/projects",
  services: "/admin/services",
  showcasecards: "/admin/showcasecards",
  nodegraph: "/admin/technodes",
  technodes: "/admin/technodes",
  technode: "/admin/technodes",
  media: "/admin/media",
  messages: "/admin/inquiries",
  inquiries: "/admin/inquiries",
  settings: "/admin/settings",
  audit: "/admin/audit-events",
};

export const adminApi = {
  list: (resource, params, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.get(path, params, token);
  },

  getById: (resource, id, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.get(`${path}/${id}`, undefined, token);
  },

  create: (resource, data, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.post(path, data, token);
  },

  update: (resource, id, data, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.patch(`${path}/${id}`, data, token);
  },

  publish: (resource, id, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.post(`${path}/${id}/publish`, {}, token);
  },

  unpublish: (resource, id, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.post(`${path}/${id}/unpublish`, {}, token);
  },

  archive: (resource, id, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.post(`${path}/${id}/archive`, {}, token);
  },

  delete: (resource, id, token) => {
    const path = resourcePath[resource] || `/admin/${resource}`;
    return apiClient.delete(`${path}/${id}`, token);
  },

  upload: (file, folder = "portfolio/projects", token) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }
    return apiClient.upload("/admin/upload", formData, token);
  },

  updateInquiryStatus: (id, data, token) => {
    return apiClient.patch(`/admin/inquiries/${id}/status`, data, token);
  },

  getSettings: (token) => {
    return apiClient.get("/admin/settings", undefined, token);
  },

  updateSettings: (data, token) => {
    return apiClient.patch("/admin/settings", data, token);
  },

  getAuditEvents: (params, token) => {
    return apiClient.get("/admin/audit-events", params, token);
  },
};