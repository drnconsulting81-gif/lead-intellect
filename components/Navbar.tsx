"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, BookOpen, Video, HelpCircle, Play } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-border shadow-[0_1px_0_rgba(15,23,42,0.04)]"
          : "bg-white/0 border-b border-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between h-18">
        <div className="flex items-center gap-10 xl:gap-14">
          <Logo size="md" className="shrink-0" />

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-sm font-semibold text-text-muted hover:text-navy px-1.5 py-1 rounded-md hover:bg-surface transition-colors"
            >
              Home
            </Link>
            <Link
              href="/product"
              className="text-sm font-semibold text-text-muted hover:text-navy px-1.5 py-1 rounded-md hover:bg-surface transition-colors"
            >
              Product
            </Link>

            {/* Resources Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setResourcesOpen((prev) => !prev)}
                onMouseEnter={() => setResourcesOpen(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-navy transition-colors py-2 cursor-pointer"
              >
                Resources
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    resourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div
                  onMouseLeave={() => setResourcesOpen(false)}
                  className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-white border border-border shadow-[0_15px_40px_-10px_rgba(11,18,32,0.15)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/resources"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface text-navy transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal text-navy flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-navy">Resource Center &amp; Demo</div>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                        Interactive video demo &amp; playbooks
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/#faq"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface text-navy transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal-dark flex items-center justify-center shrink-0 group-hover:bg-teal group-hover:text-navy transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-navy">FAQ</div>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                        Answers about ICP, verification & data
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface text-navy transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0 group-hover:bg-violet group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-navy">Blogs & Articles</div>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                        B2B sales strategy & intelligence
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/tutorials"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface text-navy transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal-dark flex items-center justify-center shrink-0 group-hover:bg-teal group-hover:text-navy transition-colors">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-navy">Video Tutorials</div>
                      <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                        Watch how LeadIntellect works
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="text-sm font-semibold text-text-muted hover:text-navy px-1.5 py-1 rounded-md hover:bg-surface transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Action Buttons: Strictly Login and Book a Demo (No Start Free button) */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-text-muted hover:text-navy transition-colors px-2 py-2"
          >
            Login
          </Link>
          <Link
            href="/book-demo"
            className="text-sm font-bold text-white bg-navy px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs"
          >
            Book a Demo
          </Link>
        </div>

        {/* Mobile menu toggle button */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden p-2 text-navy cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-border shadow-xl">
          <div className="container-page flex flex-col py-4 gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-navy border-b border-border/60"
            >
              Home
            </Link>
            <Link
              href="/product"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-navy border-b border-border/60"
            >
              Product
            </Link>

            {/* Mobile Resources sub-accordion */}
            <div className="py-2 border-b border-border/60">
              <button
                onClick={() => setMobileResourcesOpen((v) => !v)}
                className="w-full flex items-center justify-between text-sm font-medium text-navy py-1 cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    mobileResourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileResourcesOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2">
                  <Link
                    href="/resources"
                    onClick={() => setOpen(false)}
                    className="text-xs text-navy font-bold py-1 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-dark fill-teal-dark" /> Resource Center &amp; Demo
                  </Link>
                  <Link
                    href="/#faq"
                    onClick={() => setOpen(false)}
                    className="text-xs text-text-muted hover:text-navy py-1 flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-teal-dark" /> FAQ
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setOpen(false)}
                    className="text-xs text-text-muted hover:text-navy py-1 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-violet" /> Blogs
                  </Link>
                  <Link
                    href="/tutorials"
                    onClick={() => setOpen(false)}
                    className="text-xs text-text-muted hover:text-navy py-1 flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-teal-dark" /> Video Tutorials
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-navy border-b border-border/60"
            >
              Contact
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-navy border-b border-border/60"
            >
              Login
            </Link>

            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/book-demo"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-bold text-white bg-navy px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
