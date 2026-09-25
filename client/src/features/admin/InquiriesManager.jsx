import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { MaterialStatusChip } from "../../components/ui/MaterialTable";
import { Modal } from "../../components/ui/Modal";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { Tabs } from "../../components/ui/Tabs";
import { formatDate } from "../../utils/formatters";
import { useAdminInquiries, useAdminUpdateInquiry } from "./useAdminData";

const INQUIRY_STATUSES = [
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Qualified", value: "qualified" },
  { label: "Replied", value: "replied" },
  { label: "Archived", value: "archived" },
  { label: "Spam", value: "spam" },
];

export function InquiriesManager() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");

  const { data, error, isLoading } = useAdminInquiries({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const updateInquiryMutation = useAdminUpdateInquiry();

  const rawInquiries = useMemo(() => {
    return Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
  }, [data]);

  const inquiries = useMemo(() => {
    return rawInquiries.filter((inquiry) => {
      if (statusFilter !== "all" && inquiry.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (inquiry.name || "").toLowerCase().includes(query);
        const emailMatch = (inquiry.email || "").toLowerCase().includes(query);
        const orgMatch = (inquiry.organization || "").toLowerCase().includes(query);
        const subjectMatch = (inquiry.subject || "").toLowerCase().includes(query);
        const messageMatch = (inquiry.message || "").toLowerCase().includes(query);
        return nameMatch || emailMatch || orgMatch || subjectMatch || messageMatch;
      }
      return true;
    });
  }, [rawInquiries, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: rawInquiries.length,
      new: rawInquiries.filter((i) => i.status === "new").length,
      reviewed: rawInquiries.filter((i) => i.status === "reviewed").length,
      qualified: rawInquiries.filter((i) => i.status === "qualified").length,
      replied: rawInquiries.filter((i) => i.status === "replied").length,
      archived: rawInquiries.filter((i) => i.status === "archived").length,
      spam: rawInquiries.filter((i) => i.status === "spam").length,
    };
  }, [rawInquiries]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenDetail = (inquiry) => {
    setActiveInquiry(inquiry);
    setSelectedNewStatus(inquiry.status || "new");
  };

  const handleSaveStatus = async () => {
    if (!activeInquiry) return;
    const id = activeInquiry._id || activeInquiry.id;
    try {
      await updateInquiryMutation.mutateAsync({
        id,
        status: selectedNewStatus,
      });
      showNotification(`Inquiry status updated to ${selectedNewStatus}.`);
      setActiveInquiry((prev) => (prev ? { ...prev, status: selectedNewStatus } : null));
    } catch (err) {
      showNotification(err.message || "Failed to update inquiry status.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Messages & Inquiries" />

      <PageIntro
        dark={true}
        description="Review incoming client, recruiter, and partner inquiries with qualification and response workflows."
        eyebrow="Communications"
        title="Messages & Inquiries"
      />

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
          activeTab={statusFilter}
          onChange={setStatusFilter}
          tabs={[
            { id: "all", label: `All (${counts.all})` },
            { id: "new", label: `New (${counts.new})` },
            { id: "qualified", label: `Qualified (${counts.qualified})` },
            { id: "replied", label: `Replied (${counts.replied})` },
            { id: "archived", label: `Archived (${counts.archived})` },
          ]}
        />
        <div className="w-full sm:w-72">
          <SearchInput
            aria-label="Search inquiries"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search messages & senders..."
            value={searchQuery}
          />
        </div>
      </div>

      {/* Messages Table Card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-2xl backdrop-blur-xl">
        {isLoading || error ? (
          <ContentState error={error} isLoading={isLoading} />
        ) : inquiries.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-base font-semibold text-white">No messages found</p>
            <p className="mt-1 text-sm">
              No messages match the current status filter or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/[0.08] bg-white/[0.04] text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject & Message</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Received</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {inquiries.map((item) => {
                  const id = item._id || item.id;
                  const previewText = item.message
                    ? item.message.length > 80
                      ? `${item.message.slice(0, 80)}...`
                      : item.message
                    : "No message text";

                  return (
                    <tr className="hover:bg-white/[0.04] transition-colors" key={id}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="font-mono text-xs text-slate-400">{item.email}</div>
                        {item.organization && (
                          <div className="text-xs font-medium text-cyan-400/80">
                            {item.organization}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {item.subject && (
                          <div className="font-medium text-white truncate">
                            {item.subject}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 line-clamp-2">
                          {previewText}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-mono font-medium uppercase tracking-wide text-slate-300">
                          {item.inquiryType || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <MaterialStatusChip status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                        {formatDate(item.createdAt || new Date())}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-xs hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition"
                          onClick={() => handleOpenDetail(item)}
                          type="button"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Link className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/admin">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Inquiry Detail Modal */}
      {activeInquiry && (
        <Modal
          className="max-w-2xl"
          description={`Received on ${formatDate(activeInquiry.createdAt || new Date())}`}
          isOpen={Boolean(activeInquiry)}
          onClose={() => setActiveInquiry(null)}
          title={`Inquiry from ${activeInquiry.name}`}
        >
          <div className="space-y-6 pt-2">
            {/* Sender Metadata Banner */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-mono font-medium uppercase text-slate-400">Email</span>
                  <p className="font-semibold text-white">
                    <a className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors" href={`mailto:${activeInquiry.email}`}>
                      {activeInquiry.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-xs font-mono font-medium uppercase text-slate-400">Organization</span>
                  <p className="font-semibold text-white">{activeInquiry.organization || "N/A"}</p>
                </div>
                <div>
                  <span className="text-xs font-mono font-medium uppercase text-slate-400">Inquiry Type</span>
                  <p className="capitalize font-semibold text-white">{activeInquiry.inquiryType || "General"}</p>
                </div>
                <div>
                  <span className="text-xs font-mono font-medium uppercase text-slate-400">Timeline & Budget</span>
                  <p className="font-semibold text-white">
                    {activeInquiry.budgetRange || "Standard"} / {activeInquiry.timeline || "Flexible"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject and Message Content */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white">
                {activeInquiry.subject || "Message Body"}
              </h3>
              <div className="rounded-xl border border-white/[0.08] bg-[#050c1a] p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {activeInquiry.message}
              </div>
            </div>

            {/* Status Modification Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-t border-white/[0.08] pt-4">
              <div className="w-full sm:w-60">
                <Select
                  label="Update Inquiry Status"
                  onChange={(e) => setSelectedNewStatus(e.target.value)}
                  options={INQUIRY_STATUSES}
                  value={selectedNewStatus}
                />
              </div>
              <div className="flex items-center gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm hover:bg-white/[0.08] hover:text-white transition"
                  href={`mailto:${activeInquiry.email}?subject=Re: ${encodeURIComponent(activeInquiry.subject || "Your Inquiry")}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Reply via Email &rarr;
                </a>
                <Button
                  disabled={updateInquiryMutation.isPending || selectedNewStatus === activeInquiry.status}
                  onClick={handleSaveStatus}
                >
                  {updateInquiryMutation.isPending ? "Updating..." : "Save Status"}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
