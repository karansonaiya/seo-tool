"use client";

import { useState, useCallback } from "react";
import { SEOAuditResult } from "@/types";

/**
 * Custom hook for running SEO audits via the API.
 * Manages loading state, errors, and results.
 */
export function useSEOAudit() {
  const [result, setResult] = useState<SEOAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runAudit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(10);

    try {
      // Simulate progress during the API call
      // PageSpeed Insights API takes 30-60 seconds for a full Lighthouse audit
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 85));
      }, 1000);

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze website");
      }

      setProgress(95);
      const data = await response.json();
      setResult(data.data);
      setProgress(100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
    setProgress(0);
  }, []);

  return { result, isLoading, error, progress, runAudit, reset };
}
