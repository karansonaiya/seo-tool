"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/seo/score-gauge";
import { ScoreHistoryChart, ScoreBarChart } from "@/components/dashboard/charts";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME, NAV_LINKS } from "@/constants";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  Activity,
  FileSearch,
  Settings,
  Users,
  Bell,
  LogOut,
} from "lucide-react";

// ===========================================
// Dashboard Page
// ===========================================

// Mock data for demonstration
const mockStats = {
  totalAudits: 47,
  averageScore: 74,
  monitoredSites: 5,
  issuesFixed: 128,
};

const mockRecentAudits = [
  { url: "https://example.com", score: 82, date: "2 hours ago", trend: "up" },
  { url: "https://shop.example.com", score: 65, date: "5 hours ago", trend: "down" },
  { url: "https://blog.example.com", score: 91, date: "1 day ago", trend: "up" },
  { url: "https://docs.example.com", score: 55, date: "2 days ago", trend: "down" },
];

const mockScoreHistory = [
  { date: "Jan", overallScore: 62, technicalScore: 70, performanceScore: 55, contentScore: 60 },
  { date: "Feb", overallScore: 68, technicalScore: 72, performanceScore: 62, contentScore: 70 },
  { date: "Mar", overallScore: 71, technicalScore: 78, performanceScore: 65, contentScore: 72 },
  { date: "Apr", overallScore: 75, technicalScore: 80, performanceScore: 70, contentScore: 76 },
  { date: "May", overallScore: 78, technicalScore: 85, performanceScore: 72, contentScore: 78 },
  { date: "Jun", overallScore: 82, technicalScore: 88, performanceScore: 78, contentScore: 80 },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-mesh grid-pattern">
      {/* Sidebar + Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-40">
          <div className="flex flex-col h-full glass border-r border-white/[0.06]">
            {/* Logo */}
            <div className="flex items-center gap-2 px-6 h-16 border-b border-white/[0.06]">
              <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {[
                { icon: <BarChart3 className="h-4 w-4" />, label: "Dashboard", href: "/dashboard", active: true },
                { icon: <FileSearch className="h-4 w-4" />, label: "Audit", href: "/audit" },
                { icon: <Activity className="h-4 w-4" />, label: "Reports", href: "/reports" },
                { icon: <Users className="h-4 w-4" />, label: "Competitors", href: "/competitors" },
                { icon: <Bell className="h-4 w-4" />, label: "Monitoring", href: "/monitoring" },
                { icon: <Settings className="h-4 w-4" />, label: "Settings", href: "/settings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-white border border-indigo-500/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Upgrade CTA */}
            <div className="px-4 py-4">
              <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium mb-2">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Unlock AI suggestions & monitoring
                  </p>
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <header className="glass sticky top-0 z-30 border-b border-white/[0.06]">
            <div className="flex items-center justify-between h-16 px-6">
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  Overview of your SEO performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="w-8 h-8 rounded-full ring-2 ring-white/10"
                  />
                )}
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {session?.user?.name}
                </span>
                <Link href="/audit">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    New Audit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Audits",
                  value: mockStats.totalAudits,
                  icon: <FileSearch className="h-5 w-5" />,
                  color: "from-blue-500 to-cyan-500",
                  change: "+12 this month",
                },
                {
                  label: "Average Score",
                  value: mockStats.averageScore,
                  icon: <BarChart3 className="h-5 w-5" />,
                  color: "from-emerald-500 to-green-500",
                  change: "+5 from last month",
                },
                {
                  label: "Monitored Sites",
                  value: mockStats.monitoredSites,
                  icon: <Globe className="h-5 w-5" />,
                  color: "from-purple-500 to-pink-500",
                  change: "All active",
                },
                {
                  label: "Issues Fixed",
                  value: mockStats.issuesFixed,
                  icon: <CheckCircle2 className="h-5 w-5" />,
                  color: "from-yellow-500 to-orange-500",
                  change: "+34 this week",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:border-white/[0.15] transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`rounded-xl bg-gradient-to-r ${stat.color} p-2.5`}
                        >
                          <span className="text-white">{stat.icon}</span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="text-[10px] text-emerald-500 mt-1">
                        {stat.change}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreHistoryChart data={mockScoreHistory} />
              <ScoreBarChart
                data={[
                  { name: "example.com", score: 82 },
                  { name: "shop.example", score: 65 },
                  { name: "blog.example", score: 91 },
                  { name: "docs.example", score: 55 },
                ]}
              />
            </div>

            {/* Recent Audits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Audits</CardTitle>
                <Link href="/reports">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentAudits.map((audit, index) => (
                    <motion.div
                      key={audit.url}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/[0.04] p-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{audit.url}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {audit.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {audit.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <Badge
                          variant={
                            audit.score >= 80
                              ? "success"
                              : audit.score >= 60
                                ? "warning"
                                : "critical"
                          }
                        >
                          {audit.score}/100
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
