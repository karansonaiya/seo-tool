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
import { META_TAG_LIMITS, PERFORMANCE_THRESHOLDS } from "@/constants";

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
    analyzeHeadings($, normalizedUrl),
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
  // Weighted: performance matters most (real Lighthouse score), then technical, then content
  const overallScore = Math.round(
    performanceScore * 0.40 + technicalScore * 0.35 + contentScore * 0.25
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 403) {
      throw new Error(
        `Access denied (403): The website "${url}" is blocking automated requests. Try a different URL or check if the site is publicly accessible.`
      );
    }

    if (response.status === 404) {
      throw new Error(`Page not found (404): The URL "${url}" does not exist.`);
    }

    if (response.status >= 400) {
      throw new Error(
        `HTTP error ${response.status}: Unable to access "${url}".`
      );
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 403) {
        throw new Error(
          `Access denied (403): The website is blocking automated requests. This site may require login or disallow crawlers.`
        );
      }
      if (status === 404) {
        throw new Error(`Page not found (404): The URL does not exist.`);
      }
      if (error.code === "ECONNREFUSED") {
        throw new Error(`Connection refused: Could not connect to "${url}".`);
      }
      if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
        throw new Error(`Request timed out: "${url}" took too long to respond.`);
      }
      throw new Error(`Failed to fetch page: ${error.message}`);
    }
    if (error instanceof Error) throw error;
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
  pageUrl: string
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

  // Check canonical URL mismatch — if canonical points to a different page, flag it
  if (canonical) {
    try {
      const canonicalNorm = new URL(canonical, pageUrl).href.replace(/\/$/, "");
      const pageNorm = pageUrl.replace(/\/$/, "");
      if (canonicalNorm !== pageNorm) {
        issues.push({
          id: "canonical-mismatch",
          title: "Canonical Points to Different URL",
          description: `The canonical tag points to "${canonical}", which differs from the current page URL. This may cause indexing of the wrong page.`,
          severity: "warning",
          category: "meta",
          fix: "Verify the canonical URL is intentional. It should match the preferred version of this page.",
        });
      }
    } catch {
      // invalid canonical URL
    }
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

/** Analyze heading hierarchy, word count, and content quality */
async function analyzeHeadings(
  $: cheerio.CheerioAPI,
  url: string
): Promise<HeadingAnalysis> {
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

  // --- Word count / thin content check ---
  // Remove script, style, nav, header, footer noise before counting
  const bodyClone = $.root().clone();
  bodyClone.find("script, style, nav, header, footer, aside, noscript").remove();
  const visibleText = bodyClone.text().replace(/\s+/g, " ").trim();
  const wordCount = visibleText
    .split(/\s+/)
    .filter((w) => w.length > 1).length;

  if (wordCount < 300 && wordCount > 0) {
    issues.push({
      id: "thin-content",
      title: "Thin Content",
      description: `Page has only ~${wordCount} words. Search engines prefer pages with substantial content (300+ words).`,
      severity: wordCount < 100 ? "critical" : "warning",
      category: "content",
      fix: "Add more meaningful content. Aim for at least 300–500 words on important pages.",
    });
  }

  // --- H1 keyword alignment with page title ---
  const pageTitle = $("title").text().trim().toLowerCase();
  const h1Text = h1Tags[0]?.toLowerCase() || "";
  if (h1Text && pageTitle) {
    const h1Words = h1Text.split(/\s+/).filter((w) => w.length > 3);
    const titleHasH1Keyword = h1Words.some((w) => pageTitle.includes(w));
    if (!titleHasH1Keyword) {
      issues.push({
        id: "h1-title-mismatch",
        title: "H1 and Title Tag Not Aligned",
        description:
          "The H1 heading and the page title share no common keywords. Aligning them signals topic relevance to search engines.",
        severity: "info",
        category: "content",
        fix: "Ensure your H1 and title tag share the primary keyword.",
      });
    }
  }

  // --- URL keyword in H1 ---
  try {
    const urlPath = new URL(url).pathname
      .replace(/[-_/]/g, " ")
      .toLowerCase()
      .trim();
    if (urlPath && h1Text && urlPath !== "/") {
      const urlWords = urlPath.split(/\s+/).filter((w) => w.length > 3);
      const h1HasUrlKeyword = urlWords.some((w) => h1Text.includes(w));
      if (!h1HasUrlKeyword && urlWords.length > 0) {
        issues.push({
          id: "h1-url-mismatch",
          title: "H1 Doesn't Reflect URL Keywords",
          description:
            "The URL path contains keywords not found in the H1 heading. Matching them improves topical relevance.",
          severity: "info",
          category: "content",
          fix: "Include your main URL keyword in the H1 heading.",
        });
      }
    }
  } catch {
    // invalid URL
  }

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

  // Check a sample of external links for broken status (limit to 15 to avoid rate limiting)
  // Skip internal links (same domain) and non-HTTP links to reduce false positives
  const externalLinksToCheck = allLinks
    .filter(({ href }) => {
      if (!href) return false;
      // Skip anchors, mailto, tel, javascript, data URIs
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        href.startsWith("data:")
      )
        return false;
      try {
        const u = new URL(href, baseUrl);
        // Only check absolute external URLs
        return (
          (u.protocol === "http:" || u.protocol === "https:") &&
          u.hostname !== baseUrlObj.hostname
        );
      } catch {
        return false;
      }
    })
    .slice(0, 15);

  for (const link of externalLinksToCheck) {
    try {
      const fullUrl = new URL(link.href, baseUrl).toString();
      let status = 0;

      try {
        // Try HEAD first (faster)
        const headRes = await axios.head(fullUrl, {
          timeout: 8000,
          maxRedirects: 3,
          validateStatus: () => true,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
        });
        status = headRes.status;

        // 405 = Method Not Allowed (HEAD not supported) — not broken, skip
        // 403 = server blocks HEAD checks — do not count as broken
        if (status === 405 || status === 403) continue;
      } catch {
        // HEAD failed completely — try GET with small range
        try {
          const getRes = await axios.get(fullUrl, {
            timeout: 8000,
            maxRedirects: 3,
            validateStatus: () => true,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              Range: "bytes=0-0",
            },
          });
          status = getRes.status;
        } catch {
          // Connection truly failed
          status = 0;
        }
      }

      // Only flag 404 and 410 as definitively broken (avoid false positives from 5xx, auth, etc.)
      if (status === 404 || status === 410) {
        brokenLinks.push({
          url: fullUrl,
          statusCode: status,
          anchorText: link.text,
          location: "page",
        });
      }
    } catch {
      // Invalid URL, skip
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
    const rawSrc = $(el).attr("src") || $(el).attr("data-src") || "";
    // Resolve relative URLs to absolute for consistent analysis
    let src = rawSrc;
    try {
      src = rawSrc ? new URL(rawSrc, baseUrl).href : rawSrc;
    } catch {
      src = rawSrc;
    }
    const alt = $(el).attr("alt") ?? null;
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
      format: rawSrc.split(".").pop()?.split("?")[0]?.toLowerCase() || null,
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
    const robotsResponse = await axios.get(`${origin}/robots.txt`, {
      timeout: 10000,
      validateStatus: (s) => s === 200,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    if (robotsResponse.status === 200) {
      hasRobotsTxt = true;
      robotsTxtContent =
        typeof robotsResponse.data === "string" ? robotsResponse.data : null;
    }
  } catch {
    // robots.txt not found
  }

  // Check for sitemap — try multiple strategies:
  // 1. Parse Sitemap: directive from robots.txt
  // 2. /sitemap.xml
  // 3. /sitemap_index.xml
  let hasSitemap = false;
  let sitemapUrl: string | null = null;

  // Strategy 1: Parse robots.txt for Sitemap directive
  if (robotsTxtContent) {
    const sitemapMatch = robotsTxtContent.match(/^Sitemap:\s*(.+)$/im);
    if (sitemapMatch) {
      sitemapUrl = sitemapMatch[1].trim();
      hasSitemap = true;
    }
  }

  // Strategy 2+3: Try common sitemap paths
  if (!hasSitemap) {
    const sitemapPaths = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap/sitemap.xml"];
    for (const path of sitemapPaths) {
      try {
        const sitemapResponse = await axios.get(`${origin}${path}`, {
          timeout: 8000,
          validateStatus: (s) => s === 200,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
        });
        if (sitemapResponse.status === 200) {
          hasSitemap = true;
          sitemapUrl = `${origin}${path}`;
          break;
        }
      } catch {
        // try next path
      }
    }
  }

  // Check canonical
  const canonical = $('link[rel="canonical"]').attr("href") || null;
  const hasCanonical = !!canonical;

  // Check Schema markup — handle single objects, @graph arrays, and root arrays
  const schemaTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html() || "{}";
      const data = JSON.parse(raw);

      const extractTypes = (obj: unknown): void => {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          obj.forEach(extractTypes);
          return;
        }
        const record = obj as Record<string, unknown>;
        if (record["@type"]) {
          const t = record["@type"];
          if (Array.isArray(t)) t.forEach((v) => schemaTypes.push(String(v)));
          else schemaTypes.push(String(t));
        }
        // Handle @graph
        if (Array.isArray(record["@graph"])) {
          (record["@graph"] as unknown[]).forEach(extractTypes);
        }
      };

      extractTypes(data);
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

const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

/**
 * Analyze performance using Google PageSpeed Insights API (mobile + desktop).
 * Works without an API key (rate-limited). With PAGESPEED_API_KEY env var, gets higher quotas.
 */
async function analyzePerformance(url: string): Promise<PerformanceAnalysis> {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const buildApiUrl = (strategy: "mobile" | "desktop") => {
    let u = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=seo&category=best-practices`;
    if (apiKey) u += `&key=${apiKey}`;
    return u;
  };

  // --------------------------------------------------
  // Step 1: Fetch mobile + desktop PageSpeed in parallel
  // --------------------------------------------------
  try {
    console.log(`[PageSpeed] Fetching mobile + desktop Lighthouse data for: ${url}`);

    const [mobileRes, desktopRes] = await Promise.allSettled([
      axios.get(buildApiUrl("mobile"), { timeout: 90000 }),
      axios.get(buildApiUrl("desktop"), { timeout: 90000 }),
    ]);

    const mobileLH =
      mobileRes.status === "fulfilled"
        ? mobileRes.value.data?.lighthouseResult
        : null;
    const desktopLH =
      desktopRes.status === "fulfilled"
        ? desktopRes.value.data?.lighthouseResult
        : null;

    if (mobileLH?.categories?.performance) {
      const mobileScore = Math.round((mobileLH.categories.performance.score || 0) * 100);
      const desktopScore =
        desktopLH?.categories?.performance
          ? Math.round((desktopLH.categories.performance.score || 0) * 100)
          : undefined;

      console.log(
        `[PageSpeed] Mobile: ${mobileScore}/100  Desktop: ${desktopScore ?? "N/A"}/100`
      );

      const audits = mobileLH.audits || {};
      const issues: SEOIssue[] = [];

      // Extract specific failing Lighthouse audits as actionable SEO issues
      const auditChecks: Array<{
        id: string;
        issueId: string;
        title: string;
        severity: SEOIssue["severity"];
        fix: string;
      }> = [
        {
          id: "render-blocking-resources",
          issueId: "render-blocking",
          title: "Render-Blocking Resources",
          severity: "warning",
          fix: "Eliminate render-blocking CSS/JS by deferring or inlining critical resources.",
        },
        {
          id: "unused-css-rules",
          issueId: "unused-css",
          title: "Unused CSS",
          severity: "warning",
          fix: "Remove unused CSS rules to reduce payload and improve parse time.",
        },
        {
          id: "unused-javascript",
          issueId: "unused-js",
          title: "Unused JavaScript",
          severity: "warning",
          fix: "Remove unused JS or use code-splitting to reduce bundle size.",
        },
        {
          id: "uses-optimized-images",
          issueId: "unoptimized-images",
          title: "Unoptimized Images",
          severity: "warning",
          fix: "Compress and resize images to reduce page weight.",
        },
        {
          id: "uses-text-compression",
          issueId: "no-text-compression",
          title: "Text Compression Not Enabled",
          severity: "warning",
          fix: "Enable gzip or Brotli compression on your server.",
        },
        {
          id: "uses-long-cache-ttl",
          issueId: "short-cache-ttl",
          title: "Short Cache TTL",
          severity: "info",
          fix: "Set long cache TTLs for static assets (CSS, JS, images).",
        },
        {
          id: "server-response-time",
          issueId: "slow-ttfb",
          title: "Slow Server Response Time (TTFB)",
          severity: "warning",
          fix: "Optimize server response: use CDN, caching, or upgrade hosting.",
        },
        {
          id: "largest-contentful-paint-element",
          issueId: "slow-lcp",
          title: "Slow Largest Contentful Paint (LCP)",
          severity: "critical",
          fix: "Optimize the largest visible element (hero image or heading) to load faster.",
        },
        {
          id: "total-blocking-time",
          issueId: "high-tbt",
          title: "High Total Blocking Time (TBT)",
          severity: "warning",
          fix: "Reduce long JS tasks and minimize main thread blocking.",
        },
        {
          id: "cumulative-layout-shift",
          issueId: "high-cls",
          title: "High Cumulative Layout Shift (CLS)",
          severity: "warning",
          fix: "Set explicit width/height on images and avoid injecting content above existing content.",
        },
      ];

      for (const check of auditChecks) {
        const audit = audits[check.id];
        if (!audit) continue;
        // Only add issue if audit score is not passing (< 0.9) and has savings
        const auditScore = audit.score ?? 1;
        const hasSavings =
          (audit.details?.overallSavingsMs ?? audit.details?.overallSavingsBytes ?? 0) > 0 ||
          (audit.numericValue ?? 0) > 0;
        if (auditScore < 0.9 && hasSavings) {
          issues.push({
            id: check.issueId,
            title: check.title,
            description:
              audit.displayValue
                ? `${audit.title}: ${audit.displayValue}`
                : audit.description || check.title,
            severity: check.severity,
            category: "performance",
            fix: check.fix,
          });
        }
      }

      const result: PerformanceAnalysis = {
        score: mobileScore,
        desktopScore,
        lcp: extractMetric(audits["largest-contentful-paint"], "ms"),
        cls: extractMetric(audits["cumulative-layout-shift"], ""),
        fid: extractMetric(audits["max-potential-fid"], "ms"),
        fcp: extractMetric(audits["first-contentful-paint"], "ms"),
        ttfb: extractMetric(audits["server-response-time"], "ms"),
        speedIndex: extractMetric(audits["speed-index"], "ms"),
        totalBlockingTime: extractMetric(audits["total-blocking-time"], "ms"),
        pageSize: audits["total-byte-weight"]?.numericValue || 0,
        requestCount: audits["network-requests"]?.details?.items?.length || 0,
        unusedCss: audits["unused-css-rules"]?.details?.overallSavingsBytes || 0,
        unusedJs: audits["unused-javascript"]?.details?.overallSavingsBytes || 0,
        renderBlockingResources:
          audits["render-blocking-resources"]?.details?.items?.length || 0,
        issues,
      };

      result.issues = generatePerformanceIssues(mobileScore, result.issues);
      return result;
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[PageSpeed] API call failed: ${errMsg}. Using HTML-based estimation.`);
  }

  // --------------------------------------------------
  // Step 2: Fallback — HTML-based estimation
  //         Used ONLY when PageSpeed API is unreachable.
  // --------------------------------------------------
  console.log(`[PageSpeed] Falling back to HTML-based estimation for: ${url}`);

  let responseTime = 5000;
  let htmlSize = 0;
  let scriptCount = 0;
  let stylesheetCount = 0;
  let totalImgCount = 0;

  const startTime = Date.now();
  try {
    const resp = await axios.get(url, {
      timeout: 30000,
      headers: { "User-Agent": CHROME_UA },
    });
    responseTime = Date.now() - startTime;
    const html = typeof resp.data === "string" ? resp.data : "";
    htmlSize = Buffer.byteLength(html, "utf8");

    const $fb = cheerio.load(html);
    scriptCount = $fb("script[src]").length;
    stylesheetCount = $fb('link[rel="stylesheet"]').length;
    totalImgCount = $fb("img").length;
  } catch {
    responseTime = Date.now() - startTime;
  }

  let estimatedScore = 50;
  if (responseTime < 200) estimatedScore += 10;
  else if (responseTime < 600) estimatedScore += 5;
  else if (responseTime > 3000) estimatedScore -= 20;
  else if (responseTime > 1500) estimatedScore -= 10;
  if (htmlSize > 500000) estimatedScore -= 15;
  else if (htmlSize > 200000) estimatedScore -= 8;
  else if (htmlSize < 50000) estimatedScore += 5;
  if (scriptCount > 20) estimatedScore -= 15;
  else if (scriptCount > 10) estimatedScore -= 8;
  else if (scriptCount > 5) estimatedScore -= 3;
  if (stylesheetCount > 10) estimatedScore -= 8;
  else if (stylesheetCount > 5) estimatedScore -= 3;
  if (totalImgCount > 30) estimatedScore -= 5;
  estimatedScore = Math.max(0, Math.min(100, estimatedScore));

  const estimatedFcp = responseTime * 3;
  const estimatedLcp = responseTime * 6;
  const estimatedTbt = scriptCount * 150;
  const estimatedSi = responseTime * 5;

  const fallbackIssues: SEOIssue[] = [
    {
      id: "estimated-performance",
      title: "Estimated Performance Metrics",
      description:
        "Performance metrics were estimated from HTML analysis because the Google PageSpeed API was unavailable. For accurate Lighthouse scores, set PAGESPEED_API_KEY in your environment.",
      severity: "info",
      category: "performance",
      fix: "Set the PAGESPEED_API_KEY environment variable for precise Lighthouse-based scoring.",
    },
  ];

  const performanceResult: PerformanceAnalysis = {
    score: estimatedScore,
    lcp: createMetric(estimatedLcp, "ms", PERFORMANCE_THRESHOLDS.LCP),
    cls: createMetric(0.1, "", { good: 0.1, poor: 0.25 }),
    fid: createMetric(estimatedTbt * 0.5, "ms", PERFORMANCE_THRESHOLDS.FID),
    fcp: createMetric(estimatedFcp, "ms", PERFORMANCE_THRESHOLDS.FCP),
    ttfb: createMetric(responseTime, "ms", PERFORMANCE_THRESHOLDS.TTFB),
    speedIndex: createMetric(estimatedSi, "ms", PERFORMANCE_THRESHOLDS.SPEED_INDEX),
    totalBlockingTime: createMetric(estimatedTbt, "ms", PERFORMANCE_THRESHOLDS.TBT),
    pageSize: htmlSize,
    requestCount: scriptCount + stylesheetCount + totalImgCount,
    unusedCss: 0,
    unusedJs: 0,
    renderBlockingResources: scriptCount + stylesheetCount,
    issues: generatePerformanceIssues(estimatedScore, fallbackIssues),
  };

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

  // Format display value — CLS and other unitless metrics need decimal precision
  let displayValue: string;
  if (!unit) {
    displayValue = (Math.round(value * 1000) / 1000).toString();
  } else {
    displayValue = `${Math.round(value)}${unit}`;
  }

  return {
    value: Math.round(value * 1000) / 1000,
    unit,
    rating: rating as "good" | "needs-improvement" | "poor",
    displayValue,
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

  // Heading structure
  if (headings.h1Count === 0) score -= 20;
  else if (headings.h1Count > 1) score -= 10;
  if (headings.h2Count === 0) score -= 5;

  // Thin content penalty (word count is stored via issues presence)
  const hasThinContent = headings.issues.some((i) => i.id === "thin-content");
  if (hasThinContent) score -= 15;

  // H1/title keyword alignment
  const hasH1TitleMismatch = headings.issues.some((i) => i.id === "h1-title-mismatch");
  if (hasH1TitleMismatch) score -= 5;

  // Open Graph completeness
  if (!meta.ogTitle) score -= 5;
  if (!meta.ogDescription) score -= 5;
  if (!meta.ogImage) score -= 5;

  // Description quality
  const descLen = meta.descriptionLength;
  if (descLen > 0 && descLen < META_TAG_LIMITS.DESCRIPTION_MIN) score -= 5;

  // Images
  if (images.imagesWithoutAlt.length > 0) {
    score -= Math.min(15, images.imagesWithoutAlt.length * 5);
  }
  if (images.nonOptimizedImages.length > 0) {
    score -= Math.min(5, images.nonOptimizedImages.length * 1);
  }

  // Title length
  const titleLen = meta.titleLength;
  if (titleLen > 0 && (titleLen < META_TAG_LIMITS.TITLE_MIN || titleLen > META_TAG_LIMITS.TITLE_MAX)) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}
