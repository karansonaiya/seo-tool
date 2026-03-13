"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Tell the server the remember-me preference BEFORE OAuth redirect
      await fetch("/api/auth/set-remember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remember: rememberMe }),
      });

      // Kick off Google OAuth — page will redirect away
      await signIn("google", { callbackUrl });
    } catch {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* ── Left panel: branding / features ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">SEO Auto Fix</span>
        </div>

        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Boost your rankings with AI-powered SEO
            </h1>
            <p className="text-white/70 text-lg">
              Comprehensive audits, real Lighthouse scores, and actionable
              fixes — all in one place.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Real Lighthouse Scores",
                desc: "Google PageSpeed data for mobile & desktop.",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Instant SEO Audit",
                desc: "Meta tags, headings, links, images & more.",
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Technical SEO Checks",
                desc: "Schema, sitemap, robots.txt & canonicals.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-white/60 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} SEO Auto Fix. All rights reserved.
        </p>
      </div>

      {/* ── Right panel: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">
              SEO Auto Fix
            </span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">
              Welcome back
            </h2>
            <p className="mt-2 text-[var(--foreground)]/60">
              Sign in to access your SEO dashboard
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {error === "OAuthAccountNotLinked"
                ? "This email is already linked to another sign-in method."
                : error === "AccessDenied"
                  ? "Access denied. Please try again."
                  : "Sign-in failed. Please try again."}
            </div>
          )}

          {/* Card */}
          <div className="bg-[var(--card,#1a1a2e)] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
                         bg-white text-gray-800 font-semibold text-[15px]
                         hover:bg-gray-50 active:scale-[0.98]
                         transition-all duration-150 shadow-md
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? "Redirecting to Google…" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-[var(--foreground)]/30 text-xs">
              <div className="flex-1 h-px bg-white/10" />
              Secure sign-in via Google OAuth
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-5 h-5 rounded border-2 border-white/20
                               peer-checked:bg-indigo-500 peer-checked:border-indigo-500
                               transition-colors flex items-center justify-center"
                >
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-[var(--foreground)]/80 group-hover:text-[var(--foreground)] transition-colors font-medium">
                  Remember me
                </span>
                <p className="text-xs text-[var(--foreground)]/40 mt-0.5">
                  {rememberMe
                    ? "Stay signed in for 30 days"
                    : "Sign out after 1 day"}
                </p>
              </div>
            </label>

            {/* Info note */}
            <p className="text-xs text-[var(--foreground)]/30 text-center leading-relaxed">
              By signing in you agree to our{" "}
              <a href="#" className="underline hover:text-[var(--foreground)]/60 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-[var(--foreground)]/60 transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Back to home */}
          <p className="text-center text-sm text-[var(--foreground)]/40">
            <a
              href="/"
              className="hover:text-[var(--foreground)]/70 transition-colors"
            >
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.4 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3-11.3-7.3l-6.5 5C9.5 39.4 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.7 5.9l6.2 5.2C36.9 39.8 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
