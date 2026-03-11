"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auditUrlSchema, type AuditUrlInput } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface AuditFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

/**
 * URL input form for triggering SEO audits.
 * Includes Zod validation and loading state management.
 */
export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuditUrlInput>({
    resolver: zodResolver(auditUrlSchema),
    defaultValues: { url: "" },
  });

  const handleFormSubmit = (data: AuditUrlInput) => {
    onSubmit(data.url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            <Input
              {...register("url")}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="h-14 pl-12 pr-4 text-base rounded-2xl bg-white/[0.04] border-white/[0.08] focus:ring-2 focus:ring-indigo-500/50"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="xl"
            disabled={isLoading}
            className="h-14 px-8 rounded-2xl shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Analyze</span>
              </>
            )}
          </Button>
        </div>
        {errors.url && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-2 ml-1"
          >
            {errors.url.message}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}
