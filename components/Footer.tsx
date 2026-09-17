import Link from "next/link";
import { Phone } from "lucide-react";
import Logo from "./Logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  TwitterXIcon,
} from "./SocialIcons";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Product Tour", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "ICP Scoring", href: "/#features" },
      { label: "Start Free Trial", href: "/start-trial" },
      { label: "Book a Demo", href: "/book-demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Book a Demo", href: "/book-demo" },
      { label: "Sign Up / Login", href: "/login" },
      { label: "Admin Portal", href: "/admin" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Frequently Asked Questions", href: "/#faq" },
      { label: "Blogs & Insights", href: "/blog" },
      { label: "Video Tutorials", href: "/tutorials" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security & Compliance", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: LinkedInIcon,
    color: "hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:bg-[#0a66c2]/5",
  },
  {
    name: "Twitter / X",
    href: "https://twitter.com",
    icon: TwitterXIcon,
    color: "hover:text-black hover:border-black/40 hover:bg-black/5",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com",
    icon: YouTubeIcon,
    color: "hover:text-[#ff0000] hover:border-[#ff0000]/40 hover:bg-[#ff0000]/5",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    icon: InstagramIcon,
    color: "hover:text-[#e4405f] hover:border-[#e4405f]/40 hover:bg-[#e4405f]/5",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    icon: FacebookIcon,
    color: "hover:text-[#1877f2] hover:border-[#1877f2]/40 hover:bg-[#1877f2]/5",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-12">
      <div className="container-page">
        <div className="grid lg:grid-cols-[1.4fr_2.6fr] gap-12">
          <div>
            <Logo size="md" />
            <p className="mt-3 text-sm text-text-muted max-w-xs leading-relaxed">
              Turning Sales Research into Sales Intelligence. Discover, enrich, and prioritize high-conversion B2B buyers with AI.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-text-muted">
              <span className="font-semibold text-navy">Location:</span>
              <span className="font-medium text-navy">India</span>
              <span className="mt-1 flex items-center gap-1.5 font-medium text-navy">
                <Phone className="w-3.5 h-3.5 text-teal-dark shrink-0" />
                <a href="tel:+919985926971" className="hover:text-teal-dark transition-colors">+91 9985926971</a>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-bold tracking-wide text-navy uppercase">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-text-muted hover:text-navy transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social channels bar requested by user */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-navy mr-1">Connect with us:</span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit LeadIntellect on ${social.name}`}
                className={`w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted transition-all duration-200 ${social.color}`}
              >
                <social.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>

          <div className="text-xs text-text-muted text-center sm:text-right">
            &copy; {new Date().getFullYear()} LeadIntellect Inc. All rights reserved. Built for B2B Revenue Teams.
          </div>
        </div>
      </div>
    </footer>
  );
}
