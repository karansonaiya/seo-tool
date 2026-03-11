import axios from "axios";
import * as cheerio from "cheerio";
import {
  SEOAuditResult,
  MetaTagAnalysis,
  HeadingAnalysis,
  LinkAnalysis,
  ImageAnalysis,
  TechnicalAnalysis,
  PerformanceAnalysis,
  SEOIssue,
} from "@/types";
import { META_TAG_LIMITS, PERFORMANCE_THRESHOLDS, IMAGE_LIMITS } from "@/constants";

// ===========================================
// SEO Analysis Engine
// Crawls a website and returns comprehensive SEO audit results.
// ===========================================

/**
 * Main SEO analysis function.
 * Fetches the page, parses HTML, and runs all analysis modules.
 */
export async function analyzeSEO(url: string): Promise<SEOAuditResult> {
  const normalizedUrl = normalizeUrl(url);

  // Fetch the page HTML
  const html = await fetchPage(normalizedUrl);
  const $ = cheerio.load(html);

  // Run all analysis modules in parallel
  const [metaTags, headings, links, images, technical, performance] = await Promise.all([
    analyzeMetaTags($, normalizedUrl),
    analyzeHeadings($),
    analyzeLinks($, normalizedUrl),
    analyzeImages($, normalizedUrl),
    analyzeTechnical($, normalizedUrl),
    analyzePerformance(normalizedUrl),
  ]);

  // Collect all issues
  const allIssues: SEOIssue[] = [
    ...metaTags.issues,
    ...headings.issues,
    ...links.issues,
    ...images.issues,
    ...technical.issues,
    ...performance.issues,
  ];

  // Calculate scores
  const technicalScore = calculateTechnicalScore(technical, metaTags);
  const performanceScore = performance.score;
  const contentScore = calculateContentScore(headings, metaTags, images);
  const overallScore = Math.round(
    technicalScore * 0.35 + performanceScore * 0.35 + contentScore * 0.3
  );

  return {
    url: normalizedUrl,
    timestamp: new Date().toISOString(),
    overallScore,
    technicalScore,
    performanceScore,
    contentScore,
    metaTags,
    headings,
    links,
    images,
    technical,
    performance,
    issues: allIssues,
  };
}

/** Fetch page HTML with timeout and user agent */
async function fetchPage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEOAutoFix/1.0; +https://seoautofix.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch page: ${error.message}`);
    }
    throw new Error("Failed to fetch page");
  }
}

/** Normalize URL by adding protocol */
function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

