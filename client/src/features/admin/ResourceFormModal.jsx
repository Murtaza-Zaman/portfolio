import { CheckCircle2, Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { useAdminUpload } from "./useAdminData";

export function ResourceFormModal({
  initialData = null,
  isOpen,
  onClose,
  onSubmit,
  resource,
}) {
  const isEditing = Boolean(initialData);
  const fileInputRef = useRef(null);
  const uploadMutation = useAdminUpload();
  const [uploadError, setUploadError] = useState(null);

  const resourceTitle =
    resource === "projects"
      ? "Project"
      : "Service";

  const isProject = resource === "projects";

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      name: "",
      slug: "",
      liveUrl: "",
      category: "",
      tagsInput: "",
      summary: "",
      challenge: "",
      solution: "",
      outcome: "",
      approach: "",
      problem: "",
      value: "",
      coverImage: "",
      imageUrl: "",
      status: "published",
    },
  });

  const titleValue = watch("title") || watch("name");
  const coverImageValue = watch("coverImage") || watch("imageUrl");

  // Auto-generate slug from title if not editing
  useEffect(() => {
    if (!isEditing && titleValue && typeof titleValue === "string") {
      const generatedSlug = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      setValue("slug", generatedSlug);
    }
  }, [titleValue, isEditing, setValue]);

  useEffect(() => {
    setUploadError(null);
    if (initialData) {
      const img = initialData.coverImage || initialData.imageUrl || "";
      const existingTags = initialData.tags?.length
        ? initialData.tags.join(", ")
        : initialData.technologies?.length
        ? initialData.technologies.join(", ")
        : "";

      reset({
        title: initialData.title || initialData.name || "",
        name: initialData.name || initialData.title || "",
        slug: initialData.slug || "",
        liveUrl: initialData.liveUrl || initialData.repositoryUrl || "",
        category: initialData.category || "",
        tagsInput: existingTags,
        summary: initialData.summary || initialData.excerpt || "",
        excerpt: initialData.excerpt || initialData.summary || "",
        challenge: initialData.challenge || "",
        solution: initialData.solution || "",
        outcome: initialData.outcome || "",
        approach: initialData.approach || "",
        body: initialData.body || "",
        coverImage: img,
        imageUrl: img,
        readingTimeMinutes: initialData.readingTimeMinutes || 3,
        status: initialData.status || "published",
      });
    } else {
      reset({
        title: "",
        name: "",
        slug: "",
        liveUrl: "",
        category: "",
        tagsInput: "",
        summary: "",
        excerpt: "",
        challenge: "",
        solution: "",
        outcome: "",
        approach: "",
        body: "",
        coverImage: "",
        imageUrl: "",
        readingTimeMinutes: 3,
        status: "published",
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        folder: `portfolio/${resource || "projects"}`,
      });
      const uploadedUrl = res?.data?.secureUrl || res?.data?.url || res?.url;
      if (uploadedUrl) {
        setValue("coverImage", uploadedUrl);
        setValue("imageUrl", uploadedUrl);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("coverImage", "");
    setValue("imageUrl", "");
  };

  const onFormSubmit = async (data) => {
    // Normalise name vs title
    if (resource === "services") {
      data.name = data.title || data.name;
    } else {
      data.title = data.title || data.name;
    }

    // Process tags
    if (data.tagsInput) {
      const parsedTags = data.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      data.tags = parsedTags;
      data.technologies = parsedTags;
    } else if (isProject && !data.tags) {
      data.tags = [];
      data.technologies = [];
    }

    const finalImage = data.coverImage || data.imageUrl || "";
    data.coverImage = finalImage;
    data.imageUrl = finalImage;

    // Auto slug fallback if not entered
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
    }

    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
      description={`Fill in the details below to ${isEditing ? "update" : "create a new"} ${resourceTitle.toLowerCase()}.`}
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditing ? "Edit" : "Create"} ${resourceTitle}`}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
        {isProject ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Project Title"
                placeholder="e.g. Ecommerce Website"
                required
                {...register("title", { required: true })}
              />
              <Input
                label="Official Website URL"
                placeholder="https://your-live-website.com"
                type="url"
                {...register("liveUrl")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Category"
                placeholder="e.g. Web Application, E-Commerce, Cloud Systems"
                required
                {...register("category", { required: true })}
              />
              <Select
                label="Publication Status"
                options={[
                  { label: "Published (Visible on site)", value: "published" },
                  { label: "Draft", value: "draft" },
                  { label: "Archived", value: "archived" },
                ]}
                {...register("status")}
              />
            </div>

            <Input
              label="Tags / Tech Stack (comma separated)"
              placeholder="e.g. React, Tailwind CSS, Stripe, Node.js"
              {...register("tagsInput")}
            />

            {/* Cloudinary Showcase Image Upload Section */}
            <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <ImageIcon className="text-cyan-400" size={15} />
                  <span>Showcase Image</span>
                </label>
                {coverImageValue && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <CheckCircle2 size={13} />
                    Image attached
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
                <Button
                  className="flex items-center gap-2 text-xs"
                  disabled={uploadMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="outline"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Choose local image & upload</span>
                    </>
                  )}
                </Button>
              </div>

              {uploadError && (
                <p className="text-xs font-medium text-rose-400">{uploadError}</p>
              )}

              {/* Live Thumbnail Preview */}
              {coverImageValue && (
                <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
                  <img
                    alt="Preview"
                    className="h-16 w-24 rounded-lg object-cover border border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    src={coverImageValue}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {coverImageValue}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      Uploaded and ready to save
                    </p>
                  </div>
                  <button
                    aria-label="Remove image"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={resource === "services" ? "Service Name" : "Title"}
                placeholder="e.g. High-Throughput Cloud Platform"
                required
                {...register(resource === "services" ? "name" : "title", { required: true })}
              />
              <Input
                label="URL Slug"
                placeholder="e.g. high-throughput-cloud-platform"
                required
                {...register("slug", { required: true })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Category"
                placeholder="e.g. Cloud Engineering, SaaS, Web Application"
                required
                {...register("category", { required: true })}
              />
              <Select
                label="Publication Status"
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
                {...register("status")}
              />
            </div>

            {/* Cloudinary Image Upload Section */}
            <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <ImageIcon className="text-cyan-400" size={15} />
                  <span>Cover / Showcase Image</span>
                </label>
                {coverImageValue && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <CheckCircle2 size={13} />
                    Image attached
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
                <Button
                  className="flex items-center gap-2 text-xs"
                  disabled={uploadMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="outline"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Choose local file & upload</span>
                    </>
                  )}
                </Button>
                <span className="text-xs text-slate-400">or enter direct URL</span>
              </div>

              <Input
                placeholder="https://res.cloudinary.com/... or paste image URL"
                {...register("coverImage")}
              />

              {uploadError && (
                <p className="text-xs font-medium text-rose-400">{uploadError}</p>
              )}

              {/* Live Thumbnail Preview */}
              {coverImageValue && (
                <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5">
                  <img
                    alt="Preview"
                    className="h-16 w-24 rounded-lg object-cover border border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    src={coverImageValue}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {coverImageValue}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      Ready to be saved
                    </p>
                  </div>
                  <button
                    aria-label="Remove image"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <Textarea
              label="Summary"
              placeholder="Concise overview of this item..."
              required
              rows={3}
              {...register("summary", { required: true })}
            />

            {/* Service specific fields */}
            {resource === "services" && (
              <>
                <Textarea
                  label="Problem Solved"
                  placeholder="The specific organizational challenge this service addresses..."
                  rows={3}
                  {...register("problem")}
                />
                <Textarea
                  label="Engineering Approach"
                  placeholder="How this service is delivered with technical discipline..."
                  rows={3}
                  {...register("approach")}
                />
                <Textarea
                  label="Business Value"
                  placeholder="The tangible outcomes enabled for the client..."
                  rows={3}
                  {...register("value")}
                />
              </>
            )}
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : isEditing ? "Update Record" : "Create Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
