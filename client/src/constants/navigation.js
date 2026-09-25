import { ROUTES } from "./routes";

export const PRIMARY_NAVIGATION = [
  { label: "About", path: ROUTES.PUBLIC.ABOUT },
  { label: "Services", path: ROUTES.PUBLIC.SERVICES },
  { label: "Projects", path: ROUTES.PUBLIC.PROJECTS },
];

export const FOOTER_NAVIGATION = [
  { label: "About", path: ROUTES.PUBLIC.ABOUT },
  { label: "Services", path: ROUTES.PUBLIC.SERVICES },
  { label: "Projects", path: ROUTES.PUBLIC.PROJECTS },
  { label: "Resume", path: ROUTES.PUBLIC.RESUME },
  { label: "Contact", path: ROUTES.PUBLIC.CONTACT },
];

export const ADMIN_NAVIGATION = [
  { label: "Dashboard", path: ROUTES.ADMIN.DASHBOARD, resource: "" },
  { label: "Hero & Profile", path: ROUTES.ADMIN.HERO, resource: "hero", description: "Customize hero typography, roles, skills, and glowing social links." },
  { label: "Projects", path: ROUTES.ADMIN.PROJECTS, resource: "projects", description: "Manage practical technology work and outcomes." },
  { label: "Services", path: ROUTES.ADMIN.SERVICES, resource: "services", description: "Maintain solution offerings and relationships." },
  { label: "Showcase Cards", path: ROUTES.ADMIN.SHOWCASE_CARDS, resource: "showcasecards", description: "Edit the 4 homepage showcase node cards." },
  { label: "Node Graph", path: ROUTES.ADMIN.NODE_GRAPH, resource: "nodegraph", description: "Customize the 6 interactive hero tech nodes, coordinates, and skills." },
  { label: "Messages", path: ROUTES.ADMIN.MESSAGES, resource: "messages", description: "Review incoming professional inquiries." },
  { label: "Settings", path: ROUTES.ADMIN.SETTINGS, resource: "settings", description: "Configure website settings and SEO defaults." },
];
