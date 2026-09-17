import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lead-intellect.com"),
  title: {
    default: "LeadIntellect | AI-Powered B2B Lead Intelligence & Prospecting Engine",
    template: "%s | LeadIntellect",
  },
  description:
    "LeadIntellect is an AI-powered B2B prospecting and sales intelligence platform that helps revenue teams discover, enrich, qualify, and convert verified decision-makers worldwide.",
  keywords: [
    "B2B Lead Intelligence",
    "B2B Database India",
    "AI Sales Prospecting Platform",
    "Verified B2B Email List",
    "Dynamic ICP Scoring",
    "Lead Enrichment Software",
    "Automated Sales Outreach",
    "Custom B2B Contact Datasets",
    "Revenue Operations Intelligence",
  ],
  authors: [{ name: "LeadIntellect" }],
  creator: "LeadIntellect Inc.",
  publisher: "LeadIntellect Inc.",
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
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://lead-intellect.com",
  },
  openGraph: {
    title: "LeadIntellect | AI-Powered B2B Lead Intelligence & Prospecting Engine",
    description:
      "Turning sales research into actionable sales intelligence. Discover, enrich, and prioritize high-conversion B2B buyers with verified accuracy.",
    url: "https://lead-intellect.com",
    siteName: "LeadIntellect",
    images: [
      {
        url: "https://lead-intellect.com/logo.png",
        width: 1200,
        height: 630,
        alt: "LeadIntellect B2B Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadIntellect | AI-Powered B2B Lead Intelligence",
    description:
      "Discover, enrich, and prioritize verified B2B decision-makers with AI. 14-day free trial available.",
    images: ["https://lead-intellect.com/logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://lead-intellect.com/#organization",
      name: "LeadIntellect",
      url: "https://lead-intellect.com",
      logo: "https://lead-intellect.com/logo.png",
      description: "AI-Powered B2B prospecting and sales intelligence platform.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: "India",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9985926971",
        contactType: "sales & customer support",
        areaServed: ["IN", "US", "GB", "AE", "Worldwide"],
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.linkedin.com/company/leadintellect/about/?viewAsMember=true",
        "https://www.facebook.com/profile.php?id=61588271333862",
        "https://www.instagram.com/leadintellect/",
        "https://www.youtube.com/@Leadintellect",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://lead-intellect.com/#software",
      name: "LeadIntellect Platform",
      operatingSystem: "Web-based (SaaS)",
      applicationCategory: "BusinessApplication",
      description:
        "B2B contact database, AI lead qualification, dynamic ICP scoring, and revenue intelligence automation.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "14-Day Free Trial Available",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://lead-intellect.com/#website",
      url: "https://lead-intellect.com",
      name: "LeadIntellect",
      publisher: {
        "@id": "https://lead-intellect.com/#organization",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Chatzy AI Assistant Widget Stylesheet & Script */}
        <link
          rel="stylesheet"
          href="https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb"
        />
        <script
          src="https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c"
          id="06521a81-313d-468a-8fd3-528ed81ae27a"
          className="chatzy_widget_script"
          defer
        />

        {/* JSON-LD Structured Data for Google Search Engine Optimization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