/** Extract and analyze meta tags from HTML */
async function analyzeMetaTags(
  $: cheerio.CheerioAPI,
  url: string
): Promise<MetaTagAnalysis> {
  const issues: SEOIssue[] = [];

  const title = $("title").text().trim() || null;
  const titleLength = title?.length || 0;
  const description = $('meta[name="description"]').attr("content") || null;
  const descriptionLength = description?.length || 0;
  const canonical = $('link[rel="canonical"]').attr("href") || null;
  const robots = $('meta[name="robots"]').attr("content") || null;
  const ogTitle = $('meta[property="og:title"]').attr("content") || null;
  const ogDescription = $('meta[property="og:description"]').attr("content") || null;
  const ogImage = $('meta[property="og:image"]').attr("content") || null;
  const twitterCard = $('meta[name="twitter:card"]').attr("content") || null;
  const twitterTitle = $('meta[name="twitter:title"]').attr("content") || null;
  const twitterDescription = $('meta[name="twitter:description"]').attr("content") || null;
  const viewport = $('meta[name="viewport"]').attr("content") || null;
  const charset =
    $("meta[charset]").attr("charset") ||
    $('meta[http-equiv="Content-Type"]').attr("content") ||
    null;

  // Find duplicate meta tags
  const metaNames: string[] = [];
  const duplicateMetaTags: string[] = [];
  $("meta[name]").each((_, el) => {
    const name = $(el).attr("name");
    if (name) {
      if (metaNames.includes(name)) {
        duplicateMetaTags.push(name);
      }
      metaNames.push(name);
    }
  });

  // Check for issues
  if (!title) {
    issues.push({
      id: "missing-title",
      title: "Missing Title Tag",
      description: "The page is missing a title tag. Title tags are crucial for SEO.",
      severity: "critical",
      category: "meta",
      fix: "Add a descriptive title tag between 30-60 characters.",
    });
  } else if (titleLength < META_TAG_LIMITS.TITLE_MIN) {
    issues.push({
      id: "short-title",
      title: "Title Tag Too Short",
      description: `Title is ${titleLength} characters. Recommended: ${META_TAG_LIMITS.TITLE_MIN}-${META_TAG_LIMITS.TITLE_MAX} characters.`,
      severity: "warning",
      category: "meta",
      fix: `Extend your title to at least ${META_TAG_LIMITS.TITLE_MIN} characters for better SEO.`,
    });
  } else if (titleLength > META_TAG_LIMITS.TITLE_MAX) {
    issues.push({
      id: "long-title",
      title: "Title Tag Too Long",
      description: `Title is ${titleLength} characters. It may be truncated in search results (max: ${META_TAG_LIMITS.TITLE_MAX}).`,
      severity: "warning",
      category: "meta",
      fix: `Shorten your title to under ${META_TAG_LIMITS.TITLE_MAX} characters.`,
    });
  }

  if (!description) {
    issues.push({
      id: "missing-description",
      title: "Missing Meta Description",
      description: "No meta description found. This is important for click-through rates.",
      severity: "critical",
      category: "meta",
      fix: "Add a compelling meta description between 120-160 characters.",
    });
  } else if (descriptionLength < META_TAG_LIMITS.DESCRIPTION_MIN) {
    issues.push({
      id: "short-description",
      title: "Meta Description Too Short",
      description: `Description is ${descriptionLength} characters. Recommended: ${META_TAG_LIMITS.DESCRIPTION_MIN}-${META_TAG_LIMITS.DESCRIPTION_MAX}.`,
      severity: "warning",
      category: "meta",
    });
  }

  if (!ogTitle || !ogDescription || !ogImage) {
    issues.push({
      id: "incomplete-og",
      title: "Incomplete Open Graph Tags",
      description: "Missing Open Graph tags affect social media sharing appearance.",
      severity: "warning",
      category: "meta",
      fix: "Add og:title, og:description, and og:image meta tags.",
    });
  }

  if (!twitterCard) {
    issues.push({
      id: "missing-twitter-card",
      title: "Missing Twitter Card",
      description: "No Twitter card meta tags found.",
      severity: "info",
      category: "meta",
      fix: "Add twitter:card, twitter:title, and twitter:description meta tags.",
    });
  }

  if (!viewport) {
    issues.push({
      id: "missing-viewport",
      title: "Missing Viewport Meta Tag",
      description: "No viewport meta tag found. This affects mobile rendering.",
      severity: "critical",
      category: "meta",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
    });
  }

  if (duplicateMetaTags.length > 0) {
    issues.push({
      id: "duplicate-meta",
      title: "Duplicate Meta Tags",
      description: `Duplicate meta tags found: ${duplicateMetaTags.join(", ")}`,
      severity: "warning",
      category: "meta",
      fix: "Remove duplicate meta tags — each should appear only once.",
    });
  }

  return {
    title,
    titleLength,
    description,
    descriptionLength,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    viewport,
    charset,
    duplicateMetaTags,
    issues,
  };
}

/** Analyze heading hierarchy */
async function analyzeHeadings($: cheerio.CheerioAPI): Promise<HeadingAnalysis> {
  const issues: SEOIssue[] = [];
  const h1Tags: string[] = [];

  $("h1").each((_, el) => {
    h1Tags.push($(el).text().trim());
  });

  const h1Count = h1Tags.length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const h4Count = $("h4").length;
  const h5Count = $("h5").length;
  const h6Count = $("h6").length;

  // Build heading hierarchy
  const hierarchy: { level: number; text: string }[] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() || "";
    const level = parseInt(tag.replace("h", ""), 10);
    hierarchy.push({ level, text: $(el).text().trim() });
  });

  if (h1Count === 0) {
    issues.push({
      id: "missing-h1",
      title: "Missing H1 Tag",
      description: "No H1 tag found. Every page should have exactly one H1.",
      severity: "critical",
      category: "content",
      fix: "Add a single H1 tag with your primary keyword.",
    });
  } else if (h1Count > 1) {
    issues.push({
      id: "multiple-h1",
      title: "Multiple H1 Tags",
      description: `Found ${h1Count} H1 tags. Best practice is to use exactly one H1 per page.`,
      severity: "warning",
      category: "content",
      fix: "Consolidate to a single H1 tag and use H2-H6 for subheadings.",
    });
  }

  if (h2Count === 0 && h1Count > 0) {
    issues.push({
      id: "missing-h2",
      title: "No H2 Subheadings",
      description: "No H2 tags found. Subheadings help structure your content.",
      severity: "info",
      category: "content",
      fix: "Add H2 subheadings to break up your content into logical sections.",
    });
  }

  return {
    h1Count,
    h1Tags,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    hierarchy,
    issues,
  };
}

