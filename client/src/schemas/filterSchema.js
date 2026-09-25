import { z } from "zod";

export const projectFilterSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  capabilityArea: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});
