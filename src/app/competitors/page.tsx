"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { competitorAnalysisSchema, type CompetitorAnalysisInput } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBarChart } from "@/components/dashboard/charts";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME } from "@/constants";
import {
  Search,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  Globe,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

// ===========================================
// Competitor Analysis Page
// ===========================================

export default function CompetitorsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompetitorAnalysisInput>({
    resolver: zodResolver(competitorAnalysisSchema),
  });

  const addCompetitor = () => {
    if (competitorUrls.length < 5) {
      setCompetitorUrls([...competitorUrls, ""]);
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitorUrls(competitorUrls.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 3000);
  };

  // Mock comparison data
  const mockComparisonData = [
    { name: "Your Site", score: 78 },
    { name: "Competitor 1", score: 85 },
    { name: "Competitor 2", score: 72 },
    { name: "Competitor 3", score: 90 },
  ];

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
                Competitors
              </span>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Compare your website&apos;s SEO performance against your competitors.
          </p>
        </div>

        {!hasResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Your URL */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="https://yourwebsite.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Competitor URLs */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Competitor URLs (up to 5)
                  </label>
                  <div className="space-y-3">
                    {competitorUrls.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={`https://competitor${index + 1}.com`}
                            className="pl-10"
                          />
                        </div>
                        {competitorUrls.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCompetitor(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {competitorUrls.length < 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={addCompetitor}
                    >
                      <Plus className="h-4 w-4" />
                      Add Competitor
                    </Button>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing Competitors...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Start Comparison
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Winner badge */}
            <Card className="glow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-xl bg-yellow-500/10 p-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Competitor 3 leads with a score of 90
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your site scores 78 — here are areas where you can improve.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Score comparison chart */}
            <ScoreBarChart data={mockComparisonData} />

            {/* Detailed comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">📊 Keyword Overlap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["seo tools", "website audit", "page speed", "meta tags", "backlinks"].map(
                    (keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]"
                      >
                        <span className="text-sm">{keyword}</span>
                        <Badge variant="info">Shared</Badge>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">🎯 Your Advantage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Technical SEO", status: "Leading" },
                    { label: "Content Quality", status: "Leading" },
                    { label: "Page Speed", status: "Behind" },
                    { label: "Mobile UX", status: "Tied" },
                    { label: "Schema Markup", status: "Behind" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]"
                    >
                      <span className="text-sm">{item.label}</span>
                      <Badge
                        variant={
                          item.status === "Leading"
                            ? "success"
                            : item.status === "Behind"
                              ? "critical"
                              : "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" onClick={() => setHasResults(false)}>
              <ArrowLeft className="h-4 w-4" />
              New Comparison
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
