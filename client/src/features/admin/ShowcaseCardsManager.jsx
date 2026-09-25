/**
 * ShowcaseCardsManager — Admin page to edit the 4 fixed homepage showcase node cards.
 *
 * Fixed 4-card layout: admin can only edit content (not add/delete).
 * Each card has: nodeLabel, nodeTag, title, description, and a list of items
 * (each item has label, tag, description).
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import {
  useAdminCreate,
  useAdminList,
  useAdminPublish,
  useAdminUpdate,
} from "./useAdminData";

/** Default card data used when no CMS records exist yet */
const DEFAULT_CARDS = [
  {
    displayOrder: 1,
    nodeLabel: "NODE 01 // TOPOLOGY",
    nodeTag: "",
    title: "Systems Engineered",
    description:
      "Production digital systems architected for resilience, low latency, and continuous scale.",
    items: [
      { label: "Web Applications", tag: "Next.js · React 19 · Sub-Second LCP", description: "" },
      { label: "SaaS Platforms", tag: "Multi-Tenant · RBAC · Stripe · MongoDB", description: "" },
      { label: "AI Systems", tag: "LLM Pipelines · RAG · Vector Retrieval", description: "" },
      { label: "Digital Products", tag: "End-to-End Delivery · CI/CD · Cloud Native", description: "" },
    ],
  },
  {
    displayOrder: 2,
    nodeLabel: "NODE 02 // PROGRESSION",
    nodeTag: "EVOLUTION PIPELINE",
    title: "Engineering Evolution",
    description:
      "From pixel-perfect client interfaces to resilient cloud backends and autonomous AI agents.",
    items: [
      { label: "Frontend Engineering", tag: "UI & INTERACTION", description: "Vercel aesthetics · 60fps micro-interactions · React 19" },
      { label: "Backend Architecture", tag: "SERVICES & DATA", description: "Node.js · Distributed APIs · High-throughput pipelines" },
      { label: "Cloud Systems", tag: "INFRASTRUCTURE", description: "Docker containerization · Redis caching · 99.9% Uptime" },
      { label: "Artificial Intelligence", tag: "INTELLIGENT SYSTEMS", description: "LLM agents · RAG pipelines · Autonomous workflows" },
    ],
  },
  {
    displayOrder: 3,
    nodeLabel: "NODE 03 // CONSTELLATION",
    nodeTag: "INTERACTIVE CLUSTER",
    title: "Technology Domains",
    description:
      "Hover a domain to inspect its architectural purpose and technical execution.",
    items: [
      { label: "AI", tag: "Intelligent Systems", description: "Autonomous AI agents, vector retrieval, embeddings, and context window optimization." },
      { label: "LLM", tag: "Language Models", description: "Tool usage, structured JSON output validation, and low-latency streaming responses." },
      { label: "React", tag: "Client Tier", description: "React 19, custom hook architectures, optimistic UI updates, and 60fps animations." },
      { label: "Next.js", tag: "Full-Stack Web", description: "Sub-second LCP, zero-bundle-size server logic, dynamic routing, and CDN caching." },
      { label: "Node.js", tag: "Backend Services", description: "Event-driven asynchronous processing, resilient error boundaries, and streaming I/O." },
      { label: "Cloud", tag: "Infrastructure", description: "Docker container workflows, Redis caching layers, microservices, and 99.9% SLAs." },
      { label: "Databases", tag: "Data Layer", description: "MongoDB Atlas indexing, aggregation pipelines, transaction atomicity, and query tuning." },
      { label: "SEO", tag: "Search Intelligence", description: "Schema.org JSON-LD, crawl optimization, dynamic sitemaps, and Core Web Vitals." },
    ],
  },
  {
    displayOrder: 4,
    nodeLabel: "NODE 04 // METHODOLOGY",
    nodeTag: "PROBLEM-SOLVING FRAMEWORK",
    title: "Architecture Mindset",
    description:
      "How I think and execute: from initial ambiguity to resilient, high-impact software systems.",
    items: [
      { label: "Problem", tag: "01", description: "Dissect core challenge, user friction, latency bottlenecks & scale goals." },
      { label: "Architecture", tag: "02", description: "Design data flow, API boundaries, state machines, and failover fallbacks." },
      { label: "Implementation", tag: "03", description: "Clean modular code, automated tests, atomic transactions & zero regressions." },
      { label: "Impact", tag: "04", description: "Sub-second speed, zero downtime, high user retention, and business growth." },
    ],
  },
];

