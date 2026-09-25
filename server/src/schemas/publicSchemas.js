import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const inquirySchema = z.object({
  inquiryType: z.enum(["client", "recruiter", "partner", "general"]),
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  organization: z.string().trim().max(160).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  budgetRange: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  sourcePath: z.string().trim().max(500).optional(),
  consent: z.literal(true),
});
