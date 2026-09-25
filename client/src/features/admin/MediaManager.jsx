import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { Tabs } from "../../components/ui/Tabs";
import { formatBytes } from "../../utils/formatters";
import { useAdminArchive, useAdminCreate, useAdminList } from "./useAdminData";

const PURPOSE_OPTIONS = [
  { label: "Profile", value: "profile" },
  { label: "Project", value: "project" },
  { label: "Document", value: "document" },
  { label: "Social", value: "social" },
];

export function MediaManager() {
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, error, isLoading } = useAdminList("media");
  const createMediaMutation = useAdminCreate("media");
  const archiveMediaMutation = useAdminArchive("media");

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      publicId: "",
      secureUrl: "",
      purpose: "project",
      ownerType: "Project",
      altText: "",
      caption: "",
      width: 1200,
      height: 630,
    },
  });

  const rawAssets = useMemo(() => {
    return Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
  }, [data]);

  const assets = useMemo(() => {
    return rawAssets.filter((asset) => {
      if (purposeFilter !== "all" && asset.purpose !== purposeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (asset.publicId || "").toLowerCase().includes(q);
        const altMatch = (asset.altText || "").toLowerCase().includes(q);
        const purposeMatch = (asset.purpose || "").toLowerCase().includes(q);
        const captionMatch = (asset.caption || "").toLowerCase().includes(q);
        return idMatch || altMatch || purposeMatch || captionMatch;
      }
      return true;
    });
  }, [rawAssets, purposeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: rawAssets.length,
      project: rawAssets.filter((a) => a.purpose === "project").length,
      profile: rawAssets.filter((a) => a.purpose === "profile").length,
    };
  }, [rawAssets]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCopyUrl = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      showNotification("Failed to copy URL to clipboard.", "error");
    }
  };

  const handleAddAsset = async (formData) => {
    try {
      await createMediaMutation.mutateAsync({
        ...formData,
        // Default dummy owner id if required
        ownerId: "65f000000000000000000001",
      });
      showNotification("Media asset registered successfully.");
      setIsAddModalOpen(false);
      reset();
    } catch (err) {
      showNotification(err.message || "Failed to register media asset.", "error");
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveMediaMutation.mutateAsync(id);
      showNotification("Media asset removed from active library.");
    } catch (err) {
      showNotification(err.message || "Failed to archive media asset.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Media Library" />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageIntro
          dark={true}
          description="Manage Cloudinary image assets, responsive resolutions, and entity relationships."
          eyebrow="Asset Management"
          title="Media Library"
        />
        <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
          + Add Media Asset
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

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          activeTab={purposeFilter}
          onChange={setPurposeFilter}
          tabs={[
            { id: "all", label: `All (${counts.all})` },
            { id: "project", label: `Projects (${counts.project})` },
            { id: "profile", label: `Profile (${counts.profile})` },
          ]}
        />
        <div className="w-full sm:w-72">
          <SearchInput
            aria-label="Search media assets"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search assets..."
            value={searchQuery}
          />
        </div>
      </div>

      {/* Asset Grid */}
      {isLoading || error ? (
        <ContentState error={error} isLoading={isLoading} />
      ) : assets.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center text-slate-400 shadow-xl backdrop-blur-xl">
          <p className="text-base font-semibold text-white">No media assets found</p>
          <p className="mt-1 text-sm">Add a new media asset or adjust your filters.</p>
          <div className="mt-4">
            <Button onClick={() => setIsAddModalOpen(true)} variant="secondary">
              Register New Asset
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const id = asset._id || asset.id;
            const isCopied = copiedId === id;

            return (
              <div
                className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-xl backdrop-blur-xl transition duration-300 hover:border-cyan-400/40 hover:bg-white/[0.04]"
                key={id}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    alt={asset.altText || asset.publicId}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                    }}
                    src={asset.secureUrl}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge tone="brand">{asset.purpose}</Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <h3 className="font-mono text-xs font-semibold text-white truncate">
                      {asset.publicId}
                    </h3>
                    {asset.altText && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {asset.altText}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
                      {asset.width && asset.height && (
                        <span>
                          {asset.width}&times;{asset.height}
                        </span>
                      )}
                      {asset.bytes && <span>&bull; {formatBytes(asset.bytes)}</span>}
                      {asset.format && <span className="uppercase">&bull; {asset.format}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <Button
                      className="text-xs"
                      onClick={() => handleCopyUrl(asset.secureUrl, id)}
                      variant="secondary"
                    >
                      {isCopied ? "Copied URL!" : "Copy Link"}
                    </Button>
                    <Button
                      className="text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      onClick={() => handleArchive(id)}
                      variant="ghost"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Link className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/admin">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Add Media Asset Modal */}
      <Modal
        className="max-w-lg"
        description="Register a new Cloudinary asset or hosted image URL."
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Media Asset"
      >
        <form className="space-y-4 pt-2" onSubmit={handleSubmit(handleAddAsset)}>
          <Input
            label="Public ID / Identifier"
            placeholder="e.g. portfolio/projects/hero-mockup"
            required
            {...register("publicId", { required: true })}
          />
          <Input
            label="Secure URL"
            placeholder="https://res.cloudinary.com/..."
            required
            type="url"
            {...register("secureUrl", { required: true })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Purpose"
              options={PURPOSE_OPTIONS}
              {...register("purpose")}
            />
            <Input
              label="Owner Entity Type"
              placeholder="e.g. Project"
              {...register("ownerType")}
            />
          </div>
          <Input
            label="Alt Text"
            placeholder="Accessible description for screen readers"
            {...register("altText")}
          />
          <Input
            label="Caption / Label"
            placeholder="Optional caption"
            {...register("caption")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Width (px)"
              type="number"
              {...register("width", { valueAsNumber: true })}
            />
            <Input
              label="Height (px)"
              type="number"
              {...register("height", { valueAsNumber: true })}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
            <Button onClick={() => setIsAddModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Registering..." : "Save Asset"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
