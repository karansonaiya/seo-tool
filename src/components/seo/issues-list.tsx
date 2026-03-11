"use client";

import { SEOIssue } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  XCircle,
  Info,
  Wrench,
  Image,
  Link2,
  FileText,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

interface IssuesListProps {
  issues: SEOIssue[];
  filter?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  meta: <FileText className="h-4 w-4" />,
  content: <FileText className="h-4 w-4" />,
  technical: <Settings className="h-4 w-4" />,
  performance: <Zap className="h-4 w-4" />,
  images: <Image className="h-4 w-4" />,
  links: <Link2 className="h-4 w-4" />,
};

const severityConfig = {
  critical: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "critical" as const,
    label: "Critical",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    variant: "warning" as const,
    label: "Warning",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    variant: "info" as const,
    label: "Info",
  },
};

/**
 * Displays a filterable list of SEO issues with severity badges and fix suggestions.
 */
export function IssuesList({ issues, filter = "all" }: IssuesListProps) {
  const filteredIssues =
    filter === "all" ? issues : issues.filter((i) => i.category === filter);

  // Sort: critical first, then warning, then info
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  if (sortedIssues.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
            <Wrench className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No Issues Found!</h3>
          <p className="text-muted-foreground text-sm">
            Everything looks great in this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedIssues.map((issue, index) => {
        const severity = severityConfig[issue.severity];
        return (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:border-white/[0.15] transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">
                    {categoryIcons[issue.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <Badge variant={severity.variant}>
                        {severity.icon}
                        <span className="ml-1">{severity.label}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {issue.description}
                    </p>
                    {issue.fix && (
                      <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                        <Wrench className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-indigo-300">{issue.fix}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
