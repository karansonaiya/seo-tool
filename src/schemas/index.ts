import { z } from "zod";

// ===========================================
// Zod Validation Schemas
// ===========================================

/**
 * Schema for URL audit form input.
 * Validates URL format and prevents common SSRF attack vectors.
 */
export const auditUrlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          // Block private/internal IPs to prevent SSRF
          const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
          const blockedPatterns = [/^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./];
          if (blockedHosts.includes(parsed.hostname)) return false;
          if (blockedPatterns.some((p) => p.test(parsed.hostname))) return false;
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Invalid or blocked URL. Only public HTTP/HTTPS URLs are allowed." }
    ),
});

/**
 * Schema for competitor analysis form.
 */
export const competitorAnalysisSchema = z.object({
  mainUrl: z.string().min(1, "Your website URL is required").url("Please enter a valid URL"),
  competitors: z
    .array(z.string().url("Please enter a valid competitor URL"))
    .min(1, "At least one competitor URL is required")
    .max(5, "Maximum 5 competitors allowed"),
});

/**
 * Schema for monitoring settings.
 */
export const monitoringSettingsSchema = z.object({
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  scoreDropThreshold: z.number().min(1).max(100).default(10),
  notifyOnBrokenLinks: z.boolean().default(true),
  notifyOnPerformanceDrop: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
});

/**
 * Schema for user settings update.
 */
export const userSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

/**
 * Schema for contact form.
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Export inferred types from schemas
export type AuditUrlInput = z.infer<typeof auditUrlSchema>;
export type CompetitorAnalysisInput = z.infer<typeof competitorAnalysisSchema>;
export type MonitoringSettingsInput = z.infer<typeof monitoringSettingsSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
