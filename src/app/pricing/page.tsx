import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS, APP_NAME } from "@/constants";
import {
  Search,
  CheckCircle2,
  Star,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the right SEO Auto Fix plan for your needs. Start free and scale as you grow.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-mesh grid-pattern">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">{APP_NAME}</span>
            </Link>
            <Link href="/audit">
              <Button size="sm">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">
            <Star className="h-3.5 w-3.5 mr-1" />
            Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free and upgrade as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`h-full relative ${
                plan.highlighted ? "border-indigo-500/50 glow" : ""
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
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
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
          ))}
        </div>
      </main>
    </div>
  );
}
