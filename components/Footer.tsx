import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import Logo from "./Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./SocialIcons";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Product Tour", href: "/product" },
      { label: "People & Company Search", href: "/dashboard" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Data Quality & Provenance", href: "/data-use" },
      { label: "Start Free", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About LeadIntellect", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Documentation", href: "/docs" },
      { label: "Sign In", href: "/login" },
      { label: "Admin Portal", href: "/admin" },
    ],
  },
  {
    title: "Data & Privacy",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Use & Provenance", href: "/data-use" },
      { label: "Security & Protections", href: "/security" },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/leadintellect/about/?viewAsMember=true",
    icon: LinkedInIcon,
    color: "hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/5",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61588271333862",
    icon: FacebookIcon,
    color: "hover:text-[#1877f2] hover:border-[#1877f2]/40 hover:bg-[#1877f2]/5",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/leadintellect/",
    icon: InstagramIcon,
    color: "hover:text-[#e4405f] hover:border-[#e4405f]/40 hover:bg-[#e4405f]/5",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Leadintellect",
    icon: YouTubeIcon,
    color: "hover:text-[#ff0000] hover:border-[#ff0000]/40 hover:bg-[#ff0000]/5",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-12">
      <div className="container-page">
        <div className="grid lg:grid-cols-[1.4fr_2.6fr] gap-12">
          <div>
            <Logo size="md" />
            <p className="mt-3 text-sm text-text-muted max-w-sm leading-relaxed">
              Find the companies. Find the people. Know who matters. Actionable B2B prospect intelligence
              with transparent verification and provider-neutral architecture.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-text-muted">
              <span className="font-semibold text-navy">Global B2B Intelligence</span>
              <span className="mt-1 flex items-center gap-1.5 font-medium text-navy">
                <Mail className="w-3.5 h-3.5 text-teal-dark shrink-0" />
                <a href="mailto:raghu@lead-intellect.com" className="hover:text-teal-dark transition-colors">
                  raghu@lead-intellect.com
                </a>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-navy">
                <Phone className="w-3.5 h-3.5 text-teal-dark shrink-0" />
                <a href="tel:+919985926971" className="hover:text-teal-dark transition-colors">
                  +91 9985926971
                </a>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-text-muted hover:text-navy transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} LeadIntellect. All rights reserved. Sourced and managed responsibly.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted transition-all ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
