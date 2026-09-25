/**
 * NodeGraphManager — Admin CMS management for the 6 fixed Hero Node Graph points.
 *
 * Fixed 6-node constellation layout:
 * 1. FE // Frontend Systems (Client Architecture)
 * 2. AI // AI & LLM Systems (Machine Intelligence)
 * 3. BE // Backend & APIs (Server Engineering)
 * 4. DB // Data & Storage (Persistence Layer)
 * 5. CL // Cloud & DevOps (Infrastructure)
 * 6. SE // Search & SEO (Search Intelligence)
 *
 * Features:
 * - Real-time animated canvas preview of the 6 nodes
 * - Fully editable labels, abbreviations, categories, descriptions, and skill tags
 * - Visual coordinate adjustment (X: 0-1000, Y: 0-700) and 3D parallax depth
 * - Color pickers with neon palette presets & auto-computed radial gradients
 * - Individual node saving or batch save all
 * - Default reset capabilities
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Network,
  Plus,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from "lucide-react";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { NodeGraph } from "../../components/ui/NodeGraph";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import {
  useAdminCreate,
  useAdminList,
  useAdminPublish,
  useAdminUpdate,
} from "./useAdminData";

/** Standard 6 default nodes in the hero node graph */
const DEFAULT_NODES = [
  {
    displayOrder: 1,
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
  },
  {
    displayOrder: 2,
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
  },
  {
    displayOrder: 3,
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
  },
  {
    displayOrder: 4,
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
  },
  {
    displayOrder: 5,
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
  },
  {
    displayOrder: 6,
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
  },
];

/** Neon preset colors for quick theme assignment */
const COLOR_PRESETS = [
  { label: "Cyan", hex: "#22d3ee", glow: "rgba(34, 211, 238, 0.45)" },
  { label: "Purple", hex: "#c084fc", glow: "rgba(192, 132, 252, 0.45)" },
  { label: "Sky", hex: "#38bdf8", glow: "rgba(56, 189, 248, 0.45)" },
  { label: "Teal", hex: "#2dd4bf", glow: "rgba(45, 212, 191, 0.45)" },
  { label: "Amber", hex: "#fbbf24", glow: "rgba(251, 191, 36, 0.45)" },
  { label: "Emerald", hex: "#34d399", glow: "rgba(52, 211, 153, 0.45)" },
  { label: "Rose", hex: "#fb7185", glow: "rgba(251, 113, 133, 0.45)" },
  { label: "Indigo", hex: "#818cf8", glow: "rgba(129, 140, 248, 0.45)" },
];

function hexToRgba(hex, alpha = 0.45) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 34;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 211;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 238;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function nodeToFormState(node) {
  return {
    _id: node._id || node.id || null,
    nodeId: node.nodeId || node.id || "node",
    label: node.label || "",
    abbr: node.abbr || "",
    category: node.category || "",
    color: node.color || "#22d3ee",
    glowColor: node.glowColor || hexToRgba(node.color || "#22d3ee", 0.45),
    bgGradient:
      node.bgGradient ||
      `radial-gradient(circle at 35% 35%, ${hexToRgba(node.color || "#22d3ee", 0.25)}, ${hexToRgba(
        node.color || "#22d3ee",
        0.06
      )})`,
    x: typeof node.x === "number" ? node.x : 500,
    y: typeof node.y === "number" ? node.y : 350,
    depth: typeof node.depth === "number" ? node.depth : 0.85,
    skills: Array.isArray(node.skills) ? [...node.skills] : [],
    desc: node.desc || "",
    displayOrder: node.displayOrder || 1,
    status: node.status || "published",
  };
}

