import OpenAI from "openai";
import { AISuggestion, MetaTagAnalysis, HeadingAnalysis, SEOIssue } from "@/types";

// ===========================================
// AI SEO Suggestion Service
// Uses OpenAI to generate SEO improvement suggestions.
// Lazy-initializes the client to prevent crashes when the key is missing.
// ===========================================

/**
 * Lazy OpenAI client getter — only instantiated when API key exists.
 */
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Generate AI-powered SEO improvement suggestions based on audit results.
 */
export async function generateAISuggestions(
  url: string,
  metaTags: MetaTagAnalysis,
  headings: HeadingAnalysis,
  issues: SEOIssue[]
): Promise<AISuggestion[]> {
  // If no API key / client unavailable, return template suggestions
  const openai = getOpenAIClient();
  if (!openai) {
    return generateFallbackSuggestions(url, metaTags, headings, issues);
  }

  try {
    const prompt = buildPrompt(url, metaTags, headings, issues);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert SEO consultant. Analyze the provided website data and generate specific, actionable SEO improvement suggestions. Return your response as a JSON array of suggestions.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return generateFallbackSuggestions(url, metaTags, headings, issues);

    const parsed = JSON.parse(content);
    return (parsed.suggestions || []).map((s: AISuggestion) => ({
      type: s.type || "general",
      original: s.original || null,
      suggested: s.suggested || "",
      reasoning: s.reasoning || "",
      impact: s.impact || "medium",
    }));
  } catch (error) {
    console.error("AI suggestion generation failed:", error);
    return generateFallbackSuggestions(url, metaTags, headings, issues);
  }
}

/** Build the prompt for AI analysis */
function buildPrompt(
  url: string,
  metaTags: MetaTagAnalysis,
  headings: HeadingAnalysis,
  issues: SEOIssue[]
): string {
  return `
Analyze this website and generate SEO improvement suggestions:

URL: ${url}

Current Meta Tags:
- Title: ${metaTags.title || "MISSING"}
- Description: ${metaTags.description || "MISSING"}
- OG Title: ${metaTags.ogTitle || "MISSING"}
- OG Description: ${metaTags.ogDescription || "MISSING"}

Headings:
- H1 Tags: ${headings.h1Tags.join(", ") || "None"}
- H2 Count: ${headings.h2Count}
- H3 Count: ${headings.h3Count}

Current Issues (${issues.length} total):
${issues.slice(0, 10).map((i) => `- [${i.severity}] ${i.title}: ${i.description}`).join("\n")}

Please return a JSON object with a "suggestions" array. Each suggestion should have:
- type: "title" | "description" | "content" | "keyword" | "schema" | "general"
- original: the current value (or null if missing)
- suggested: your recommended replacement or action
- reasoning: why this change would improve SEO
- impact: "high" | "medium" | "low"

Generate 3-5 high-impact suggestions.
`;
}

/** Generate fallback suggestions when AI is not available */
function generateFallbackSuggestions(
  url: string,
  metaTags: MetaTagAnalysis,
  headings: HeadingAnalysis,
  issues: SEOIssue[]
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Title suggestion
  if (!metaTags.title || metaTags.titleLength < 30) {
    const domain = new URL(url).hostname.replace("www.", "");
    suggestions.push({
      type: "title",
      original: metaTags.title,
      suggested: `${domain.charAt(0).toUpperCase() + domain.slice(1).split(".")[0]} - Your Primary Keyword | Brand Name`,
      reasoning:
        "A well-crafted title tag between 30-60 characters improves click-through rates from search results by up to 20%.",
      impact: "high",
    });
  }

  // Description suggestion
  if (!metaTags.description || metaTags.descriptionLength < 120) {
    suggestions.push({
      type: "description",
      original: metaTags.description,
      suggested:
        "Discover [your value proposition]. We offer [key benefit 1], [key benefit 2], and [key benefit 3]. Learn more and get started today.",
      reasoning:
        "Meta descriptions between 120-160 characters serve as ad copy in search results. A compelling description can increase CTR by 5-10%.",
      impact: "high",
    });
  }

  // Content suggestions based on issues
  const criticalIssues = issues.filter((i) => i.severity === "critical");
  if (criticalIssues.length > 0) {
    suggestions.push({
      type: "general",
      original: null,
      suggested: `Fix ${criticalIssues.length} critical issue(s): ${criticalIssues.map((i) => i.title).join(", ")}. These issues have the highest impact on your search engine rankings.`,
      reasoning:
        "Critical SEO issues can prevent search engines from properly indexing your content, leading to significant traffic loss.",
      impact: "high",
    });
  }

  // Schema suggestion
  if (issues.some((i) => i.id === "no-schema")) {
    suggestions.push({
      type: "schema",
      original: null,
      suggested:
        "Add JSON-LD structured data with Organization, WebSite, and BreadcrumbList schemas. This enables rich snippets in search results.",
      reasoning:
        "Pages with structured data can see up to 30% higher click-through rates due to enhanced search result appearances (rich snippets).",
      impact: "medium",
    });
  }

  // Content structure suggestion
  if (headings.h1Count === 0 || headings.h2Count < 2) {
    suggestions.push({
      type: "content",
      original: null,
      suggested:
        "Restructure your content with a clear heading hierarchy: one H1 for the main topic, followed by H2 subheadings for each section, and H3 for sub-sections.",
      reasoning:
        "A proper heading hierarchy helps search engines understand your content structure and can improve rankings for target keywords.",
      impact: "medium",
    });
  }

  return suggestions;
}
