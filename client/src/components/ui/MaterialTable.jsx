import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { formatDate } from "../../utils/formatters";

/**
 * Status Chip with Material Design styling & indicator dots
 */
export function MaterialStatusChip({ status }) {
  const normalized = (status || "draft").toLowerCase();

  const styles = {
    published: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 ring-emerald-500/20",
    qualified: "bg-purple-500/10 text-purple-300 border-purple-500/30 ring-purple-500/20",
    replied: "bg-blue-500/10 text-blue-300 border-blue-500/30 ring-blue-500/20",
    reviewed: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 ring-indigo-500/20",
    draft: "bg-amber-500/10 text-amber-300 border-amber-500/30 ring-amber-500/20",
    new: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 ring-cyan-500/20",
    archived: "bg-slate-800/40 text-slate-400 border-slate-700/60 ring-slate-700/20",
    spam: "bg-rose-500/10 text-rose-400 border-rose-500/30 ring-rose-500/20",
  };

  const dotColors = {
    published: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    qualified: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
    replied: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    reviewed: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
    draft: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    new: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    archived: "bg-slate-500",
    spam: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
  };

  const chipStyle = styles[normalized] || styles.draft;
  const dotColor = dotColors[normalized] || dotColors.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider ${chipStyle}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{status ? status.toUpperCase() : "DRAFT"}</span>
    </span>
  );
}

/**
 * Category Pill with Material Design styling
 */
export function MaterialCategoryChip({ category }) {
  return (
    <span className="inline-block max-w-[140px] truncate rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
      {category || "General"}
    </span>
  );
}

/**
 * MaterialTable Component
 * Provides a Material Design table with proper column distribution,
 * responsive cards, chips, and clean action buttons.
 */
export function MaterialTable({
  data = [],
  emptyMessage = "No records found",
  onArchive,
  onDelete,
  onEdit,
  onTogglePublish,
  pageSize = 10,
  resourceKey = "projects",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center backdrop-blur-xl shadow-xl">
        <p className="text-base font-semibold text-white">{emptyMessage}</p>
        <p className="mt-1 text-sm text-slate-400">
          Try clearing your filters or creating a new record.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/[0.08] bg-white/[0.04] text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Title / Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedData.map((item) => {
              const id = item._id || item.id;
              const title = item.title || item.name || "Untitled";
              const isPublished = item.status === "published";
              const image = item.coverImage || item.imageUrl;
              const liveUrl = item.liveUrl || item.repositoryUrl;

              return (
                <tr className="hover:bg-white/[0.04] transition-colors" key={id}>
                  {/* Title & Link Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {image ? (
                        <img
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover shadow-xs"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          src={image}
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="font-semibold text-white line-clamp-1">{title}</p>
                        {resourceKey === "projects" && liveUrl ? (
                          <a
                            className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:text-cyan-300 hover:underline max-w-xs truncate transition-colors"
                            href={liveUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Globe size={11} />
                            <span className="truncate">{liveUrl}</span>
                            <ExternalLink size={10} />
                          </a>
                        ) : item.slug ? (
                          <p className="font-mono text-xs text-slate-500">/{item.slug}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Category Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <MaterialCategoryChip category={item.category} />
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <MaterialStatusChip status={item.status} />
                  </td>

                  {/* Last Updated Column */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                    {formatDate(item.updatedAt || item.publishedAt || new Date())}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEdit && (
                        <button
                          aria-label="Edit"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-xs hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition"
                          onClick={() => onEdit(item)}
                          type="button"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                      )}

                      {onTogglePublish && (
                        <button
                          aria-label={isPublished ? "Unpublish" : "Publish"}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition ${
                            isPublished
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                          onClick={() => onTogglePublish(item)}
                          type="button"
                        >
                          {isPublished ? <EyeOff size={12} /> : <Eye size={12} />}
                          <span>{isPublished ? "Unpublish" : "Publish"}</span>
                        </button>
                      )}

                      {onArchive && (
                        <button
                          aria-label="Archive"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-30 transition"
                          disabled={item.status === "archived"}
                          onClick={() => onArchive(item)}
                          title="Archive"
                          type="button"
                        >
                          <Archive size={15} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          aria-label="Delete"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                          onClick={() => onDelete(item)}
                          title="Delete Permanently"
                          type="button"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Material Table Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] bg-white/[0.02] px-6 py-3.5 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            aria-label="Rows per page"
            className="rounded-lg border border-white/[0.1] bg-[#071022] px-2.5 py-1 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            value={rowsPerPage}
          >
            <option className="bg-[#050c1a] text-white" value={5}>5</option>
            <option className="bg-[#050c1a] text-white" value={10}>10</option>
            <option className="bg-[#050c1a] text-white" value={25}>25</option>
            <option className="bg-[#050c1a] text-white" value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {totalRows === 0
              ? "0 of 0"
              : `${startIndex + 1}–${Math.min(startIndex + rowsPerPage, totalRows)} of ${totalRows}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous page"
              className="rounded-lg border border-white/[0.1] bg-white/[0.04] p-1.5 text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              disabled={currentPage <= 1}
              onClick={handlePrevPage}
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next page"
              className="rounded-lg border border-white/[0.1] bg-white/[0.04] p-1.5 text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              disabled={currentPage >= totalPages}
              onClick={handleNextPage}
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
