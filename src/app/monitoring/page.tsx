"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME } from "@/constants";
import {
  Search,
  Globe,
  Bell,
  Plus,
  Settings,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Pause,
  Play,
  Trash2,
} from "lucide-react";

// ===========================================
// Monitoring Page
// ===========================================

const mockMonitoredSites = [
  {
    name: "Main Website",
    url: "https://example.com",
    lastScore: 82,
    previousScore: 78,
    lastAudit: "2 hours ago",
    isActive: true,
    alerts: 0,
  },
  {
    name: "Online Store",
    url: "https://shop.example.com",
    lastScore: 65,
    previousScore: 70,
    lastAudit: "1 day ago",
    isActive: true,
    alerts: 3,
  },
  {
    name: "Dev Blog",
    url: "https://blog.example.com",
    lastScore: 91,
    previousScore: 88,
    lastAudit: "3 hours ago",
    isActive: true,
    alerts: 0,
  },
  {
    name: "Documentation",
    url: "https://docs.example.com",
    lastScore: 55,
    previousScore: 58,
    lastAudit: "5 days ago",
    isActive: false,
    alerts: 5,
  },
];

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-mesh grid-pattern">
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
                Monitoring
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">SEO Monitoring</h1>
            <p className="text-muted-foreground">
              Track your websites and get alerts when SEO issues arise.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </div>

        <div className="space-y-4">
          {mockMonitoredSites.map((site, index) => {
            const scoreChange = site.lastScore - site.previousScore;
            const isUp = scoreChange >= 0;

            return (
              <motion.div
                key={site.url}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className={`hover:border-white/[0.15] transition-all ${
                    !site.isActive ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-xl p-3 ${
                            site.isActive
                              ? "bg-emerald-500/10"
                              : "bg-gray-500/10"
                          }`}
                        >
                          <Globe
                            className={`h-5 w-5 ${
                              site.isActive
                                ? "text-emerald-500"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{site.name}</h3>
                            <Badge variant={site.isActive ? "success" : "outline"}>
                              {site.isActive ? "Active" : "Paused"}
                            </Badge>
                            {site.alerts > 0 && (
                              <Badge variant="critical">
                                <Bell className="h-3 w-3 mr-1" />
                                {site.alerts} alerts
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {site.url} · Last audit {site.lastAudit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-2xl font-bold">
                              {site.lastScore}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /100
                            </span>
                          </div>
                          <div
                            className={`text-xs flex items-center gap-0.5 ${
                              isUp ? "text-emerald-500" : "text-red-500"
                            }`}
                          >
                            {isUp ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {isUp ? "+" : ""}
                            {scoreChange} from last audit
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {site.isActive ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