/** Analyze links on the page */
async function analyzeLinks(
  $: cheerio.CheerioAPI,
  baseUrl: string
): Promise<LinkAnalysis> {
  const issues: SEOIssue[] = [];
  const baseUrlObj = new URL(baseUrl);
  let internalLinks = 0;
  let externalLinks = 0;
  let noFollowLinks = 0;
  const brokenLinks: LinkAnalysis["brokenLinks"] = [];
  const redirectChains: LinkAnalysis["redirectChains"] = [];

  const allLinks: { href: string; text: string }[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (href) allLinks.push({ href, text });

    const rel = $(el).attr("rel");
    if (rel?.includes("nofollow")) noFollowLinks++;

    try {
      if (href) {
        const linkUrl = new URL(href, baseUrl);
        if (linkUrl.hostname === baseUrlObj.hostname) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      }
    } catch {
      // Relative or malformed URL
      internalLinks++;
    }
  });

  // Check a sample of links for broken status (limit to 20 to avoid rate limiting)
  const linksToCheck = allLinks.slice(0, 20);
  for (const link of linksToCheck) {
    try {
      const fullUrl = new URL(link.href, baseUrl).toString();
      const response = await axios.head(fullUrl, {
        timeout: 10000,
        maxRedirects: 0,
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        brokenLinks.push({
          url: fullUrl,
          statusCode: response.status,
          anchorText: link.text,
          location: "page",
        });
      }
    } catch {
      // Connection failed - likely broken
      try {
        brokenLinks.push({
          url: new URL(link.href, baseUrl).toString(),
          statusCode: 0,
          anchorText: link.text,
          location: "page",
        });
      } catch {
        // Invalid URL, skip
      }
    }
  }

  if (brokenLinks.length > 0) {
    issues.push({
      id: "broken-links",
      title: "Broken Links Found",
      description: `${brokenLinks.length} broken link(s) detected on the page.`,
      severity: "critical",
      category: "links",
      fix: "Fix or remove broken links to improve user experience and SEO.",
    });
  }

  if (internalLinks < 3) {
    issues.push({
      id: "few-internal-links",
      title: "Few Internal Links",
      description: "The page has very few internal links. Internal linking helps SEO.",
      severity: "info",
      category: "links",
      fix: "Add more internal links to related pages on your site.",
    });
  }

  return {
    totalLinks: allLinks.length,
    internalLinks,
    externalLinks,
    brokenLinks,
    redirectChains,
    noFollowLinks,
    issues,
  };
}

