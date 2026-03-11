"use client";

import { AISuggestion } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  Type,
  Search,
  Code,
  Lightbulb,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

const typeIcons: Record<string, React.ReactNode> = {
  title: <Type className="h-4 w-4" />,
  description: <FileText className="h-4 w-4" />,
  content: <FileText className="h-4 w-4" />,
  keyword: <Search className="h-4 w-4" />,
  schema: <Code className="h-4 w-4" />,
  general: <Lightbulb className="h-4 w-4" />,
};

const impactColors = {
  high: "success",
  medium: "warning",
  low: "info",
} as const;

/**
 * Displays AI-generated SEO improvement suggestions with
 * before/after comparisons and impact ratings.
 */
export function AISuggestionsPanel({ suggestions }: AISuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-purple-500/10 p-4 mb-4">
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No AI Suggestions</h3>
          <p className="text-muted-foreground text-sm text-center">
            Run an audit to get AI-powered SEO improvement suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold text-lg">AI-Powered Suggestions</h3>
      </div>

      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:border-purple-500/20 transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                  {typeIcons[suggestion.type] || typeIcons.general}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium capitalize">
                      {suggestion.type} Optimization
                    </span>
                    <Badge variant={impactColors[suggestion.impact]}>
                      {suggestion.impact} impact
                    </Badge>
                  </div>

                  {suggestion.original && (
                    <div className="mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1 block">
                        Current
                      </span>
                      <p className="text-sm text-muted-foreground bg-red-500/5 border border-red-500/10 rounded-lg p-2 line-through">
                        {suggestion.original}
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1 block">
                      Suggested
                    </span>
                    <p className="text-sm bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 text-emerald-300">
                      {suggestion.suggested}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-purple-400" />
                    <span>{suggestion.reasoning}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
