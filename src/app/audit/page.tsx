"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSEOAudit } from "@/hooks/useSEOAudit";
import { AuditForm } from "@/components/forms/audit-form";
import { ScoreGauge } from "@/components/seo/score-gauge";
import { IssuesList } from "@/components/seo/issues-list";
import { AISuggestionsPanel } from "@/components/seo/ai-suggestions";
import { SEORadarChart, ScoreBarChart } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { ISSUE_CATEGORIES, APP_NAME } from "@/constants";
import {
  Search,
  ArrowLeft,
  Download,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  FileText,
  Image,
  Link2,
  Settings,
  Zap,
  Sparkles,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

// ===========================================
// Audit Page - Main SEO Audit Tool Interface
// ===========================================

export default function AuditPage() {
  const { result, isLoading, error, progress, runAudit, reset } = useSEOAudit();
  const [issueFilter, setIssueFilter] = useState("all");

  return (
    <div className="min-h-screen bg-mesh grid-pattern">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">{APP_NAME}</span>
              </Link>
              <span className="text-muted-foreground hidden sm:block">/</span>
              <span className="text-sm text-muted-foreground hidden sm:block">
                SEO Audit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {result && (
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">New Audit</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If no result yet, show the audit form */}
        {!result && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 mb-6">
                <Globe className="h-8 w-8 text-indigo-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Analyze Your Website&apos;s SEO
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Enter any URL below and we&apos;ll run a comprehensive SEO audit
                covering meta tags, performance, images, links, and more.
              </p>
            </motion.div>

            <AuditForm onSubmit={runAudit} isLoading={isLoading} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="relative mb-6">
                <div className="animate-float">
                  <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 inline-block">
                    <Search className="h-10 w-10 text-indigo-400 animate-pulse-subtle" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Analyzing SEO...
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Crawling page, checking meta tags, analyzing performance, and
                generating AI suggestions.
              </p>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{progress}% complete</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* URL & timestamp header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl font-bold">SEO Audit Report</h1>
                    <Badge
                      variant={
                        result.overallScore >= 70
                          ? "success"
                          : result.overallScore >= 50
                            ? "warning"
                            : "critical"
                      }
                    >
                      Score: {result.overallScore}/100
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {result.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ScoreGauge
                  score={result.overallScore}
                  label="Overall Score"
                  size="md"
                />
                <ScoreGauge
                  score={result.technicalScore}
                  label="Technical SEO"
                  size="md"
                />
                <ScoreGauge
                  score={result.performanceScore}
                  label="Performance"
                  size="md"
                />
                <ScoreGauge
                  score={result.contentScore}
                  label="Content SEO"
                  size="md"
                />
              </div>

              {/* Issue summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-xl bg-red-500/10 p-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {result.issues.filter((i) => i.severity === "critical").length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Critical Issues
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-xl bg-yellow-500/10 p-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {result.issues.filter((i) => i.severity === "warning").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-xl bg-emerald-500/10 p-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {50 - result.issues.length > 0 ? 50 - result.issues.length : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Checks Passed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabbed results */}
              <Tabs defaultValue="issues" className="w-full">
                <TabsList className="w-full sm:w-auto flex flex-wrap gap-1">
                  <TabsTrigger value="issues">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="meta">
                    <FileText className="h-4 w-4 mr-1" />
                    Meta Tags
                  </TabsTrigger>
                  <TabsTrigger value="performance">
                    <Zap className="h-4 w-4 mr-1" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="charts">
                    <Settings className="h-4 w-4 mr-1" />
                    Charts
                  </TabsTrigger>
                </TabsList>

                {/* Issues Tab */}
                <TabsContent value="issues">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ISSUE_CATEGORIES.map((cat) => (
                      <Button
                        key={cat.value}
                        variant={issueFilter === cat.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIssueFilter(cat.value)}
                      >
                        {cat.label}
                        {cat.value !== "all" && (
                          <span className="ml-1 text-xs opacity-70">
                            (
                            {
                              result.issues.filter(
                                (i) => i.category === cat.value
                              ).length
                            }
                            )
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                  <IssuesList issues={result.issues} filter={issueFilter} />
                </TabsContent>

                {/* Meta Tags Tab */}
                <TabsContent value="meta">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Basic Meta Tags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <MetaItem
                          label="Title"
                          value={result.metaTags.title}
                          maxLength={60}
                          currentLength={result.metaTags.titleLength}
                        />
                        <MetaItem
                          label="Description"
                          value={result.metaTags.description}
                          maxLength={160}
                          currentLength={result.metaTags.descriptionLength}
                        />
                        <MetaItem
                          label="Canonical"
                          value={result.metaTags.canonical}
                        />
                        <MetaItem
                          label="Robots"
                          value={result.metaTags.robots}
                        />
                        <MetaItem
                          label="Viewport"
                          value={result.metaTags.viewport}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Social & Open Graph
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <MetaItem
                          label="OG Title"
                          value={result.metaTags.ogTitle}
                        />
                        <MetaItem
                          label="OG Description"
                          value={result.metaTags.ogDescription}
                        />
                        <MetaItem
                          label="OG Image"
                          value={result.metaTags.ogImage}
                        />
                        <MetaItem
                          label="Twitter Card"
                          value={result.metaTags.twitterCard}
                        />
                        <MetaItem
                          label="Twitter Title"
                          value={result.metaTags.twitterTitle}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <PerformanceMetricCard
                      label="LCP"
                      value={result.performance.lcp.displayValue}
                      rating={result.performance.lcp.rating}
                      description="Largest Contentful Paint"
                    />
                    <PerformanceMetricCard
                      label="CLS"
                      value={result.performance.cls.displayValue}
                      rating={result.performance.cls.rating}
                      description="Cumulative Layout Shift"
                    />
                    <PerformanceMetricCard
                      label="FID"
                      value={result.performance.fid.displayValue}
                      rating={result.performance.fid.rating}
                      description="First Input Delay"
                    />
                    <PerformanceMetricCard
                      label="FCP"
                      value={result.performance.fcp.displayValue}
                      rating={result.performance.fcp.rating}
                      description="First Contentful Paint"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <PerformanceMetricCard
                      label="TTFB"
                      value={result.performance.ttfb.displayValue}
                      rating={result.performance.ttfb.rating}
                      description="Time to First Byte"
                    />
                    <PerformanceMetricCard
                      label="Speed Index"
                      value={result.performance.speedIndex.displayValue}
                      rating={result.performance.speedIndex.rating}
                      description="Speed Index"
                    />
                    <PerformanceMetricCard
                      label="TBT"
                      value={result.performance.totalBlockingTime.displayValue}
                      rating={result.performance.totalBlockingTime.rating}
                      description="Total Blocking Time"
                    />
                  </div>
                </TabsContent>

                {/* AI Suggestions Tab */}
                <TabsContent value="ai">
                  <AISuggestionsPanel
                    suggestions={result.aiSuggestions || []}
                  />
                </TabsContent>

                {/* Charts Tab */}
                <TabsContent value="charts">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SEORadarChart
                      technicalScore={result.technicalScore}
                      performanceScore={result.performanceScore}
                      contentScore={result.contentScore}
                      overallScore={result.overallScore}
                    />
                    <ScoreBarChart
                      data={[
                        { name: "Technical", score: result.technicalScore },
                        { name: "Performance", score: result.performanceScore },
                        { name: "Content", score: result.contentScore },
                        { name: "Overall", score: result.overallScore },
                      ]}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ------ Helper sub-components ------

function MetaItem({
  label,
  value,
  maxLength,
  currentLength,
}: {
  label: string;
  value: string | null;
  maxLength?: number;
  currentLength?: number;
}) {
  const isPresent = value !== null && value !== "";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {isPresent ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-red-500" />
        )}
      </div>
      <p className="text-sm truncate">
        {isPresent ? value : <span className="text-red-400 italic">Missing</span>}
      </p>
      {maxLength && currentLength !== undefined && isPresent && (
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {currentLength}/{maxLength} characters
          {currentLength > maxLength && (
            <span className="text-yellow-500 ml-1">(too long)</span>
          )}
        </p>
      )}
    </div>
  );
}

function PerformanceMetricCard({
  label,
  value,
  rating,
  description,
}: {
  label: string;
  value: string;
  rating: string;
  description: string;
}) {
  const ratingColors = {
    good: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    "needs-improvement": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    poor: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  const color = ratingColors[rating as keyof typeof ratingColors] || ratingColors.poor;

  return (
    <Card className="hover:border-white/[0.15] transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}
          >
            {rating === "good"
              ? "Good"
              : rating === "needs-improvement"
                ? "Needs Work"
                : "Poor"}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
