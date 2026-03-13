import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Root metadata for the entire application.
 * Provides SEO-optimized defaults for all pages.
 */
export const metadata: Metadata = {
  title: {
    default: "SEO Auto Fix - AI-Powered SEO Analysis & Optimization Tool",
    template: "%s | SEO Auto Fix",
  },
  description:
    "Automatically detect and fix SEO issues on any website. Get AI-powered suggestions, performance analysis, competitor insights, and comprehensive audit reports.",
  keywords: [
    "SEO tool",
    "SEO audit",
    "SEO analysis",
    "website optimization",
    "SEO checker",
    "AI SEO",
    "page speed",
    "technical SEO",
    "meta tags",
    "broken links",
  ],
  authors: [{ name: "SEO Auto Fix" }],
  creator: "SEO Auto Fix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seoautofix.com",
    siteName: "SEO Auto Fix",
    title: "SEO Auto Fix - AI-Powered SEO Analysis & Optimization",
    description:
      "Automatically detect and fix SEO issues. AI-powered suggestions, performance analysis, and comprehensive audit reports.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Auto Fix - AI-Powered SEO Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Auto Fix - AI-Powered SEO Analysis & Optimization",
    description:
      "Automatically detect and fix SEO issues on any website.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
