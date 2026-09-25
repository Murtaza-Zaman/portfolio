import { z } from "zod";

const publicationStatusEnum = z.enum(["draft", "published", "archived"]);

export const seoMetadataSchema = z.object({
  metaTitle: z.string().trim().max(70, "Title should not exceed 70 characters").optional(),
  metaDescription: z.string().trim().max(160, "Description should not exceed 160 characters").optional(),
  canonicalPath: z.string().trim().optional(),
  robots: z.enum(["index", "noindex"]).default("index"),
  structuredDataType: z.string().trim().optional(),
});

export const projectAdminSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  slug: z.string().trim().optional(),
  category: z.string().trim().min(2, "Category is required"),
  summary: z.string().trim().optional(),
  challenge: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  outcome: z.string().trim().optional(),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  capabilityAreas: z.array(z.string()).default([]),
  coverImage: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  repositoryUrl: z.string().trim().optional(),
  liveUrl: z.string().trim().optional(),
  visibility: z.enum(["public", "private", "confidential"]).default("public"),
  status: publicationStatusEnum.default("draft"),
  seoMetadata: seoMetadataSchema.optional(),
});

export const serviceAdminSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(120),
  slug: z.string().trim().min(2, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  category: z.string().trim().min(2, "Category is required"),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters"),
  problem: z.string().trim().optional(),
  approach: z.string().trim().optional(),
  value: z.string().trim().optional(),
  capabilityArea: z.string().trim().optional(),
  displayOrder: z.number().int().default(0),
  status: publicationStatusEnum.default("draft"),
  seoMetadata: seoMetadataSchema.optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).default("Murtaza Zaman"),
  siteTitle: z.string().trim().min(2).default("Technology Builder & Software Engineer"),
  siteDescription: z.string().trim().min(10).default("Professional portfolio and digital solution engineering platform."),
  contactEmail: z.string().trim().email().default("murtaza@example.com"),
  calendlyUrl: z.string().trim().url().optional().or(z.literal("")),
  maintenanceMode: z.boolean().default(false),
});
