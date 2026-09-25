import { render, screen } from "@testing-library/react";
import { describe, expect, beforeEach, it } from "vitest";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("redirects unauthenticated users to admin login", () => {
    render(<MemoryRouter initialEntries={["/admin/projects"]}><Routes><Route element={<ProtectedRoute />}><Route element={<p>Protected content</p>} path="/admin/projects" /></Route><Route element={<p>Login required</p>} path="/admin/login" /></Routes></MemoryRouter>);

    expect(screen.getByText("Login required")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders protected content when a session exists", () => {
    useAuthStore.setState({ token: "test-token" });

    render(<MemoryRouter initialEntries={["/admin/projects"]}><Routes><Route element={<ProtectedRoute />}><Route element={<Outlet />} path="/admin/projects"><Route element={<p>Protected content</p>} index /></Route></Route><Route element={<p>Login required</p>} path="/admin/login" /></Routes></MemoryRouter>);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});