export function NodeGraphManager() {
  const { data, error, isLoading } = useAdminList("technodes");
  const createMutation = useAdminCreate("technodes");
  const updateMutation = useAdminUpdate("technodes");
  const publishMutation = useAdminPublish("technodes");

  const [nodes, setNodes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [savingIndex, setSavingIndex] = useState(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [newSkillInputs, setNewSkillInputs] = useState({});
  const [showPreview, setShowPreview] = useState(true);

  // Sync API data into form state or fallback to defaults
  useEffect(() => {
    const apiNodes = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    if (apiNodes.length >= 6) {
      const sorted = [...apiNodes].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 6);
      setNodes(sorted.map(nodeToFormState));
    } else if (apiNodes.length > 0) {
      const merged = DEFAULT_NODES.map((def) => {
        const match = apiNodes.find((n) => n.displayOrder === def.displayOrder);
        return match ? nodeToFormState(match) : { ...def, _isNew: true };
      });
      setNodes(merged);
    } else if (!isLoading) {
      setNodes(DEFAULT_NODES.map((n) => ({ ...n, _isNew: true })));
    }
  }, [data, isLoading]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleFieldChange = (index, field, value) => {
    setNodes((prev) => {
      const next = [...prev];
      const updated = { ...next[index], [field]: value };

      // If color changed, update glowColor & bgGradient automatically
      if (field === "color" && typeof value === "string" && value.startsWith("#") && value.length === 7) {
        updated.glowColor = hexToRgba(value, 0.45);
        updated.bgGradient = `radial-gradient(circle at 35% 35%, ${hexToRgba(value, 0.25)}, ${hexToRgba(value, 0.06)})`;
      }

      next[index] = updated;
      return next;
    });
  };

  const handleColorPresetSelect = (index, preset) => {
    setNodes((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        color: preset.hex,
        glowColor: preset.glow,
        bgGradient: `radial-gradient(circle at 35% 35%, ${hexToRgba(preset.hex, 0.25)}, ${hexToRgba(preset.hex, 0.06)})`,
      };
      return next;
    });
  };

  const handleAddSkill = (index) => {
    const rawSkill = (newSkillInputs[index] || "").trim();
    if (!rawSkill) return;

    setNodes((prev) => {
      const next = [...prev];
      const skills = [...(next[index].skills || [])];
      if (!skills.includes(rawSkill)) {
        skills.push(rawSkill);
      }
      next[index] = { ...next[index], skills };
      return next;
    });

    setNewSkillInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveSkill = (nodeIndex, skillIndex) => {
    setNodes((prev) => {
      const next = [...prev];
      const skills = [...(next[nodeIndex].skills || [])];
      skills.splice(skillIndex, 1);
      next[nodeIndex] = { ...next[nodeIndex], skills };
      return next;
    });
  };

  const handleResetToDefault = (index) => {
    const defaultNode = DEFAULT_NODES[index];
    if (!defaultNode) return;

    setNodes((prev) => {
      const next = [...prev];
      const currentId = next[index]._id;
      next[index] = {
        ...defaultNode,
        _id: currentId,
      };
      return next;
    });
    showNotification(`Node 0${index + 1} reset to default template.`);
  };

  const handleSaveNode = async (index) => {
    const node = nodes[index];
    const payload = {
      nodeId: node.nodeId || `node-${index + 1}`,
      label: node.label,
      abbr: node.abbr,
      category: node.category,
      color: node.color,
      glowColor: node.glowColor,
      bgGradient: node.bgGradient,
      x: Number(node.x),
      y: Number(node.y),
      depth: Number(node.depth),
      skills: node.skills || [],
      desc: node.desc,
      displayOrder: node.displayOrder || index + 1,
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    setSavingIndex(index);
    try {
      if (node._id) {
        await updateMutation.mutateAsync({ id: node._id, data: payload });
        try {
          await publishMutation.mutateAsync(node._id);
        } catch {
          // Already published
        }
        showNotification(`Node 0${index + 1} (${node.label}) saved successfully.`);
      } else {
        const res = await createMutation.mutateAsync(payload);
        const createdId = res?.data?._id || res?.data?.id;
        if (createdId) {
          try {
            await publishMutation.mutateAsync(createdId);
          } catch {
            // Already published
          }
        }
        showNotification(`Node 0${index + 1} (${node.label}) created and published live.`);
      }
    } catch (err) {
      showNotification(err.message || `Failed to save Node 0${index + 1}.`, "error");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let successCount = 0;
    try {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const payload = {
          nodeId: node.nodeId || `node-${i + 1}`,
          label: node.label,
          abbr: node.abbr,
          category: node.category,
          color: node.color,
          glowColor: node.glowColor,
          bgGradient: node.bgGradient,
          x: Number(node.x),
          y: Number(node.y),
          depth: Number(node.depth),
          skills: node.skills || [],
          desc: node.desc,
          displayOrder: node.displayOrder || i + 1,
          status: "published",
          publishedAt: new Date().toISOString(),
        };

        if (node._id) {
          await updateMutation.mutateAsync({ id: node._id, data: payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
        successCount++;
      }
      showNotification(`All 6 Node Graph points successfully saved & published live!`);
    } catch (err) {
      showNotification(err.message || `Error saving nodes (saved ${successCount}/6).`, "error");
    } finally {
      setIsSavingAll(false);
    }
  };

  // Memoized nodes formatted for <NodeGraph /> live preview
  const previewNodes = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.nodeId || node.id || `node-${index + 1}`,
      label: node.label || "Untitled",
      abbr: node.abbr || "ND",
      category: node.category || "Category",
      color: node.color || "#22d3ee",
      glowColor: node.glowColor || "rgba(34, 211, 238, 0.45)",
      bgGradient:
        node.bgGradient ||
        "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25), rgba(6,182,212,0.06))",
      x: Number(node.x) || 500,
      y: Number(node.y) || 350,
      depth: Number(node.depth) || 0.85,
      skills: Array.isArray(node.skills) ? node.skills : [],
      desc: node.desc || "",
    }));
  }, [nodes]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Interactive Node Graph — Admin CMS" />

      {/* Header & Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageIntro
          dark={true}
          description="Manage and customize the 6 fixed technology constellation nodes featured on the homepage Hero section. Adjust labels, skill tags, coordinates, and neon glow colors with real-time live preview."
          eyebrow="Interactive Constellation"
          title="Interactive Node Graph"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowPreview((prev) => !prev)}
            type="button"
            variant="secondary"
            className="text-xs"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            {showPreview ? "Hide Live Preview" : "Show Live Preview"}
          </Button>

          <Button
            disabled={isSavingAll || isLoading}
            onClick={handleSaveAll}
            type="button"
            variant="primary"
          >
            {isSavingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving All 6 Nodes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All 6 Nodes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          aria-live="polite"
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
            feedback.type === "error"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
          role="status"
        >
          {feedback.type === "error" ? (
            <Activity className="h-4 w-4 shrink-0" />
          ) : (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Live Visual Canvas Preview */}
      {showPreview && (
        <section className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#050c1a] p-4 sm:p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Live Constellation Preview (Hero Canvas)
              </h3>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Coordinates: 1000 &times; 700 viewBox
            </span>
          </div>

          <div className="h-[380px] sm:h-[420px] w-full rounded-xl bg-[#030712] border border-white/[0.04] relative overflow-hidden">
            <NodeGraph nodes={previewNodes} />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <span>Hover any node in the preview to inspect its live tooltip & skill chips.</span>
            <span className="text-cyan-400 font-medium">6/6 Nodes Operational</span>
          </div>
        </section>
      )}

      {/* Loading / Error States */}
      {isLoading ? (
        <ContentState isLoading={true} />
      ) : error ? (
        <ContentState error={error} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <h2 className="font-display text-lg font-semibold text-white">
              Edit the 6 Fixed Constellation Points
            </h2>
            <span className="font-mono text-xs text-slate-400">
              Exactly 6 Nodes &bull; Display Orders 1 through 6
            </span>
          </div>

          {/* 6 Nodes Accordion Cards */}
          {nodes.map((node, nodeIdx) => {
            const isExpanded = expandedIndex === nodeIdx;
            const isSaving = savingIndex === nodeIdx;
            const orderNum = String(node.displayOrder || nodeIdx + 1).padStart(2, "0");

            return (
              <div
                key={node._id || node.nodeId || nodeIdx}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? "border-cyan-500/40 bg-white/[0.03] shadow-[0_0_24px_rgba(6,182,212,0.1)]"
                    : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.15] hover:bg-white/[0.025]"
                }`}
              >
                {/* Accordion Header */}
                <div
                  className="flex cursor-pointer items-center justify-between p-4 sm:p-5 select-none"
                  onClick={() => setExpandedIndex(isExpanded ? null : nodeIdx)}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Glowing Node Circle Badge Preview */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-md"
                      style={{
                        background: node.bgGradient,
                        borderColor: `${node.color}80`,
                        boxShadow: `0 0 14px ${node.glowColor}`,
                      }}
                    >
                      <span
                        className="font-mono text-xs font-bold tracking-wider"
                        style={{ color: node.color }}
                      >
                        {node.abbr || "ND"}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          NODE {orderNum} // {node.category || "TECHNOLOGY DOMAIN"}
                        </span>
                        {node._isNew && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[10px] text-amber-300 border border-amber-500/30">
                            Unsaved
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                        {node.label || "Untitled Node"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mini coordinates badge */}
                    <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                      <Sliders className="h-3 w-3 text-cyan-400" />
                      <span>X:{node.x}</span>
                      <span>Y:{node.y}</span>
                    </div>

                    <button
                      aria-label={isExpanded ? "Collapse node" : "Expand node"}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
                      type="button"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Accordion Expanded Body */}
                {isExpanded && (
                  <div className="border-t border-white/[0.08] p-5 sm:p-6 space-y-6 bg-slate-950/40">
                    {/* Row 1: Label, Abbr, Category */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block font-mono text-xs font-medium text-slate-300">
                          Node Title / Label <span className="text-rose-400">*</span>
                        </label>
                        <Input
                          onChange={(e) => handleFieldChange(nodeIdx, "label", e.target.value)}
                          placeholder="e.g. Frontend Systems"
                          value={node.label}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block font-mono text-xs font-medium text-slate-300">
                          Abbreviation (2-4 chars) <span className="text-rose-400">*</span>
                        </label>
                        <Input
                          maxLength={4}
                          onChange={(e) => handleFieldChange(nodeIdx, "abbr", e.target.value.toUpperCase())}
                          placeholder="e.g. FE"
                          value={node.abbr}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block font-mono text-xs font-medium text-slate-300">
                          Category / Subtitle <span className="text-rose-400">*</span>
                        </label>
                        <Input
                          onChange={(e) => handleFieldChange(nodeIdx, "category", e.target.value)}
                          placeholder="e.g. Client Architecture"
                          value={node.category}
                        />
                      </div>
                    </div>

                    {/* Row 2: Description Tooltip */}
                    <div>
                      <label className="mb-1.5 block font-mono text-xs font-medium text-slate-300">
                        Architectural Description (Hover Tooltip Content)
                      </label>
                      <Textarea
                        className="h-20 resize-none text-sm"
                        onChange={(e) => handleFieldChange(nodeIdx, "desc", e.target.value)}
                        placeholder="Brief summary of technical purpose shown on node hover..."
                        value={node.desc}
                      />
                    </div>

                    {/* Row 3: Color Themes & Presets */}
                    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                          Neon Theme & Glow Color
                        </label>
                        <span className="font-mono text-[11px] text-slate-400">
                          Auto-generates SVG connector glow and ambient gradient
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition border ${
                              node.color?.toLowerCase() === preset.hex.toLowerCase()
                                ? "border-white bg-white/15 text-white shadow-sm"
                                : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]"
                            }`}
                            onClick={() => handleColorPresetSelect(nodeIdx, preset)}
                            type="button"
                          >
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: preset.hex }}
                            />
                            {preset.label}
                          </button>
                        ))}

                        {/* Custom Color Input */}
                        <div className="flex items-center gap-2 pl-2">
                          <input
                            aria-label="Custom Hex Color"
                            className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent"
                            onChange={(e) => handleFieldChange(nodeIdx, "color", e.target.value)}
                            type="color"
                            value={node.color || "#22d3ee"}
                          />
                          <Input
                            className="h-7 w-24 font-mono text-xs"
                            onChange={(e) => handleFieldChange(nodeIdx, "color", e.target.value)}
                            placeholder="#22d3ee"
                            value={node.color}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Coordinates & Parallax Depth */}
                    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                          Constellation Coordinates & 3D Depth
                        </label>
                        <span className="font-mono text-[11px] text-slate-400">
                          Center: (500, 350)
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 pt-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs text-slate-300">X Position (0 - 1000)</span>
                            <span className="font-mono text-xs text-cyan-400 font-semibold">{node.x}px</span>
                          </div>
                          <input
                            aria-label="X Coordinate"
                            className="w-full accent-cyan-400 cursor-pointer"
                            max={950}
                            min={50}
                            onChange={(e) => handleFieldChange(nodeIdx, "x", Number(e.target.value))}
                            step={10}
                            type="range"
                            value={node.x}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs text-slate-300">Y Position (0 - 700)</span>
                            <span className="font-mono text-xs text-cyan-400 font-semibold">{node.y}px</span>
                          </div>
                          <input
                            aria-label="Y Coordinate"
                            className="w-full accent-cyan-400 cursor-pointer"
                            max={650}
                            min={50}
                            onChange={(e) => handleFieldChange(nodeIdx, "y", Number(e.target.value))}
                            step={10}
                            type="range"
                            value={node.y}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs text-slate-300">Parallax Depth</span>
                            <span className="font-mono text-xs text-purple-400 font-semibold">{node.depth}</span>
                          </div>
                          <input
                            aria-label="3D Parallax Depth"
                            className="w-full accent-purple-400 cursor-pointer"
                            max={1.0}
                            min={0.5}
                            onChange={(e) => handleFieldChange(nodeIdx, "depth", Number(e.target.value))}
                            step={0.05}
                            type="range"
                            value={node.depth}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Skill Chips Tags List */}
                    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Network className="h-3.5 w-3.5 text-cyan-400" />
                          Technology & Skill Tags
                        </label>
                        <span className="font-mono text-[11px] text-slate-400">
                          Displayed inside the hover tooltip card
                        </span>
                      </div>

                      {/* Current skill chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(node.skills || []).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-200 shadow-sm"
                          >
                            <span>{skill}</span>
                            <button
                              aria-label={`Remove ${skill}`}
                              className="text-slate-400 hover:text-rose-400 transition-colors"
                              onClick={() => handleRemoveSkill(nodeIdx, sIdx)}
                              type="button"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add skill input */}
                      <div className="flex items-center gap-2 pt-2">
                        <Input
                          className="h-8 max-w-xs font-mono text-xs"
                          onChange={(e) =>
                            setNewSkillInputs((prev) => ({ ...prev, [nodeIdx]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill(nodeIdx);
                            }
                          }}
                          placeholder="e.g. React 19, LangChain..."
                          value={newSkillInputs[nodeIdx] || ""}
                        />
                        <Button
                          className="h-8 text-xs"
                          onClick={() => handleAddSkill(nodeIdx)}
                          type="button"
                          variant="secondary"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Skill
                        </Button>
                      </div>
                    </div>

                    {/* Node Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                      <button
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-amber-400 transition-colors"
                        onClick={() => handleResetToDefault(nodeIdx)}
                        type="button"
                      >
                        <RotateCcw size={13} />
                        Reset Node to Default
                      </button>

                      <div className="flex items-center gap-3">
                        <Button
                          disabled={isSaving || isSavingAll}
                          onClick={() => handleSaveNode(nodeIdx)}
                          type="button"
                          variant="primary"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Node {orderNum}...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Node {orderNum}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        <Link
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          to="/admin"
        >
          &larr; Back to Admin Dashboard
        </Link>
        <Button
          disabled={isSavingAll || isLoading}
          onClick={handleSaveAll}
          type="button"
          variant="primary"
        >
          <Save className="mr-2 h-4 w-4" />
          Save All 6 Nodes Live
        </Button>
      </div>
    </div>
  );
}
