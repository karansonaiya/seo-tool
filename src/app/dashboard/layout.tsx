import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your SEO performance overview, recent audits, and score trends.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
