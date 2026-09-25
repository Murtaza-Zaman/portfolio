import { z } from "zod";

export const inquiryTypeEnum = z.enum(["client", "recruiter", "partner", "general"], {
  errorMap: () => ({ message: "Please select a valid inquiry type" }),
});

export const contactSchema = z.object({
  inquiryType: inquiryTypeEnum.default("client"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters"),
  organization: z
    .string()
    .trim()
    .max(120, "Organization name cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(150, "Subject cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
  timeline: z
    .string()
    .trim()
    .max(100, "Timeline cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  budgetRange: z
    .string()
    .trim()
    .max(100, "Budget range cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message cannot exceed 3000 characters"),
  consent: z
    .boolean()
    .refine((val) => val === true, "You must agree to be contacted to submit"),
});
