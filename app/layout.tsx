import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leadintellect.ai"),
  title: "LeadIntellect | AI B2B Prospecting & Sales Intelligence",
  description:
    "LeadIntellect is an AI-powered B2B prospecting and sales intelligence platform that helps teams discover, enrich, qualify and understand the right prospects.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LeadIntellect | AI B2B Prospecting & Sales Intelligence",
    description:
      "LeadIntellect is an AI-powered B2B prospecting and sales intelligence platform that helps teams discover, enrich, qualify and understand the right prospects.",
    url: "https://leadintellect.ai",
    siteName: "LeadIntellect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadIntellect | AI B2B Prospecting & Sales Intelligence",
    description:
      "LeadIntellect is an AI-powered B2B prospecting and sales intelligence platform that helps teams discover, enrich, qualify and understand the right prospects.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
