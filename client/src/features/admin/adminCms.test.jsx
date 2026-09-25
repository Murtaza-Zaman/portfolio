import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { adminApi } from "../../services/adminApi";
import { AdminResourcePage } from "./AdminResourcePage";
import { InquiriesManager } from "./InquiriesManager";
import { NodeGraphManager } from "./NodeGraphManager";
import { ResourceFormModal } from "./ResourceFormModal";

vi.mock("../../services/adminApi", () => ({
  adminApi: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    publish: vi.fn(),
    unpublish: vi.fn(),
    archive: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
    updateInquiryStatus: vi.fn(),
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

function renderWithClient(ui, route = "/admin/projects") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={ui} path="/admin/:resource" />
          <Route element={ui} path="/admin/messages" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ResourceFormModal", () => {
  function renderModal(ui) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  }

  it("renders create form for projects and triggers onSubmit", async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    renderModal(
      <ResourceFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        resource="projects"
      />
    );

    expect(screen.getByRole("heading", { name: "Create Project" })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Project Title/i);
    const categoryInput = screen.getByLabelText(/Category/i);
    const websiteInput = screen.getByLabelText(/Official Website URL/i);

    fireEvent.change(titleInput, { target: { value: "Distributed Cloud Platform" } });
    fireEvent.change(categoryInput, { target: { value: "Enterprise Cloud" } });
    fireEvent.change(websiteInput, { target: { value: "https://cloud-platform.example.com" } });

    const submitButton = screen.getByRole("button", { name: "Create Record" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("populates existing data when in edit mode", () => {
    const existingProject = {
      id: "p1",
      title: "Existing Cloud Core",
      liveUrl: "https://cloud-core.example.com",
      category: "Cloud Infrastructure",
      tags: ["AWS", "Terraform"],
      status: "published",
    };

    renderModal(
      <ResourceFormModal
        initialData={existingProject}
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        resource="projects"
      />
    );

    expect(screen.getByRole("heading", { name: "Edit Project" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Cloud Core")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://cloud-core.example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cloud Infrastructure")).toBeInTheDocument();
  });
});

describe("AdminResourcePage", () => {
  const mockProjects = [
    {
      _id: "1",
      title: "Cloud Migration Architecture",
      slug: "cloud-migration-architecture",
      category: "Cloud",
      summary: "Zero-downtime database migration.",
      status: "published",
      updatedAt: "2026-03-01T10:00:00Z",
    },
    {
      _id: "2",
      title: "Distributed Message Broker",
      slug: "distributed-message-broker",
      category: "Cloud Engineering",
      summary: "High-throughput pub/sub system.",
      status: "draft",
      updatedAt: "2026-03-05T12:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    adminApi.list.mockResolvedValue({
      data: mockProjects,
      meta: { total: 2, page: 1, limit: 50 },
    });
  });

  it("renders CMS data table with project items and action buttons", async () => {
    renderWithClient(<AdminResourcePage />, "/admin/projects");

    await waitFor(() => {
      expect(screen.getByText("Cloud Migration Architecture")).toBeInTheDocument();
      expect(screen.getByText("Distributed Message Broker")).toBeInTheDocument();
    });

    expect(screen.getByText("PUBLISHED")).toBeInTheDocument();
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Create Project" })).toBeInTheDocument();
  });

  it("filters items by search query", async () => {
    renderWithClient(<AdminResourcePage />, "/admin/projects");

    await waitFor(() => {
      expect(screen.getByText("Cloud Migration Architecture")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search projects...");
    fireEvent.change(searchInput, { target: { value: "Migration" } });

    expect(screen.getByText("Cloud Migration Architecture")).toBeInTheDocument();
    expect(screen.queryByText("Distributed Message Broker")).not.toBeInTheDocument();
  });

  it("opens the archive modal when archive action is clicked", async () => {
    renderWithClient(<AdminResourcePage />, "/admin/projects");

    await waitFor(() => {
      expect(screen.getByText("Cloud Migration Architecture")).toBeInTheDocument();
    });

    const archiveButtons = screen.getAllByRole("button", { name: "Archive" });
    fireEvent.click(archiveButtons[0]);

    expect(screen.getByRole("heading", { name: "Confirm Archive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive Record" })).toBeInTheDocument();
  });

  it("opens the delete modal when delete action is clicked", async () => {
    renderWithClient(<AdminResourcePage />, "/admin/projects");

    await waitFor(() => {
      expect(screen.getByText("Cloud Migration Architecture")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByRole("heading", { name: "Delete Record Permanently" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Permanently" })).toBeInTheDocument();
  });
});

describe("InquiriesManager", () => {
  const mockInquiries = [
    {
      _id: "inq-1",
      name: "Sarah Connor",
      email: "sarah@cyberdyne.com",
      organization: "Resistance Tech",
      subject: "Architecture Consulting",
      message: "Need enterprise cloud architecture assistance for automated data pipelines.",
      inquiryType: "client",
      status: "new",
      createdAt: "2026-03-10T14:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    adminApi.list.mockResolvedValue({
      data: mockInquiries,
      meta: { total: 1, page: 1, limit: 50 },
    });
  });

  it("renders messages table and opens inspection modal", async () => {
    renderWithClient(<InquiriesManager />, "/admin/messages");

    await waitFor(() => {
      expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
      expect(screen.getByText("Architecture Consulting")).toBeInTheDocument();
    });

    const inspectBtn = screen.getByRole("button", { name: "Inspect" });
    fireEvent.click(inspectBtn);

    expect(screen.getByText("Inquiry from Sarah Connor")).toBeInTheDocument();
    expect(screen.getAllByText("Resistance Tech").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: "Save Status" })).toBeInTheDocument();
  });
});

describe("NodeGraphManager", () => {
  const mockTechNodes = [
    {
      _id: "node-1",
      nodeId: "frontend",
      label: "Frontend Systems",
      abbr: "FE",
      category: "Client Architecture",
      color: "#22d3ee",
      glowColor: "rgba(34, 211, 238, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25), rgba(6,182,212,0.06))",
      x: 820,
      y: 170,
      depth: 0.95,
      skills: ["React 19", "Next.js", "Tailwind CSS", "GSAP Animations"],
      desc: "Performant, accessible, motion-rich user interfaces and web applications.",
      displayOrder: 1,
      status: "published",
    },
    {
      _id: "node-2",
      nodeId: "ai",
      label: "AI & LLM Systems",
      abbr: "AI",
      category: "Machine Intelligence",
      color: "#c084fc",
      glowColor: "rgba(192, 132, 252, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(192,132,252,0.25), rgba(168,85,247,0.06))",
      x: 180,
      y: 160,
      depth: 0.9,
      skills: ["Gemini API", "LangChain", "RAG Pipelines", "AI Agent Workflows"],
      desc: "Production-grade generative AI, reasoning agents, and semantic embeddings.",
      displayOrder: 2,
      status: "published",
    },
    {
      _id: "node-3",
      nodeId: "backend",
      label: "Backend & APIs",
      abbr: "BE",
      category: "Server Engineering",
      color: "#38bdf8",
      glowColor: "rgba(56, 189, 248, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.25), rgba(14,165,233,0.06))",
      x: 800,
      y: 540,
      depth: 0.85,
      skills: ["Node.js", "Express", "REST APIs", "GraphQL"],
      desc: "Resilient microservices, high-throughput endpoints, and robust auth.",
      displayOrder: 3,
      status: "published",
    },
    {
      _id: "node-4",
      nodeId: "data",
      label: "Data & Storage",
      abbr: "DB",
      category: "Persistence Layer",
      color: "#2dd4bf",
      glowColor: "rgba(45, 212, 191, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(45,212,191,0.25), rgba(20,184,166,0.06))",
      x: 200,
      y: 530,
      depth: 0.8,
      skills: ["PostgreSQL", "MongoDB Atlas", "Redis Cache", "Vector DB"],
      desc: "Relational, document, and vector databases optimized for scale and speed.",
      displayOrder: 4,
      status: "published",
    },
    {
      _id: "node-5",
      nodeId: "cloud",
      label: "Cloud & DevOps",
      abbr: "CL",
      category: "Infrastructure",
      color: "#fbbf24",
      glowColor: "rgba(251, 191, 36, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(251,191,36,0.25), rgba(245,158,11,0.06))",
      x: 500,
      y: 90,
      depth: 0.75,
      skills: ["Docker", "Google Cloud", "CI/CD Pipelines", "Serverless"],
      desc: "Containerized environments, automated deployment, and scalable cloud ops.",
      displayOrder: 5,
      status: "published",
    },
    {
      _id: "node-6",
      nodeId: "search",
      label: "Search & SEO",
      abbr: "SE",
      category: "Search Intelligence",
      color: "#34d399",
      glowColor: "rgba(52, 211, 153, 0.45)",
      bgGradient: "radial-gradient(circle at 35% 35%, rgba(52,211,153,0.25), rgba(16,185,129,0.06))",
      x: 500,
      y: 610,
      depth: 0.85,
      skills: ["Schema.org JSON-LD", "GEO / AEO", "Semantic Web", "Core Web Vitals"],
      desc: "Structured data and machine-readable manifests for next-gen search visibility.",
      displayOrder: 6,
      status: "published",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    adminApi.list.mockResolvedValue({
      data: mockTechNodes,
      meta: { total: 6, page: 1, limit: 50 },
    });
    adminApi.update.mockResolvedValue({ data: mockTechNodes[0] });
    adminApi.publish.mockResolvedValue({ data: mockTechNodes[0] });
  });

  it("renders the 6 tech nodes in the manager", async () => {
    renderWithClient(<NodeGraphManager />, "/admin/nodegraph");

    await waitFor(() => {
      expect(screen.getAllByText(/Interactive Node Graph/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Frontend Systems/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/AI & LLM Systems/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Backend & APIs/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Data & Storage/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Cloud & DevOps/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Search & SEO/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("allows editing node title and saving node", async () => {
    renderWithClient(<NodeGraphManager />, "/admin/nodegraph");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Frontend Systems")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Frontend Systems");
    fireEvent.change(titleInput, { target: { value: "Advanced Frontend Systems" } });

    const saveButton = screen.getByRole("button", { name: "Save Node 01" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(adminApi.update).toHaveBeenCalled();
    });
  });

  it("delegates /admin/nodegraph in AdminResourcePage to NodeGraphManager", async () => {
    renderWithClient(<AdminResourcePage />, "/admin/nodegraph");

    await waitFor(() => {
      expect(screen.getAllByText(/Interactive Node Graph/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
