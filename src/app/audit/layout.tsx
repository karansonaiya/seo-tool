import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website SEO Audit",
  description:
    "Run a comprehensive SEO audit on any website. Analyze meta tags, performance, images, links, and get AI-powered fix suggestions.",
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
