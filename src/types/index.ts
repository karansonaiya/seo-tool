// ===========================================
// SEO Auto Fix Tool - TypeScript Type Definitions
// ===========================================

/** Represents the overall SEO audit result for a website */
export interface SEOAuditResult {
  url: string;
  timestamp: string;
  overallScore: number;
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
  metaTags: MetaTagAnalysis;
  headings: HeadingAnalysis;
  links: LinkAnalysis;
  images: ImageAnalysis;
  technical: TechnicalAnalysis;
  performance: PerformanceAnalysis;
  aiSuggestions?: AISuggestion[];
  issues: SEOIssue[];
}

/** Meta tag analysis results */
export interface MetaTagAnalysis {
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  viewport: string | null;
  charset: string | null;
  duplicateMetaTags: string[];
  issues: SEOIssue[];
}

/** Heading hierarchy analysis */
export interface HeadingAnalysis {
  h1Count: number;
  h1Tags: string[];
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  hierarchy: HeadingNode[];
  issues: SEOIssue[];
}

/** Represents a heading node in the document hierarchy */
export interface HeadingNode {
  level: number;
  text: string;
  children?: HeadingNode[];
}

/** Link analysis results */
export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: BrokenLink[];
  redirectChains: RedirectChain[];
  noFollowLinks: number;
  issues: SEOIssue[];
}

/** Represents a broken link found during crawl */
export interface BrokenLink {
  url: string;
  statusCode: number;
  anchorText: string;
  location: string;
}

/** Represents a redirect chain */
export interface RedirectChain {
  originalUrl: string;
  finalUrl: string;
  hops: number;
  redirects: string[];
}

/** Image SEO analysis */
export interface ImageAnalysis {
  totalImages: number;
  imagesWithoutAlt: ImageInfo[];
  largeImages: ImageInfo[];
  nonOptimizedImages: ImageInfo[];
  imagesWithoutLazyLoad: ImageInfo[];
  issues: SEOIssue[];
}

/** Image information */
export interface ImageInfo {
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string | null;
  hasLazyLoading: boolean;
}

/** Technical SEO analysis */
export interface TechnicalAnalysis {
  hasRobotsTxt: boolean;
  robotsTxtContent: string | null;
  hasSitemap: boolean;
  sitemapUrl: string | null;
  hasCanonical: boolean;
  canonicalUrl: string | null;
  hasSchemaMarkup: boolean;
  schemaTypes: string[];
  htmlLang: string | null;
  isHttps: boolean;
  hasFavicon: boolean;
  hasAppleTouchIcon: boolean;
  internalLinkCount: number;
  issues: SEOIssue[];
}

/** Performance analysis results (Lighthouse-like) */
export interface PerformanceAnalysis {
  score: number;
  desktopScore?: number;
  lcp: MetricResult;
  cls: MetricResult;
  fid: MetricResult;
  fcp: MetricResult;
  ttfb: MetricResult;
  speedIndex: MetricResult;
  totalBlockingTime: MetricResult;
  pageSize: number;
  requestCount: number;
  unusedCss: number;
  unusedJs: number;
  renderBlockingResources: number;
  issues: SEOIssue[];
}

/** Individual performance metric */
export interface MetricResult {
  value: number;
  unit: string;
  rating: "good" | "needs-improvement" | "poor";
  displayValue: string;
}

/** AI-generated SEO improvement suggestion */
export interface AISuggestion {
  type: "title" | "description" | "content" | "keyword" | "schema" | "general";
  original: string | null;
  suggested: string;
  reasoning: string;
  impact: "high" | "medium" | "low";
}

/** Individual SEO issue found during audit */
export interface SEOIssue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  category: "meta" | "content" | "technical" | "performance" | "images" | "links";
  fix?: string;
}

/** Website monitoring configuration */
export interface MonitoredWebsite {
  _id: string;
  userId: string;
  url: string;
  name: string;
  lastAudit: string;
  lastScore: number;
  scoreHistory: ScoreHistoryEntry[];
  alerts: AlertConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Score history entry for trend tracking */
export interface ScoreHistoryEntry {
  date: string;
  overallScore: number;
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
}

/** Alert configuration for monitoring */
export interface AlertConfig {
  scoreDropThreshold: number;
  notifyOnBrokenLinks: boolean;
  notifyOnPerformanceDrop: boolean;
  emailNotifications: boolean;
}

/** Competitor analysis result */
export interface CompetitorAnalysis {
  mainSite: CompetitorSiteData;
  competitors: CompetitorSiteData[];
  comparison: CompetitorComparison;
}

/** Individual competitor site data */
export interface CompetitorSiteData {
  url: string;
  overallScore: number;
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
  keywordCount: number;
  backlinks: number;
}

/** Comparison data between competitors */
export interface CompetitorComparison {
  keywordOverlap: string[];
  uniqueKeywords: Record<string, string[]>;
  scoreComparison: Record<string, number>;
}

/** User type for authentication */
export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  plan: "free" | "pro" | "enterprise";
  auditsThisMonth: number;
  maxAuditsPerMonth: number;
  createdAt: string;
}

/** Pricing plan definition */
export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  maxAudits: number;
  highlighted?: boolean;
  cta: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Dashboard stats */
export interface DashboardStats {
  totalAudits: number;
  averageScore: number;
  monitoredSites: number;
  issuesFixed: number;
  recentAudits: SEOAuditResult[];
  scoreOverTime: ScoreHistoryEntry[];
}

/** Crawl job status */
export interface CrawlJob {
  id: string;
  url: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  result?: SEOAuditResult;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
