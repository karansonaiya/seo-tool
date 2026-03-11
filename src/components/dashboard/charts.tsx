"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/constants";

interface ScoreChartProps {
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
  overallScore: number;
}

/**
 * Radar chart showing the breakdown of SEO scores across categories.
 */
export function SEORadarChart({
  technicalScore,
  performanceScore,
  contentScore,
  overallScore,
}: ScoreChartProps) {
  const data = [
    { subject: "Technical", score: technicalScore, fullMark: 100 },
    { subject: "Performance", score: performanceScore, fullMark: 100 },
    { subject: "Content", score: contentScore, fullMark: 100 },
    { subject: "Overall", score: overallScore, fullMark: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">SEO Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke={CHART_COLORS.primary}
              fill={CHART_COLORS.primary}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ScoreBarChartProps {
  data: Array<{ name: string; score: number }>;
}

/**
 * Bar chart for comparing scores across different metrics.
 */
export function ScoreBarChart({ data }: ScoreBarChartProps) {
  const getBarColor = (score: number) => {
    if (score >= 90) return CHART_COLORS.success;
    if (score >= 70) return CHART_COLORS.warning;
    if (score >= 50) return "#f97316";
    return CHART_COLORS.danger;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,15,20,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface HistoryChartProps {
  data: Array<{
    date: string;
    overallScore: number;
    technicalScore: number;
    performanceScore: number;
    contentScore: number;
  }>;
}

/**
 * Area chart showing score trends over time.
 */
export function ScoreHistoryChart({ data }: HistoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTechnical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,15,20,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="overallScore"
              name="Overall"
              stroke={CHART_COLORS.primary}
              fill="url(#colorOverall)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="technicalScore"
              name="Technical"
              stroke={CHART_COLORS.success}
              fill="url(#colorTechnical)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
