"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME } from "@/constants";
import {
  Search,
  Globe,
  Clock,
  ArrowRight,
  FileText,
  Download,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
} from "lucide-react";

// ===========================================
// Reports Page - List of previous audit reports
// ===========================================

const mockReports = [
  {
    id: "1",
    url: "https://example.com",
    date: "Mar 10, 2026",
    overallScore: 82,
    technicalScore: 85,
    performanceScore: 78,
    contentScore: 84,
    issueCount: 8,
    trend: "up",
  },
  {
    id: "2",
    url: "https://shop.example.com",
    date: "Mar 9, 2026",
    overallScore: 65,
    technicalScore: 70,
    performanceScore: 55,
    contentScore: 72,
    issueCount: 15,
    trend: "down",
  },
  {
    id: "3",
    url: "https://blog.example.com",
    date: "Mar 8, 2026",
    overallScore: 91,
    technicalScore: 95,
    performanceScore: 88,
    contentScore: 90,
    issueCount: 3,
    trend: "up",
  },
  {
    id: "4",
    url: "https://docs.example.com",
    date: "Mar 7, 2026",
    overallScore: 55,
    technicalScore: 60,
    performanceScore: 45,
    contentScore: 62,
    issueCount: 22,
    trend: "down",
  },
  {
    id: "5",
    url: "https://landing.example.com",
    date: "Mar 6, 2026",
    overallScore: 78,
    technicalScore: 82,
    performanceScore: 74,
    contentScore: 79,
    issueCount: 10,
    trend: "up",
  },
];

export default function ReportsPage() {
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
              <span className="text-sm text-muted-foreground hidden sm:block">Reports</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SEO Reports</h1>
          <p className="text-muted-foreground">
            View all your previous SEO audit reports.
          </p>
        </div>

        <div className="space-y-4">
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="hover:border-white/[0.15] transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-white/[0.04] p-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{report.url}</h3>
                          {report.trend === "up" ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span>{report.issueCount} issues</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score chips */}
                      <div className="hidden md:flex items-center gap-2">
                        <ScoreChip label="Tech" score={report.technicalScore} />
                        <ScoreChip label="Perf" score={report.performanceScore} />
                        <ScoreChip label="Content" score={report.contentScore} />
                      </div>
                      <Badge
                        variant={
                          report.overallScore >= 80
                            ? "success"
                            : report.overallScore >= 60
                              ? "warning"
                              : "critical"
                        }
                        className="text-sm px-3 py-1"
                      >
                        {report.overallScore}/100
                      </Badge>
                      <Link href="/audit">
                        <Button variant="ghost" size="sm">
                          View <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ScoreChip({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="text-center">
      <div className={`text-xs font-bold ${color}`}>{score}</div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}
