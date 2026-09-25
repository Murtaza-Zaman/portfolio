export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    RESUME: "/resume",
    SERVICES: "/services",
    SERVICE_DETAIL: (slug) => `/services/${slug}`,
    PROJECTS: "/projects",
    PROJECT_DETAIL: (slug) => `/projects/${slug}`,
    CONTACT: "/contact",
  },
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin",
    HERO: "/admin/hero",
    PROJECTS: "/admin/projects",
    SERVICES: "/admin/services",
    SHOWCASE_CARDS: "/admin/showcasecards",
    NODE_GRAPH: "/admin/nodegraph",
    MESSAGES: "/admin/messages",
    SETTINGS: "/admin/settings",
  },
};
