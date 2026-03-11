"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/theme-toggle";
import { PRICING_PLANS, FAQ_ITEMS, PUBLIC_NAV_LINKS, APP_NAME } from "@/constants";
import {
  Search,
  Zap,
  Shield,
  BarChart3,
  Image,
  Link2,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  FileSearch,
  Sparkles,
  Monitor,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// ===========================================
// Landing Page - Fully SEO Optimized
// ===========================================

// Smooth scroll to element
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh grid-pattern">
      {/* ========== Navigation ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">{APP_NAME}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {PUBLIC_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/audit" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/audit">
                <Button size="sm">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden glass border-t border-white/[0.06]"
          >
            <div className="px-4 py-4 space-y-2">
              {PUBLIC_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-white rounded-lg hover:bg-white/[0.04]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* ========== Hero Section ========== */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              AI-Powered SEO Analysis Platform
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Fix Your Website&apos;s SEO
            <br />
            <span className="gradient-text">Automatically</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Detect SEO issues, get AI-powered fix suggestions, monitor performance,
            and outrank your competitors — all in one powerful platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/audit">
              <Button size="xl" className="w-full sm:w-auto">
                Start Free Audit
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: "Websites Analyzed", value: "50,000+" },
              { label: "Issues Detected", value: "2M+" },
              { label: "Average Score Boost", value: "+34%" },
              { label: "Active Users", value: "10,000+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="default" className="mb-4">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="gradient-text">Perfect SEO</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive analysis tools that cover every aspect of SEO — from
              technical audits to AI-powered content optimization.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <FileSearch className="h-6 w-6" />,
                title: "Complete SEO Audit",
                description:
                  "Deep analysis of meta tags, headings, links, canonical tags, robots.txt, sitemap, and more.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Page Speed Analysis",
                description:
                  "Lighthouse-powered performance scoring with LCP, CLS, FID metrics and optimization suggestions.",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: <Image className="h-6 w-6" />,
                title: "Image SEO Checker",
                description:
                  "Detect missing alt text, oversized images, unoptimized formats, and missing lazy loading.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Technical SEO",
                description:
                  "HTML structure analysis, schema markup detection, canonical validation, and internal linking.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: "AI Fix Suggestions",
                description:
                  "AI-generated optimized titles, descriptions, content suggestions, and keyword ideas.",
                color: "from-indigo-500 to-violet-500",
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "SEO Score Dashboard",
                description:
                  "Visual charts showing technical, performance, and content SEO scores with trend tracking.",
                color: "from-red-500 to-rose-500",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Competitor Analysis",
                description:
                  "Compare your SEO metrics against competitors. See keyword overlap and backlink insights.",
                color: "from-teal-500 to-cyan-500",
              },
              {
                icon: <Monitor className="h-6 w-6" />,
                title: "Automated Monitoring",
                description:
                  "Weekly SEO audits with alerts for score drops, broken links, and performance degradation.",
                color: "from-amber-500 to-yellow-500",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Multi-Site Support",
                description:
                  "Monitor and analyze multiple websites from a single dashboard with team collaboration.",
                color: "from-fuchsia-500 to-pink-500",
              },
            ].map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-white">{feature.icon}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== How It Works ========== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="default" className="mb-4">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get actionable SEO insights in just three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Your URL",
                description:
                  "Simply paste your website URL into our analyzer. We support any public website.",
                icon: <Globe className="h-8 w-8" />,
              },
              {
                step: "02",
                title: "AI Analyzes Everything",
                description:
                  "Our engine crawls your page, checks 50+ SEO factors, and runs performance audits.",
                icon: <Brain className="h-8 w-8" />,
              },
              {
                step: "03",
                title: "Get Fixes & Improve",
                description:
                  "Review your SEO score, see specific issues, and get AI-generated fix suggestions.",
                icon: <CheckCircle2 className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-5 mb-4">
                  <span className="text-indigo-400">{item.icon}</span>
                </div>
                <div className="text-6xl font-bold gradient-text opacity-20 absolute top-0 right-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Sample Report Preview ========== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See a <span className="gradient-text">Sample Report</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Here&apos;s what a typical SEO audit report looks like.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glow">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Overall Score", value: "78", color: "text-yellow-500" },
                    { label: "Technical", value: "85", color: "text-emerald-500" },
                    { label: "Performance", value: "62", color: "text-orange-500" },
                    { label: "Content", value: "90", color: "text-emerald-500" },
                  ].map((score) => (
                    <div key={score.label} className="text-center">
                      <div className={`text-4xl font-bold mb-1 ${score.color}`}>
                        {score.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {score.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    {
                      severity: "critical",
                      title: "Missing Meta Description",
                      fix: "Add a 120-160 character meta description",
                    },
                    {
                      severity: "warning",
                      title: "Multiple H1 Tags (3 found)",
                      fix: "Use only one H1 tag per page",
                    },
                    {
                      severity: "warning",
                      title: "Images Without Alt Text (5 images)",
                      fix: "Add descriptive alt text to all images",
                    },
                    {
                      severity: "info",
                      title: "No Schema Markup Detected",
                      fix: "Add JSON-LD structured data",
                    },
                  ].map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${issue.severity === "critical"
                            ? "bg-red-500"
                            : issue.severity === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{issue.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {issue.fix}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ========== Pricing Section ========== */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="default" className="mb-4">
              <Star className="h-3.5 w-3.5 mr-1" />
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent{" "}
              <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free and upgrade as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-full relative ${plan.highlighted
                      ? "border-indigo-500/50 glow"
                      : ""
                    }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="default" className="px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/audit">
                      <Button
                        variant={plan.highlighted ? "default" : "outline"}
                        className="w-full"
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ Section ========== */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glow gradient-border">
              <CardContent className="p-8 sm:p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Fix Your SEO?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Join 10,000+ website owners who improved their search rankings
                  with SEO Auto Fix.
                </p>
                <Link href="/audit">
                  <Button size="xl">
                    Start Your Free Audit
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="border-t border-white/[0.06] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">{APP_NAME}</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered SEO analysis and optimization for modern websites.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "API", "Changelog"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
