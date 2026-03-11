import { NextRequest, NextResponse } from "next/server";
import { analyzeSEO } from "@/services/seo-analyzer";
import { generateAISuggestions } from "@/services/ai-suggestions";
import { auditUrlSchema } from "@/schemas";

// ===========================================
// POST /api/audit
// Main endpoint for running an SEO audit on a URL.
// ===========================================

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = auditUrlSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Run SEO analysis
    const auditResult = await analyzeSEO(url);

    // Generate AI suggestions (non-blocking, adds to result)
    try {
      const suggestions = await generateAISuggestions(
        url,
        auditResult.metaTags,
        auditResult.headings,
        auditResult.issues
      );
      auditResult.aiSuggestions = suggestions;
    } catch (aiError) {
      console.error("AI suggestions failed:", aiError);
      // Continue without AI suggestions
    }

    return NextResponse.json({
      success: true,
      data: auditResult,
    });
  } catch (error: unknown) {
    console.error("Audit error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
