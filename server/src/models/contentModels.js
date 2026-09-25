import mongoose from "mongoose";

const { Schema } = mongoose;

const publicationFields = {
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    index: true,
  },
  publishedAt: { type: Date, default: null, index: true },
};

const seoMetadataSchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    canonicalPath: String,
    robots: { type: String, enum: ["index", "noindex"], default: "index" },
    ogImageMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    structuredDataType: String,
  },
  { _id: false },
);

const socialLinkSchema = new Schema(
  {
    platform: { type: String, default: "Custom" },
    label: { type: String, default: "" },
    url: { type: String, required: true },
    color: {
      type: String,
      enum: ["cyan", "purple", "emerald", "amber", "rose", "sky"],
      default: "cyan",
    },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    experienceYears: { type: Number, min: 0 },
    identityStatement: String,
    purposeStatement: String,
    technologyPerspective: String,
    approach: String,
    professionalValues: [String],
    focusAreas: [String],
    capabilityAreas: [String],

    // Hero Section Customizations
    badgeText: { type: String, default: "Available for Projects" },
    badgeActive: { type: Boolean, default: true },
    scriptTag: { type: String, default: "Full-Stack Engineer" },
    nameLine1: { type: String, default: "MURTAZA" },
    nameLine2: { type: String, default: "ZAMAN" },
    rolePrefix: { type: String, default: "Future Technology Builder" },
    roleSkills: {
      type: [String],
      default: [
        "Technical SEO Strategy",
        "AI Systems Integration",
        "Full-Stack Architecture",
        "Cloud Infrastructure",
      ],
    },
    heroSkills: {
      type: [String],
      default: [
        "React / Next.js",
        "Node.js",
        "AI Integrations",
        "Cloud Arch",
        "Technical SEO",
      ],
    },
    primaryCtaText: { type: String, default: "Explore My Work" },
    primaryCtaLink: { type: String, default: "/projects" },
    secondaryCtaText: { type: String, default: "Start a Conversation" },
    secondaryCtaLink: { type: String, default: "/contact" },

    // Philosophy / Approach Section Customizations
    philosophyEyebrow: { type: String, default: "Professional Approach" },
    philosophyHeading: {
      type: String,
      default: "Technology should move a real problem forward.",
    },
    philosophyDescription: {
      type: String,
      default:
        "Understand the challenge, shape the right architecture, build with engineering discipline, and connect it to a measurable outcome.",
    },
    philosophyLinkLabel: { type: String, default: "Engineering background" },
    philosophyLinkUrl: { type: String, default: "/about" },
    philosophySteps: [
      {
        n: { type: String, default: "01" },
        label: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],

    socialLinks: [socialLinkSchema],
    contactReferences: { email: String, calendlyUrl: String },
    resumeDocumentId: { type: Schema.Types.ObjectId, ref: "Document", default: null },
    seoMetadata: seoMetadataSchema,
    ...publicationFields,
  },
  { timestamps: true },
);

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    problem: String,
    approach: String,
    value: String,
    capabilityArea: String,
    projectIds: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    displayOrder: { type: Number, default: 0 },
    coverImage: String,
    imageUrl: String,
    seoMetadata: seoMetadataSchema,
    ...publicationFields,
  },
  { timestamps: true },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: { type: String, required: true },
    summary: { type: String, default: "" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    outcome: { type: String, default: "" },
    tags: [String],
    technologies: [String],
    capabilityAreas: [String],
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    mediaIds: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
    coverImage: String,
    imageUrl: String,
    repositoryUrl: String,
    liveUrl: String,
    visibility: { type: String, enum: ["public", "private", "confidential"], default: "public" },
    seoMetadata: seoMetadataSchema,
    ...publicationFields,
  },
  { timestamps: true },
);

projectSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
  }
  if (!this.slug) {
    this.slug = `project-${Date.now()}`;
  }
  next();
});

const documentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["resume", "certificate", "guide", "other"], required: true },
    description: String,
    version: String,
    cloudinaryAssetId: String,
    secureUrl: String,
    format: String,
    bytes: Number,
    visibility: { type: String, enum: ["public", "private"], default: "private" },
    downloadCount: { type: Number, default: 0 },
    ...publicationFields,
  },
  { timestamps: true },
);

documentSchema.index({ type: 1, visibility: 1, status: 1, publishedAt: -1 });

const mediaAssetSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    resourceType: String,
    format: String,
    secureUrl: { type: String, required: true },
    width: Number,
    height: Number,
    bytes: Number,
    purpose: {
      type: String,
      enum: ["profile", "project", "social", "document"],
      required: true,
    },
    ownerType: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, required: true },
    altText: String,
    caption: String,
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ ownerType: 1, ownerId: 1, status: 1 });

const inquirySchema = new Schema(
  {
    inquiryType: { type: String, enum: ["client", "recruiter", "partner", "general"], required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    budgetRange: String,
    timeline: String,
    sourcePath: String,
    status: { type: String, enum: ["new", "reviewed", "qualified", "replied", "archived", "spam"], default: "new", index: true },
    consent: { type: Boolean, required: true },
    retentionUntil: Date,
  },
  { timestamps: true },
);

inquirySchema.index({ status: 1, createdAt: -1 });

const showcaseCardItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    tag: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const showcaseCardSchema = new Schema(
  {
    nodeLabel: { type: String, required: true, trim: true },
    nodeTag: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    items: [showcaseCardItemSchema],
    displayOrder: { type: Number, required: true, min: 1, max: 4, index: true },
    ...publicationFields,
  },
  { timestamps: true },
);

showcaseCardSchema.index({ displayOrder: 1, status: 1 });

const techNodeSchema = new Schema(
  {
    nodeId: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    abbr: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    color: { type: String, default: "#22d3ee" },
    glowColor: { type: String, default: "rgba(34, 211, 238, 0.45)" },
    bgGradient: { type: String, default: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.25), rgba(6,182,212,0.06))" },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    depth: { type: Number, default: 0.85 },
    skills: [String],
    desc: { type: String, default: "" },
    displayOrder: { type: Number, required: true, min: 1, max: 6, index: true },
    ...publicationFields,
  },
  { timestamps: true },
);

techNodeSchema.index({ displayOrder: 1, status: 1 });

export const Profile = mongoose.model("Profile", profileSchema);
export const Service = mongoose.model("Service", serviceSchema);
export const Project = mongoose.model("Project", projectSchema);
export const Document = mongoose.model("Document", documentSchema);
export const MediaAsset = mongoose.model("MediaAsset", mediaAssetSchema);
export const Inquiry = mongoose.model("Inquiry", inquirySchema);
export const ShowcaseCard = mongoose.model("ShowcaseCard", showcaseCardSchema);
export const TechNode = mongoose.model("TechNode", techNodeSchema);