/** Analyze images for SEO issues */
async function analyzeImages(
  $: cheerio.CheerioAPI,
  baseUrl: string
): Promise<ImageAnalysis> {
  const issues: SEOIssue[] = [];
  const imagesWithoutAlt: ImageAnalysis["imagesWithoutAlt"] = [];
  const largeImages: ImageAnalysis["largeImages"] = [];
  const nonOptimizedImages: ImageAnalysis["nonOptimizedImages"] = [];
  const imagesWithoutLazyLoad: ImageAnalysis["imagesWithoutLazyLoad"] = [];

  let totalImages = 0;

  $("img").each((_, el) => {
    totalImages++;
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || null;
    const width = $(el).attr("width") ? parseInt($(el).attr("width")!, 10) : null;
    const height = $(el).attr("height") ? parseInt($(el).attr("height")!, 10) : null;
    const loading = $(el).attr("loading");
    const hasLazyLoading = loading === "lazy";

    const imageInfo = {
      src,
      alt,
      width,
      height,
      fileSize: null,
      format: src.split(".").pop()?.split("?")[0] || null,
      hasLazyLoading,
    };

    if (alt === null || alt === "") {
      imagesWithoutAlt.push(imageInfo);
    }

    if (!hasLazyLoading) {
      imagesWithoutLazyLoad.push(imageInfo);
    }

    // Check format
    const format = imageInfo.format?.toLowerCase();
    if (format && !["webp", "avif", "svg"].includes(format)) {
      nonOptimizedImages.push(imageInfo);
    }
  });

  if (imagesWithoutAlt.length > 0) {
    issues.push({
      id: "images-no-alt",
      title: "Images Without Alt Text",
      description: `${imagesWithoutAlt.length} image(s) missing alt text. Alt text is essential for accessibility and SEO.`,
      severity: "critical",
      category: "images",
      fix: "Add descriptive alt text to all images.",
    });
  }

  if (nonOptimizedImages.length > 0) {
    issues.push({
      id: "non-optimized-images",
      title: "Non-Optimized Image Formats",
      description: `${nonOptimizedImages.length} image(s) using non-optimized formats. Consider WebP or AVIF.`,
      severity: "warning",
      category: "images",
      fix: "Convert images to WebP or AVIF format for better performance.",
    });
  }

  if (imagesWithoutLazyLoad.length > 2) {
    issues.push({
      id: "no-lazy-loading",
      title: "Images Without Lazy Loading",
      description: `${imagesWithoutLazyLoad.length} image(s) without lazy loading attribute.`,
      severity: "info",
      category: "images",
      fix: 'Add loading="lazy" to images below the fold.',
    });
  }

  return {
    totalImages,
    imagesWithoutAlt,
    largeImages,
    nonOptimizedImages,
    imagesWithoutLazyLoad,
    issues,
  };
}

/** Analyze technical SEO aspects */
async function analyzeTechnical(
  $: cheerio.CheerioAPI,
  url: string
): Promise<TechnicalAnalysis> {
  const issues: SEOIssue[] = [];
  const baseUrlObj = new URL(url);
  const origin = baseUrlObj.origin;

  // Check for robots.txt
  let hasRobotsTxt = false;
  let robotsTxtContent: string | null = null;
  try {
    const robotsResponse = await axios.get(`${origin}/robots.txt`, { timeout: 10000 });
    if (robotsResponse.status === 200) {
      hasRobotsTxt = true;
      robotsTxtContent = robotsResponse.data;
    }
  } catch {
    // robots.txt not found
  }

  // Check for sitemap
  let hasSitemap = false;
  let sitemapUrl: string | null = null;
  try {
    const sitemapResponse = await axios.get(`${origin}/sitemap.xml`, {
      timeout: 10000,
      validateStatus: (s) => s === 200,
    });
    if (sitemapResponse.status === 200) {
      hasSitemap = true;
      sitemapUrl = `${origin}/sitemap.xml`;
    }
  } catch {
    // sitemap not found
  }

  // Check canonical
  const canonical = $('link[rel="canonical"]').attr("href") || null;
  const hasCanonical = !!canonical;

  // Check Schema markup
  const schemaTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "{}");
      if (data["@type"]) schemaTypes.push(data["@type"]);
    } catch {
      // Invalid JSON-LD
    }
  });
  const hasSchemaMarkup = schemaTypes.length > 0;

  // Other checks
  const htmlLang = $("html").attr("lang") || null;
  const isHttps = url.startsWith("https://");
  const hasFavicon = !!$('link[rel="icon"], link[rel="shortcut icon"]').length;
  const hasAppleTouchIcon = !!$('link[rel="apple-touch-icon"]').length;
  const internalLinkCount = $("a[href]").length;

  // Generate issues
  if (!hasRobotsTxt) {
    issues.push({
      id: "missing-robots",
      title: "Missing robots.txt",
      description:
        "No robots.txt file found. This file tells search engines which pages to crawl.",
      severity: "warning",
      category: "technical",
      fix: "Create a robots.txt file in your website root.",
    });
  }

  if (!hasSitemap) {
    issues.push({
      id: "missing-sitemap",
      title: "Missing Sitemap",
      description: "No sitemap.xml found. Sitemaps help search engines discover your pages.",
      severity: "warning",
      category: "technical",
      fix: "Generate and submit a sitemap.xml to search engines.",
    });
  }

  if (!hasCanonical) {
    issues.push({
      id: "missing-canonical",
      title: "Missing Canonical Tag",
      description: "No canonical tag found. This can cause duplicate content issues.",
      severity: "warning",
      category: "technical",
      fix: "Add a canonical link tag pointing to the preferred version of this page.",
    });
  }

  if (!hasSchemaMarkup) {
    issues.push({
      id: "no-schema",
      title: "No Schema Markup",
      description: "No structured data (Schema.org) found on the page.",
      severity: "info",
      category: "technical",
      fix: "Add JSON-LD structured data to help search engines understand your content.",
    });
  }

  if (!htmlLang) {
    issues.push({
      id: "missing-lang",
      title: "Missing HTML Lang Attribute",
      description: "The <html> tag is missing the lang attribute.",
      severity: "warning",
      category: "technical",
      fix: 'Add lang="en" (or your content language) to the <html> tag.',
    });
  }

  if (!isHttps) {
    issues.push({
      id: "not-https",
      title: "Not Using HTTPS",
      description: "The website is not using HTTPS. HTTPS is a ranking signal.",
      severity: "critical",
      category: "technical",
      fix: "Install an SSL certificate and redirect HTTP to HTTPS.",
    });
  }

  if (!hasFavicon) {
    issues.push({
      id: "missing-favicon",
      title: "Missing Favicon",
      description: "No favicon found. This affects branding in browser tabs and bookmarks.",
      severity: "info",
      category: "technical",
      fix: "Add a favicon.ico and link tag in the <head>.",
    });
  }

  return {
    hasRobotsTxt,
    robotsTxtContent,
    hasSitemap,
    sitemapUrl,
    hasCanonical,
    canonicalUrl: canonical,
    hasSchemaMarkup,
    schemaTypes,
    htmlLang,
    isHttps,
    hasFavicon,
    hasAppleTouchIcon,
    internalLinkCount,
    issues,
  };
}

