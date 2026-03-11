import { PricingPlan } from "@/types";

// ===========================================
// Application Constants
// ===========================================

export const APP_NAME = "SEO Auto Fix";
export const APP_DESCRIPTION =
  "Automatically detect and fix SEO issues on any website. Get AI-powered suggestions, performance analysis, and comprehensive audit reports.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Navigation links for the main app
export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Audit", href: "/audit" },
  { label: "Reports", href: "/reports" },
  { label: "Competitors", href: "/competitors" },
  { label: "Monitoring", href: "/monitoring" },
] as const;

// Public navigation links (landing page)
export const PUBLIC_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

// SEO Score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_IMPROVEMENT: 50,
  POOR: 0,
} as const;

// Meta tag optimal lengths
export const META_TAG_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  DESCRIPTION_MIN: 120,
  DESCRIPTION_MAX: 160,
} as const;

// Image optimization thresholds
export const IMAGE_LIMITS = {
  MAX_FILE_SIZE: 200 * 1024, // 200KB
  RECOMMENDED_FORMAT: "webp",
} as const;

// Performance metric thresholds (based on Core Web Vitals)
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  SPEED_INDEX: { good: 3400, poor: 5800 },
  TBT: { good: 200, poor: 600 },
} as const;

// Pricing plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "5 SEO audits per month",
      "Basic SEO analysis",
      "Page speed insights",
      "Image SEO checker",
      "Export PDF reports",
    ],
    maxAudits: 5,
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    features: [
      "100 SEO audits per month",
      "Advanced SEO analysis",
      "AI-powered fix suggestions",
      "Competitor analysis",
      "Weekly monitoring",
      "Priority support",
      "API access",
    ],
    maxAudits: 100,
    highlighted: true,
    cta: "Start Pro Trial",
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    features: [
      "Unlimited SEO audits",
      "Full AI integration",
      "Competitor tracking",
      "Real-time monitoring",
      "Custom alerts",
      "White-label reports",
      "Dedicated support",
      "Custom integrations",
    ],
    maxAudits: -1,
    cta: "Contact Sales",
  },
];

// FAQ items for landing page
export const FAQ_ITEMS = [
  {
    question: "How does SEO Auto Fix analyze my website?",
    answer:
      "Our tool crawls your website using advanced web scraping technology, analyzing your HTML structure, meta tags, performance metrics, images, links, and more. We use Google's Lighthouse engine for performance scoring and AI to generate improvement suggestions.",
  },
  {
    question: "Is my website data secure?",
    answer:
      "Absolutely. We only analyze publicly accessible pages. Your data is encrypted at rest and in transit. We never share your audit results with third parties, and you can delete your data at any time.",
  },
  {
    question: "How accurate are the AI suggestions?",
    answer:
      "Our AI suggestions are powered by state-of-the-art language models trained on SEO best practices. While they provide excellent starting points, we recommend reviewing each suggestion in the context of your specific content and audience.",
  },
  {
    question: "Can I monitor multiple websites?",
    answer:
      "Yes! Pro and Enterprise plans allow you to monitor multiple websites. You'll receive automated weekly reports and instant alerts when SEO issues are detected.",
  },
  {
    question: "What's included in competitor analysis?",
    answer:
      "Our competitor analysis compares your website's SEO metrics against up to 5 competitors. You'll see score comparisons, keyword overlap analysis, and actionable insights to outperform your competition.",
  },
  {
    question: "Do I need technical knowledge to use this tool?",
    answer:
      "Not at all! SEO Auto Fix is designed for everyone — from marketing managers to developers. Our reports are clear and actionable, with specific fix instructions for every issue found.",
  },
];

// SEO issue categories for filtering
export const ISSUE_CATEGORIES = [
  { value: "all", label: "All Issues" },
  { value: "meta", label: "Meta Tags" },
  { value: "content", label: "Content" },
  { value: "technical", label: "Technical" },
  { value: "performance", label: "Performance" },
  { value: "images", label: "Images" },
  { value: "links", label: "Links" },
] as const;

// Chart colors for the dashboard
export const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  muted: "#6b7280",
} as const;
