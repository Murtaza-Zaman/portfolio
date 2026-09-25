/**
 * HeroManager — Admin CMS page to edit the Hero section, Glowing Social Links,
 * and Philosophy (Professional Approach) section.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Sparkles,
  Link2,
  Layers,
  User,
  Palette,
  Eye,
  Compass,
} from "lucide-react";

import { ContentState } from "../../components/common/ContentState";
import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { SocialGlowButton } from "../../components/ui/SocialGlowButton";
import {
  useAdminCreate,
  useAdminList,
  useAdminPublish,
  useAdminUpdate,
} from "./useAdminData";

const COLOR_OPTIONS = [
  { id: "cyan", label: "Cyan Glow", class: "bg-cyan-500 text-slate-950" },
  { id: "purple", label: "Purple Glow", class: "bg-purple-500 text-white" },
  { id: "sky", label: "Sky Blue Glow", class: "bg-sky-500 text-white" },
  { id: "emerald", label: "Emerald Glow", class: "bg-emerald-500 text-slate-950" },
  { id: "amber", label: "Amber Glow", class: "bg-amber-500 text-slate-950" },
  { id: "rose", label: "Rose Glow", class: "bg-rose-500 text-white" },
];

const PLATFORM_OPTIONS = [
  "GitHub",
  "LinkedIn",
  "Twitter",
  "WhatsApp",
  "Instagram",
  "YouTube",
  "Discord",
  "Email",
  "Website",
];

const DEFAULT_PHILOSOPHY_STEPS = [
  {
    n: "01",
    label: "Problem",
    desc: "Understand the business challenge, constraints, and what success actually looks like.",
  },
  {
    n: "02",
    label: "Architecture",
    desc: "Design the right system — not the most complex one. Trade-offs documented, options weighed.",
  },
  {
    n: "03",
    label: "Implementation",
    desc: "Build with engineering discipline. Clean code, tested, observable, deployable from day one.",
  },
  {
    n: "04",
    label: "Impact",
    desc: "Connect every technical decision back to a measurable business or user outcome.",
  },
];

const DEFAULT_HERO_STATE = {
  name: "Murtaza Zaman",
  title: "Future Technology Builder",
  slug: "murtaza-zaman",
  badgeText: "Available for Projects",
  badgeActive: true,
  scriptTag: "Full-Stack Engineer",
  nameLine1: "MURTAZA",
  nameLine2: "ZAMAN",
  rolePrefix: "Future Technology Builder",
  roleSkills: [
    "Technical SEO Strategy",
    "AI Systems Integration",
    "Full-Stack Architecture",
    "Cloud Infrastructure",
  ],
  summary:
    "Full-stack software engineer and AI integration specialist building scalable web applications, SaaS platforms, and intelligent digital systems.",
  heroSkills: [
    "React / Next.js",
    "Node.js",
    "AI Integrations",
    "Cloud Arch",
    "Technical SEO",
  ],
  primaryCtaText: "Explore My Work",
  primaryCtaLink: "/projects",
  secondaryCtaText: "Start a Conversation",
  secondaryCtaLink: "/contact",
  socialLinks: [
    { platform: "GitHub", label: "GitHub", url: "https://github.com/murtazazaman", color: "cyan" },
    { platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/in/murtazazaman", color: "sky" },
    { platform: "Twitter", label: "Twitter / X", url: "https://twitter.com/murtazazaman", color: "purple" },
    { platform: "WhatsApp", label: "WhatsApp", url: "https://wa.me/923369406373", color: "emerald" },
  ],
  philosophyEyebrow: "Professional Approach",
  philosophyHeading: "Technology should move a real problem forward.",
  philosophyDescription:
    "Understand the challenge, shape the right architecture, build with engineering discipline, and connect it to a measurable outcome.",
  philosophyLinkLabel: "Engineering background",
  philosophyLinkUrl: "/about",
  philosophySteps: DEFAULT_PHILOSOPHY_STEPS,
};

export function HeroManager() {
  const { data, error, isLoading } = useAdminList("profiles");
  const createMutation = useAdminCreate("profiles");
  const updateMutation = useAdminUpdate("profiles");
  const publishMutation = useAdminPublish("profiles");

  const [formState, setFormState] = useState(DEFAULT_HERO_STATE);
  const [profileId, setProfileId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sync CMS data into local state
  useEffect(() => {
    const profiles = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    if (profiles.length > 0) {
      const p = profiles[0];
      setProfileId(p._id || p.id);
      setFormState({
        name: p.name || DEFAULT_HERO_STATE.name,
        title: p.title || DEFAULT_HERO_STATE.title,
        slug: p.slug || DEFAULT_HERO_STATE.slug,
        badgeText: p.badgeText || DEFAULT_HERO_STATE.badgeText,
        badgeActive: p.badgeActive !== undefined ? p.badgeActive : DEFAULT_HERO_STATE.badgeActive,
        scriptTag: p.scriptTag || DEFAULT_HERO_STATE.scriptTag,
        nameLine1: p.nameLine1 || DEFAULT_HERO_STATE.nameLine1,
        nameLine2: p.nameLine2 || DEFAULT_HERO_STATE.nameLine2,
        rolePrefix: p.rolePrefix || DEFAULT_HERO_STATE.rolePrefix,
        roleSkills: Array.isArray(p.roleSkills) && p.roleSkills.length > 0
          ? p.roleSkills
          : DEFAULT_HERO_STATE.roleSkills,
        summary: p.summary || DEFAULT_HERO_STATE.summary,
        heroSkills: Array.isArray(p.heroSkills) && p.heroSkills.length > 0
          ? p.heroSkills
          : DEFAULT_HERO_STATE.heroSkills,
        primaryCtaText: p.primaryCtaText || DEFAULT_HERO_STATE.primaryCtaText,
        primaryCtaLink: p.primaryCtaLink || DEFAULT_HERO_STATE.primaryCtaLink,
        secondaryCtaText: p.secondaryCtaText || DEFAULT_HERO_STATE.secondaryCtaText,
        secondaryCtaLink: p.secondaryCtaLink || DEFAULT_HERO_STATE.secondaryCtaLink,
        socialLinks: Array.isArray(p.socialLinks) && p.socialLinks.length > 0
          ? p.socialLinks.map((s) => ({
              platform: s.platform || "Custom",
              label: s.label || s.platform || "Link",
              url: s.url || "",
              color: s.color || "cyan",
            }))
          : DEFAULT_HERO_STATE.socialLinks,
        philosophyEyebrow: p.philosophyEyebrow || DEFAULT_HERO_STATE.philosophyEyebrow,
        philosophyHeading: p.philosophyHeading || DEFAULT_HERO_STATE.philosophyHeading,
        philosophyDescription: p.philosophyDescription || DEFAULT_HERO_STATE.philosophyDescription,
        philosophyLinkLabel: p.philosophyLinkLabel || DEFAULT_HERO_STATE.philosophyLinkLabel,
        philosophyLinkUrl: p.philosophyLinkUrl || DEFAULT_HERO_STATE.philosophyLinkUrl,
        philosophySteps: Array.isArray(p.philosophySteps) && p.philosophySteps.length > 0
          ? p.philosophySteps
          : DEFAULT_HERO_STATE.philosophySteps,
      });
    }
  }, [data]);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  /* ── Role Skills helpers ── */
  const handleAddRoleSkill = () => {
    setFormState((prev) => ({
      ...prev,
      roleSkills: [...prev.roleSkills, ""],
    }));
  };

  const handleUpdateRoleSkill = (index, value) => {
    setFormState((prev) => {
      const copy = [...prev.roleSkills];
      copy[index] = value;
      return { ...prev, roleSkills: copy };
    });
  };

  const handleRemoveRoleSkill = (index) => {
    setFormState((prev) => {
      const copy = [...prev.roleSkills];
      copy.splice(index, 1);
      return { ...prev, roleSkills: copy };
    });
  };

  /* ── Tech Stack Chips helpers ── */
  const handleAddHeroSkill = () => {
    setFormState((prev) => ({
      ...prev,
      heroSkills: [...prev.heroSkills, ""],
    }));
  };

  const handleUpdateHeroSkill = (index, value) => {
    setFormState((prev) => {
      const copy = [...prev.heroSkills];
      copy[index] = value;
      return { ...prev, heroSkills: copy };
    });
  };

  const handleRemoveHeroSkill = (index) => {
    setFormState((prev) => {
      const copy = [...prev.heroSkills];
      copy.splice(index, 1);
      return { ...prev, heroSkills: copy };
    });
  };

  /* ── Social Links helpers ── */
  const handleAddSocialLink = () => {
    setFormState((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: "GitHub", label: "GitHub", url: "", color: "cyan" },
      ],
    }));
  };

  const handleUpdateSocialLink = (index, field, value) => {
    setFormState((prev) => {
      const copy = [...prev.socialLinks];
      copy[index] = { ...copy[index], [field]: value };
      if (field === "platform" && !copy[index].label) {
        copy[index].label = value;
      }
      return { ...prev, socialLinks: copy };
    });
  };

  const handleRemoveSocialLink = (index) => {
    setFormState((prev) => {
      const copy = [...prev.socialLinks];
      copy.splice(index, 1);
      return { ...prev, socialLinks: copy };
    });
  };

  /* ── Philosophy Steps helpers ── */
  const handleAddPhilosophyStep = () => {
    setFormState((prev) => {
      const count = prev.philosophySteps.length + 1;
      const numStr = String(count).padStart(2, "0");
      return {
        ...prev,
        philosophySteps: [
          ...prev.philosophySteps,
          { n: numStr, label: "", desc: "" },
        ],
      };
    });
  };

  const handleUpdatePhilosophyStep = (index, field, value) => {
    setFormState((prev) => {
      const copy = [...prev.philosophySteps];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, philosophySteps: copy };
    });
  };

  const handleRemovePhilosophyStep = (index) => {
    setFormState((prev) => {
      const copy = [...prev.philosophySteps];
      copy.splice(index, 1);
      return { ...prev, philosophySteps: copy };
    });
  };

  /* ── Save mutation ── */
  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);

    const payload = {
      ...formState,
      name: `${formState.nameLine1} ${formState.nameLine2}`.trim() || formState.name,
      roleSkills: formState.roleSkills.filter((s) => s.trim()),
      heroSkills: formState.heroSkills.filter((s) => s.trim()),
      socialLinks: formState.socialLinks.filter((s) => s.url.trim()),
      philosophySteps: formState.philosophySteps.filter((s) => s.label.trim()),
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    try {
      if (profileId) {
        await updateMutation.mutateAsync({ id: profileId, data: payload });
        try {
          await publishMutation.mutateAsync(profileId);
        } catch {
          // Ignore if already published
        }
        showNotification("Hero & Philosophy customizations saved successfully!");
      } else {
        const created = await createMutation.mutateAsync(payload);
        const newId = created.data?.id || created.data?._id || created.id;
        setProfileId(newId);
        showNotification("Hero & Philosophy created and published successfully!");
      }
    } catch (err) {
      showNotification(err.message || "Failed to save customizations.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-6 lg:px-8">
      <Seo title="Hero & Philosophy — Admin" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageIntro
          dark={true}
          description="Edit hero section text, typography, glowing social media links, call-to-actions, and the Philosophy & Engineering Approach section."
          eyebrow="Homepage Customization"
          title="Hero & Philosophy Section"
        />
        <Button
          disabled={saving}
          onClick={handleSave}
          variant="primary"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2" size={16} />
              Save All Changes
            </>
          )}
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

      {isLoading || error ? (
        <ContentState error={error} isLoading={isLoading} />
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Identity & Name Display */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
              <User className="text-cyan-400" size={18} />
              <h3 className="text-base font-semibold text-white">Hero Identity & Name Typography</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Availability Status Badge"
                placeholder="e.g. AVAILABLE FOR PROJECTS"
                value={formState.badgeText}
                onChange={(e) => handleChange("badgeText", e.target.value)}
              />
              <Input
                label="Script Subtitle (Top Script)"
                placeholder="e.g. Full-Stack Engineer"
                value={formState.scriptTag}
                onChange={(e) => handleChange("scriptTag", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name Display (Line 1)"
                placeholder="e.g. MURTAZA"
                value={formState.nameLine1}
                onChange={(e) => handleChange("nameLine1", e.target.value)}
              />
              <Input
                label="Name Display (Line 2)"
                placeholder="e.g. ZAMAN"
                value={formState.nameLine2}
                onChange={(e) => handleChange("nameLine2", e.target.value)}
              />
            </div>
          </div>

          {/* 2. Role & Rotating Subtitles */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
              <Sparkles className="text-cyan-400" size={18} />
              <h3 className="text-base font-semibold text-white">Role & Rotating Specializations</h3>
            </div>

            <Input
              label="Role Prefix"
              placeholder="e.g. Future Technology Builder"
              value={formState.rolePrefix}
              onChange={(e) => handleChange("rolePrefix", e.target.value)}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Rotating Skills / Roles ({formState.roleSkills.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddRoleSkill}
                  className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {formState.roleSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="e.g. Technical SEO Strategy"
                      value={skill}
                      onChange={(e) => handleUpdateRoleSkill(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRoleSkill(idx)}
                      className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remove skill"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Positioning Statement */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
              <Layers className="text-cyan-400" size={18} />
              <h3 className="text-base font-semibold text-white">Positioning & Summary Paragraph</h3>
            </div>

            <Textarea
              label="Hero Paragraph"
              placeholder="Full-stack software engineer and AI integration specialist..."
              rows={3}
              value={formState.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
            />
          </div>

          {/* 4. Tech Stack Capability Chips */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <Palette className="text-cyan-400" size={18} />
                <h3 className="text-base font-semibold text-white">Tech Stack Capability Chips</h3>
              </div>
              <button
                type="button"
                onClick={handleAddHeroSkill}
                className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                <Plus size={14} /> Add Chip
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {formState.heroSkills.map((chip, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. React / Next.js"
                    value={chip}
                    onChange={(e) => handleUpdateHeroSkill(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHeroSkill(idx)}
                    className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove chip"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Glowing Social Media Links */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-6 backdrop-blur-sm space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <Link2 className="text-cyan-400" size={18} />
                  <h3 className="text-base font-semibold text-white">
                    Glowing Social Media Links
                  </h3>
                </div>
                <p className="font-mono text-[11px] text-slate-400 mt-1">
                  Rendered as circular glowing badges directly above the action buttons.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSocialLink}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 text-slate-950 px-3.5 py-1.5 font-mono text-xs font-bold hover:bg-cyan-400 transition-colors shadow-glow-cyan"
              >
                <Plus size={15} /> Add Social Link
              </button>
            </div>

            {/* Live Visual Preview of Social Glow Buttons */}
            <div className="rounded-xl border border-white/[0.08] bg-[#050c1a]/90 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <Eye size={13} className="text-cyan-400" />
                <span>Live Hero Preview (Above Buttons)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {formState.socialLinks.map((link, idx) => (
                  <SocialGlowButton
                    key={idx}
                    platform={link.platform}
                    label={link.label || link.platform}
                    url={link.url || "#"}
                    color={link.color || "cyan"}
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Social Links Form List */}
            <div className="space-y-4">
              {formState.socialLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      SOCIAL LINK #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      className="rounded-md p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove social link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Platform select */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Platform / Icon
                      </label>
                      <select
                        value={link.platform}
                        onChange={(e) => handleUpdateSocialLink(idx, "platform", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-[#0b1329] px-3 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {PLATFORM_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Label */}
                    <Input
                      label="Label"
                      placeholder="e.g. GitHub"
                      value={link.label}
                      onChange={(e) => handleUpdateSocialLink(idx, "label", e.target.value)}
                    />

                    {/* Glow Color Selector */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Glow Color
                      </label>
                      <select
                        value={link.color}
                        onChange={(e) => handleUpdateSocialLink(idx, "color", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.1] bg-[#0b1329] px-3 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {COLOR_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* URL */}
                  <Input
                    label="Destination URL"
                    placeholder="https://github.com/yourusername"
                    value={link.url}
                    onChange={(e) => handleUpdateSocialLink(idx, "url", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 6. Action Buttons */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
              <Layers className="text-cyan-400" size={18} />
              <h3 className="text-base font-semibold text-white">Call-to-Action Buttons</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Primary Button Text"
                placeholder="e.g. Explore My Work"
                value={formState.primaryCtaText}
                onChange={(e) => handleChange("primaryCtaText", e.target.value)}
              />
              <Input
                label="Primary Button Destination"
                placeholder="e.g. /projects"
                value={formState.primaryCtaLink}
                onChange={(e) => handleChange("primaryCtaLink", e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Secondary Button Text"
                placeholder="e.g. Start a Conversation"
                value={formState.secondaryCtaText}
                onChange={(e) => handleChange("secondaryCtaText", e.target.value)}
              />
              <Input
                label="Secondary Button Destination"
                placeholder="e.g. /contact"
                value={formState.secondaryCtaLink}
                onChange={(e) => handleChange("secondaryCtaLink", e.target.value)}
              />
            </div>
          </div>

          {/* 7. Philosophy & Professional Approach Section (The new requested section) */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
              <Compass className="text-cyan-400" size={18} />
              <div>
                <h3 className="text-base font-semibold text-white">
                  Philosophy & Professional Approach Section
                </h3>
                <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                  The statement and 4-step engineering methodology displayed below the Intelligence System.
                </p>
              </div>
            </div>

            {/* Statement block */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Section Eyebrow"
                placeholder="e.g. Professional Approach"
                value={formState.philosophyEyebrow}
                onChange={(e) => handleChange("philosophyEyebrow", e.target.value)}
              />
              <Input
                label="Main Statement / Headline"
                placeholder="e.g. Technology should move a real problem forward."
                value={formState.philosophyHeading}
                onChange={(e) => handleChange("philosophyHeading", e.target.value)}
              />
            </div>

            <Textarea
              label="Narrative Description"
              placeholder="Understand the challenge, shape the right architecture..."
              rows={2}
              value={formState.philosophyDescription}
              onChange={(e) => handleChange("philosophyDescription", e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="CTA Link Label"
                placeholder="e.g. Engineering background"
                value={formState.philosophyLinkLabel}
                onChange={(e) => handleChange("philosophyLinkLabel", e.target.value)}
              />
              <Input
                label="CTA Link Destination"
                placeholder="e.g. /about"
                value={formState.philosophyLinkUrl}
                onChange={(e) => handleChange("philosophyLinkUrl", e.target.value)}
              />
            </div>

            {/* 4 Process Steps */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                <label className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Process Steps ({formState.philosophySteps.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddPhilosophyStep}
                  className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>

              <div className="space-y-3">
                {formState.philosophySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400">
                        STEP {String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhilosophyStep(idx)}
                        className="rounded-md p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove step"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        label="Step Number"
                        placeholder="e.g. 01"
                        value={step.n}
                        onChange={(e) => handleUpdatePhilosophyStep(idx, "n", e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Step Title"
                          placeholder="e.g. Problem"
                          value={step.label}
                          onChange={(e) => handleUpdatePhilosophyStep(idx, "label", e.target.value)}
                        />
                      </div>
                    </div>

                    <Textarea
                      label="Step Description"
                      placeholder="Understand the business challenge..."
                      rows={2}
                      value={step.desc}
                      onChange={(e) => handleUpdatePhilosophyStep(idx, "desc", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Footer */}
          <div className="flex items-center justify-between pt-4">
            <Link
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              to="/admin"
            >
              &larr; Back to Admin Dashboard
            </Link>

            <Button
              disabled={saving}
              type="submit"
              variant="primary"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
