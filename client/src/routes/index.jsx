import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const page = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const AboutPage = page(() => import("../features/about/AboutPage"), "AboutPage");
const ResumePage = page(() => import("../features/about/ResumePage"), "ResumePage");
const AdminDashboard = page(() => import("../features/admin/AdminDashboard"), "AdminDashboard");
const AdminResourcePage = page(() => import("../features/admin/AdminResourcePage"), "AdminResourcePage");
const SettingsPage = page(() => import("../features/settings/SettingsPage"), "SettingsPage");
const LoginPage = page(() => import("../features/auth/LoginPage"), "LoginPage");
const ProtectedRoute = page(() => import("../features/auth/ProtectedRoute"), "ProtectedRoute");
const ContactPage = page(() => import("../features/contact/ContactPage"), "ContactPage");
const HomePage = page(() => import("../features/home/HomePage"), "HomePage");
const NotFoundPage = page(() => import("../features/home/NotFoundPage"), "NotFoundPage");
const ProjectDetailPage = page(() => import("../features/projects/ProjectDetailPage"), "ProjectDetailPage");
const ProjectsPage = page(() => import("../features/projects/ProjectsPage"), "ProjectsPage");
const ServiceDetailPage = page(() => import("../features/services/ServiceDetailPage"), "ServiceDetailPage");
const ServicesPage = page(() => import("../features/services/ServicesPage"), "ServicesPage");
const AdminLayout = page(() => import("../layouts/AdminLayout"), "AdminLayout");
const PublicLayout = page(() => import("../layouts/PublicLayout"), "PublicLayout");

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route element={<HomePage />} index />
        <Route element={<AboutPage />} path="about" />
        <Route element={<ResumePage />} path="resume" />
        <Route element={<ServicesPage />} path="services" />
        <Route element={<ServiceDetailPage />} path="services/:slug" />
        <Route element={<ProjectsPage />} path="projects" />
        <Route element={<ProjectDetailPage />} path="projects/:slug" />
        <Route element={<ContactPage />} path="contact" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
      <Route path="/admin">
        <Route element={<LoginPage />} path="login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route element={<AdminDashboard />} index />
            <Route element={<SettingsPage />} path="settings" />
            <Route element={<AdminResourcePage />} path=":resource" />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
