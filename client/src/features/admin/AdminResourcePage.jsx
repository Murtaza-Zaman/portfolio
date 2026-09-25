import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { MaterialTable } from "../../components/ui/MaterialTable";
import { Modal } from "../../components/ui/Modal";
import { SearchInput } from "../../components/ui/SearchInput";
import { Tabs } from "../../components/ui/Tabs";
import { HeroManager } from "./HeroManager";
import { InquiriesManager } from "./InquiriesManager";
import { NodeGraphManager } from "./NodeGraphManager";
import { ResourceFormModal } from "./ResourceFormModal";
import { ShowcaseCardsManager } from "./ShowcaseCardsManager";
import {
  useAdminArchive,
  useAdminCreate,
  useAdminDelete,
  useAdminList,
  useAdminPublish,
  useAdminUnpublish,
  useAdminUpdate,
} from "./useAdminData";

const resourceConfig = {
  projects: {
    title: "Projects",
    singular: "Project",
    description: "Manage portfolio project showcases, technologies, and outcomes.",
  },
  services: {
    title: "Services",
    singular: "Service",
    description: "Manage capability solutions, technical offerings, and service descriptions.",
  },
  messages: {
    title: "Messages",
    singular: "Message",
    description: "Review incoming client, recruiter, and partnership inquiries.",
  },
  inquiries: {
    title: "Inquiries",
    singular: "Inquiry",
    description: "Review incoming client, recruiter, and partnership inquiries.",
  },
};

export function AdminResourcePage() {
  const { resource } = useParams();

  // Delegate hero & profile to dedicated hero manager
  if (resource === "hero" || resource === "profile" || resource === "profiles") {
    return <HeroManager />;
  }

  // Delegate messages to dedicated inquiries manager
  if (resource === "messages" || resource === "inquiries") {
    return <InquiriesManager />;
  }

  // Delegate showcase cards to dedicated manager
  if (resource === "showcasecards") {
    return <ShowcaseCardsManager />;
  }

  // Delegate node graph points to dedicated manager
  if (resource === "nodegraph" || resource === "technodes" || resource === "technode") {
    return <NodeGraphManager />;
  }

  return <AdminResourceTable resourceKey={resource} resourceParam={resource} />;
}