/** Analyze performance using PageSpeed Insights API or simulated metrics */
async function analyzePerformance(url: string): Promise<PerformanceAnalysis> {
  const issues: SEOIssue[] = [];

  // Try using Google PageSpeed Insights API
  const apiKey = process.env.PAGESPEED_API_KEY;

  if (apiKey) {
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance`;
      const response = await axios.get(apiUrl, { timeout: 60000 });
      const data = response.data;
      const lighthouse = data.lighthouseResult;

      const score = Math.round((lighthouse.categories.performance.score || 0) * 100);
      const audits = lighthouse.audits;

      return {
        score,
        lcp: extractMetric(audits["largest-contentful-paint"], "ms"),
        cls: extractMetric(audits["cumulative-layout-shift"], ""),
        fid: extractMetric(audits["max-potential-fid"], "ms"),
        fcp: extractMetric(audits["first-contentful-paint"], "ms"),
        ttfb: extractMetric(audits["server-response-time"], "ms"),
        speedIndex: extractMetric(audits["speed-index"], "ms"),
        totalBlockingTime: extractMetric(audits["total-blocking-time"], "ms"),
        pageSize: 0,
        requestCount: 0,
        unusedCss: audits["unused-css-rules"]?.details?.overallSavingsBytes || 0,
        unusedJs: audits["unused-javascript"]?.details?.overallSavingsBytes || 0,
        renderBlockingResources:
          audits["render-blocking-resources"]?.details?.items?.length || 0,
        issues: generatePerformanceIssues(score, issues),
      };
    } catch {
      // Fall through to simulated analysis
    }
  }

  // Simulated performance analysis (when no API key available)
  // Measures actual response time as a rough proxy
  const startTime = Date.now();
  try {
    await axios.get(url, { timeout: 30000 });
  } catch {
    // Ignore fetch errors
  }
  const responseTime = Date.now() - startTime;

  // Generate approximate scores based on response time
  const score = Math.max(0, Math.min(100, Math.round(100 - (responseTime / 100))));

  const performanceResult: PerformanceAnalysis = {
    score,
    lcp: createMetric(responseTime * 1.5, "ms", PERFORMANCE_THRESHOLDS.LCP),
    cls: createMetric(0.1, "", { good: 0.1, poor: 0.25 }),
    fid: createMetric(responseTime * 0.3, "ms", PERFORMANCE_THRESHOLDS.FID),
    fcp: createMetric(responseTime * 0.8, "ms", PERFORMANCE_THRESHOLDS.FCP),
    ttfb: createMetric(responseTime, "ms", PERFORMANCE_THRESHOLDS.TTFB),
    speedIndex: createMetric(responseTime * 2, "ms", PERFORMANCE_THRESHOLDS.SPEED_INDEX),
    totalBlockingTime: createMetric(responseTime * 0.5, "ms", PERFORMANCE_THRESHOLDS.TBT),
    pageSize: 0,
    requestCount: 0,
    unusedCss: 0,
    unusedJs: 0,
    renderBlockingResources: 0,
    issues: [],
  };

  performanceResult.issues = generatePerformanceIssues(score, issues);
  return performanceResult;
}

/** Extract performance metric from Lighthouse audit data */
function extractMetric(
  audit: { numericValue?: number; score?: number; displayValue?: string } | undefined,
  unit: string
) {
  if (!audit) {
    return { value: 0, unit, rating: "good" as const, displayValue: "N/A" };
  }
  const value = audit.numericValue || 0;
  const score = audit.score || 0;
  const rating = score >= 0.9 ? "good" : score >= 0.5 ? "needs-improvement" : "poor";
  return {
    value: Math.round(value),
    unit,
    rating: rating as "good" | "needs-improvement" | "poor",
    displayValue: audit.displayValue || `${Math.round(value)}${unit}`,
  };
}

/** Create a metric result from raw value and thresholds */
function createMetric(
  value: number,
  unit: string,
  thresholds: { good: number; poor: number }
) {
  const rating =
    value <= thresholds.good
      ? "good"
      : value <= thresholds.poor
        ? "needs-improvement"
        : "poor";
  return {
    value: Math.round(value * 100) / 100,
    unit,
    rating: rating as "good" | "needs-improvement" | "poor",
    displayValue: `${Math.round(value)}${unit}`,
  };
}

/** Generate performance-related SEO issues */
function generatePerformanceIssues(score: number, existing: SEOIssue[]): SEOIssue[] {
  const issues = [...existing];

  if (score < 50) {
    issues.push({
      id: "poor-performance",
      title: "Poor Performance Score",
      description: `Performance score is ${score}/100. This significantly impacts SEO rankings.`,
      severity: "critical",
      category: "performance",
      fix: "Optimize images, minify CSS/JS, enable caching, and reduce server response time.",
    });
  } else if (score < 70) {
    issues.push({
      id: "moderate-performance",
      title: "Moderate Performance",
      description: `Performance score is ${score}/100. There's room for improvement.`,
      severity: "warning",
      category: "performance",
      fix: "Consider optimizing critical rendering path and reducing time to interactive.",
    });
  }

  return issues;
}

