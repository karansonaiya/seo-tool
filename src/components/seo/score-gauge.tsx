"use client";

import { motion } from "framer-motion";
import { cn, getScoreColor, getScoreGradient } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Animated circular score gauge with gradient coloring.
 * Visually communicates SEO score at a glance.
 */
export function ScoreGauge({ score, label, size = "md", className }: ScoreGaugeProps) {
  const sizes = {
    sm: { container: "w-24 h-24", text: "text-xl", label: "text-[10px]", stroke: 6 },
    md: { container: "w-36 h-36", text: "text-3xl", label: "text-xs", stroke: 8 },
    lg: { container: "w-48 h-48", text: "text-5xl", label: "text-sm", stroke: 10 },
  };

  const s = sizes[size];
  const radius = size === "sm" ? 40 : size === "md" ? 58 : 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", s.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.stroke}
            className="text-white/[0.06]"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth={s.stroke}
            strokeLinecap="round"
            className={cn(
              score >= 90
                ? "stroke-emerald-500"
                : score >= 70
                  ? "stroke-yellow-500"
                  : score >= 50
                    ? "stroke-orange-500"
                    : "stroke-red-500"
            )}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold", s.text, getScoreColor(score))}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={cn("text-muted-foreground", s.label)}>/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