function AdminResourceTable({ resourceKey, resourceParam }) {
  const config = resourceConfig[resourceParam] || resourceConfig[resourceKey] || {
    title: resourceParam || "Content Resource",
    singular: "Record",
    description: "Manage content records in the portfolio CMS.",
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState(null);

  // Form modal state
  const [formModal, setFormModal] = useState({ isOpen: false, item: null });

  // Archive confirmation modal state
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, item: null });

  // Permanent Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  // API hooks
  const { data, error, isLoading } = useAdminList(resourceKey, {
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useAdminCreate(resourceKey);
  const updateMutation = useAdminUpdate(resourceKey);
  const publishMutation = useAdminPublish(resourceKey);
  const unpublishMutation = useAdminUnpublish(resourceKey);
  const archiveMutation = useAdminArchive(resourceKey);
  const deleteMutation = useAdminDelete(resourceKey);

  const rawItems = useMemo(() => {
    return Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
  }, [data]);

  const items = useMemo(() => {
    return rawItems.filter((item) => {
      // Status filtering
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      // Search query filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.title || item.name || "").toLowerCase().includes(query);
        const categoryMatch = (item.category || "").toLowerCase().includes(query);
        const slugMatch = (item.slug || "").toLowerCase().includes(query);
        const summaryMatch = (item.summary || item.excerpt || "").toLowerCase().includes(query);
        return titleMatch || categoryMatch || slugMatch || summaryMatch;
      }
      return true;
    });
  }, [rawItems, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: rawItems.length,
      published: rawItems.filter((i) => i.status === "published").length,
      draft: rawItems.filter((i) => i.status === "draft").length,
      archived: rawItems.filter((i) => i.status === "archived").length,
    };
  }, [rawItems]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateNew = () => {
    setFormModal({ isOpen: true, item: null });
  };

  const handleEdit = (item) => {
    setFormModal({ isOpen: true, item });
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formModal.item?._id || formModal.item?.id) {
        const id = formModal.item._id || formModal.item.id;
        await updateMutation.mutateAsync({ id, data: formData });
        showNotification(`${config.singular} updated successfully.`);
      } else {
        await createMutation.mutateAsync(formData);
        showNotification(`New ${config.singular.toLowerCase()} created successfully.`);
      }
      setFormModal({ isOpen: false, item: null });
    } catch (err) {
      showNotification(err.message || "Failed to save record.", "error");
    }
  };

  const handleTogglePublish = async (item) => {
    const id = item._id || item.id;
    try {
      if (item.status === "published") {
        await unpublishMutation.mutateAsync(id);
        showNotification(`${item.title || item.name} moved to drafts.`);
      } else {
        await publishMutation.mutateAsync(id);
        showNotification(`${item.title || item.name} is now published live!`);
      }
    } catch (err) {
      showNotification(err.message || "Failed to update publication status.", "error");
    }
  };

  const handleConfirmArchive = async () => {
    if (!archiveModal.item) return;
    const id = archiveModal.item._id || archiveModal.item.id;
    try {
      await archiveMutation.mutateAsync(id);
      showNotification(`${archiveModal.item.title || archiveModal.item.name} archived.`);
      setArchiveModal({ isOpen: false, item: null });
    } catch (err) {
      showNotification(err.message || "Failed to archive record.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    const id = deleteModal.item._id || deleteModal.item.id;
    try {
      await deleteMutation.mutateAsync(id);
      showNotification(`${deleteModal.item.title || deleteModal.item.name} permanently deleted from database.`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      showNotification(err.message || "Failed to delete record.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title={config.title} />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageIntro
          dark={true}
          description={config.description}
          eyebrow="Content Operations"
          title={config.title}
        />
        <Button onClick={handleCreateNew} variant="primary">
          + Create {config.singular}
        </Button>
      </div>

      {feedback && (
        <div
          aria-live="polite"
          className={`rounded-xl border p-4 text-sm font-medium transition ${
            feedback.type === "error"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
          role="status"
        >
          {feedback.msg}
        </div>
      )}

      {/* Control Bar: Search & Status Filter Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          activeTab={statusFilter}
          onChange={setStatusFilter}
          tabs={[
            { id: "all", label: `All (${counts.all})` },
            { id: "published", label: `Published (${counts.published})` },
            { id: "draft", label: `Drafts (${counts.draft})` },
            { id: "archived", label: `Archived (${counts.archived})` },
          ]}
        />
        <div className="w-full sm:w-72">
          <SearchInput
            aria-label={`Search ${config.title.toLowerCase()}`}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
          />
        </div>
      </div>

      {/* Material Table Card */}
      {isLoading || error ? (
        <ContentState error={error} isLoading={isLoading} />
      ) : (
        <MaterialTable
          data={items}
          emptyMessage={`No ${config.title.toLowerCase()} found`}
          onArchive={(item) => setArchiveModal({ isOpen: true, item })}
          onDelete={(item) => setDeleteModal({ isOpen: true, item })}
          onEdit={handleEdit}
          onTogglePublish={handleTogglePublish}
          resourceKey={resourceKey}
        />
      )}

      <div className="flex items-center justify-between pt-4">
        <Link className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/admin">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Resource Form Modal for Create / Edit */}
      <ResourceFormModal
        initialData={formModal.item}
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, item: null })}
        onSubmit={handleFormSubmit}
        resource={resourceKey}
      />

      {/* Archive Confirmation Modal */}
      <Modal
        description={`Are you sure you want to archive "${
          archiveModal.item?.title || archiveModal.item?.name || "this item"
        }"? It will be unpublished and hidden from public views.`}
        isOpen={archiveModal.isOpen}
        onClose={() => setArchiveModal({ isOpen: false, item: null })}
        title="Confirm Archive"
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setArchiveModal({ isOpen: false, item: null })}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className="bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400 shadow-md"
            onClick={handleConfirmArchive}
            type="button"
          >
            Archive Record
          </Button>
        </div>
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal
        description={`Are you sure you want to permanently delete "${
          deleteModal.item?.title || deleteModal.item?.name || "this item"
        }" from the database? This action cannot be undone.`}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title="Delete Record Permanently"
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => setDeleteModal({ isOpen: false, item: null })}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className="bg-rose-600 font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-900/30"
            disabled={deleteMutation.isPending}
            onClick={handleConfirmDelete}
            type="button"
          >
            {deleteMutation.isPending ? "Deleting from Database..." : "Delete Permanently"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}