/** Calculate technical SEO score */
function calculateTechnicalScore(
  technical: TechnicalAnalysis,
  meta: MetaTagAnalysis
): number {
  let score = 100;

  if (!technical.hasRobotsTxt) score -= 10;
  if (!technical.hasSitemap) score -= 10;
  if (!technical.hasCanonical) score -= 10;
  if (!technical.hasSchemaMarkup) score -= 5;
  if (!technical.htmlLang) score -= 5;
  if (!technical.isHttps) score -= 20;
  if (!technical.hasFavicon) score -= 5;
  if (!meta.title) score -= 15;
  if (!meta.description) score -= 10;
  if (!meta.viewport) score -= 10;
  if (meta.duplicateMetaTags.length > 0) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/** Calculate content SEO score */
function calculateContentScore(
  headings: HeadingAnalysis,
  meta: MetaTagAnalysis,
  images: ImageAnalysis
): number {
  let score = 100;

  if (headings.h1Count === 0) score -= 20;
  if (headings.h1Count > 1) score -= 10;
  if (headings.h2Count === 0) score -= 5;
  if (!meta.ogTitle) score -= 5;
  if (!meta.ogDescription) score -= 5;
  if (!meta.ogImage) score -= 5;
  if (images.imagesWithoutAlt.length > 0) {
    score -= Math.min(20, images.imagesWithoutAlt.length * 5);
  }
  if (images.nonOptimizedImages.length > 0) {
    score -= Math.min(10, images.nonOptimizedImages.length * 2);
  }

  const titleLen = meta.titleLength;
  if (titleLen > 0 && (titleLen < META_TAG_LIMITS.TITLE_MIN || titleLen > META_TAG_LIMITS.TITLE_MAX)) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}