export function ShowcaseCardsManager() {
  const { data, error, isLoading } = useAdminList("showcasecards");
  const createMutation = useAdminCreate("showcasecards");
  const updateMutation = useAdminUpdate("showcasecards");
  const publishMutation = useAdminPublish("showcasecards");

  const [cards, setCards] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(null); // index of card being saved
  const [expandedCard, setExpandedCard] = useState(0);

  // Sync CMS data into local state, falling back to defaults
  useEffect(() => {
    const apiCards = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    if (apiCards.length >= 4) {
      // Sort by displayOrder and take only 4
      const sorted = [...apiCards].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);
      setCards(sorted.map(cardToFormState));
    } else if (apiCards.length > 0) {
      // Merge partial API data with defaults
      const merged = DEFAULT_CARDS.map((def) => {
        const match = apiCards.find((c) => c.displayOrder === def.displayOrder);
        return match ? cardToFormState(match) : { ...def, _isNew: true };
      });
      setCards(merged);
    } else if (!isLoading) {
      setCards(DEFAULT_CARDS.map((c) => ({ ...c, _isNew: true })));
    }
  }, [data, isLoading]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFieldChange = (cardIdx, field, value) => {
    setCards((prev) => {
      const next = [...prev];
      next[cardIdx] = { ...next[cardIdx], [field]: value };
      return next;
    });
  };

  const handleItemChange = (cardIdx, itemIdx, field, value) => {
    setCards((prev) => {
      const next = [...prev];
      const items = [...(next[cardIdx].items || [])];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      next[cardIdx] = { ...next[cardIdx], items };
      return next;
    });
  };

  const handleAddItem = (cardIdx) => {
    setCards((prev) => {
      const next = [...prev];
      const items = [...(next[cardIdx].items || []), { label: "", tag: "", description: "" }];
      next[cardIdx] = { ...next[cardIdx], items };
      return next;
    });
  };

  const handleRemoveItem = (cardIdx, itemIdx) => {
    setCards((prev) => {
      const next = [...prev];
      const items = [...(next[cardIdx].items || [])];
      items.splice(itemIdx, 1);
      next[cardIdx] = { ...next[cardIdx], items };
      return next;
    });
  };

  const handleSaveCard = async (cardIdx) => {
    const card = cards[cardIdx];
    const payload = {
      nodeLabel: card.nodeLabel,
      nodeTag: card.nodeTag,
      title: card.title,
      description: card.description,
      items: (card.items || []).filter((i) => i.label.trim()),
      displayOrder: card.displayOrder,
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    setSaving(cardIdx);
    try {
      if (card._id || card.id) {
        const id = card._id || card.id;
        await updateMutation.mutateAsync({ id, data: payload });
        // Ensure published
        try {
          await publishMutation.mutateAsync(id);
        } catch {
          // Already published, ignore
        }
        showNotification(`Card ${cardIdx + 1} "${card.title}" saved successfully.`);
      } else {
        await createMutation.mutateAsync(payload);
        showNotification(`Card ${cardIdx + 1} "${card.title}" created and published.`);
      }
    } catch (err) {
      showNotification(err.message || "Failed to save card.", "error");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Showcase Cards — Admin" />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageIntro
          dark={true}
          description="Edit the 4 homepage Engineering Intelligence System node cards. Changes go live immediately after saving."
          eyebrow="Content Operations"
          title="Showcase Cards"
        />
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

      {isLoading || error ? (
        <ContentState error={error} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          {cards.map((card, cardIdx) => (
            <div
              key={card.displayOrder}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-all duration-300"
            >
              {/* Card Header — always visible, click to expand */}
              <button
                type="button"
                onClick={() => setExpandedCard(expandedCard === cardIdx ? -1 : cardIdx)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
                    {card.displayOrder}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{card.title || "Untitled Card"}</h3>
                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">{card.nodeLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {card._id || card.id ? (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      PUBLISHED
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                      NOT SAVED
                    </span>
                  )}
                  {expandedCard === cardIdx ? (
                    <ChevronUp className="text-slate-400" size={18} />
                  ) : (
                    <ChevronDown className="text-slate-400" size={18} />
                  )}
                </div>
              </button>

              {/* Expanded Card Editor */}
              {expandedCard === cardIdx && (
                <div className="border-t border-white/[0.06] px-6 py-6 space-y-6">
                  {/* Card-level fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Node Label"
                      placeholder="e.g. NODE 01 // TOPOLOGY"
                      value={card.nodeLabel}
                      onChange={(e) => handleFieldChange(cardIdx, "nodeLabel", e.target.value)}
                    />
                    <Input
                      label="Node Tag (optional)"
                      placeholder="e.g. EVOLUTION PIPELINE"
                      value={card.nodeTag}
                      onChange={(e) => handleFieldChange(cardIdx, "nodeTag", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Title"
                    placeholder="e.g. Systems Engineered"
                    value={card.title}
                    onChange={(e) => handleFieldChange(cardIdx, "title", e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Short description for this card..."
                    rows={2}
                    value={card.description}
                    onChange={(e) => handleFieldChange(cardIdx, "description", e.target.value)}
                  />

                  {/* Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Items ({(card.items || []).length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAddItem(cardIdx)}
                        className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      >
                        <Plus size={14} /> Add Item
                      </button>
                    </div>

                    {(card.items || []).map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500">
                            ITEM {String(itemIdx + 1).padStart(2, "0")}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(cardIdx, itemIdx)}
                            className="rounded-md p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            label="Label"
                            placeholder="e.g. Web Applications"
                            value={item.label}
                            onChange={(e) => handleItemChange(cardIdx, itemIdx, "label", e.target.value)}
                          />
                          <Input
                            label="Tag / Badge"
                            placeholder="e.g. UI & INTERACTION"
                            value={item.tag}
                            onChange={(e) => handleItemChange(cardIdx, itemIdx, "tag", e.target.value)}
                          />
                        </div>
                        <Textarea
                          label="Description (optional)"
                          placeholder="Bullet points or short description..."
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleItemChange(cardIdx, itemIdx, "description", e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      disabled={saving === cardIdx}
                      onClick={() => handleSaveCard(cardIdx)}
                      variant="primary"
                    >
                      {saving === cardIdx ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2" size={16} />
                          Save Card {cardIdx + 1}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Link
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          to="/admin"
        >
          &larr; Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}

/** Convert a MongoDB document to a form-friendly state object */
function cardToFormState(doc) {
  return {
    _id: doc._id || doc.id,
    id: doc.id || doc._id,
    displayOrder: doc.displayOrder,
    nodeLabel: doc.nodeLabel || "",
    nodeTag: doc.nodeTag || "",
    title: doc.title || "",
    description: doc.description || "",
    items: (doc.items || []).map((item) => ({
      label: item.label || "",
      tag: item.tag || "",
      description: item.description || "",
    })),
    status: doc.status || "draft",
  };
}
