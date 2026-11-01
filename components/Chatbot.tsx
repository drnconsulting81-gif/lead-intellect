"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  User,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    type: "trial" | "demo" | "pricing" | "contact" | "article";
    label: string;
    href: string;
  };
}

let messageCounter = 0;
function nextMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}_${messageCounter}_${Math.random().toString(36).substring(2, 7)}`;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "bot",
    text: "👋 Hi! I'm your **LeadIntellect Assistant**. Ask me anything about how we discover decision-makers, track intent signals, or verify deliverability. You can also pick a common question below!",
  },
];

const commonQuestions = [
  { q: "💡 What is LeadIntellect?", topic: "overview" },
  { q: "🚀 How does the 7-day free trial work?", topic: "trial" },
  { q: "💳 What are your pricing plans?", topic: "pricing" },
  { q: "⚡ What are intent signals?", topic: "intent" },
  { q: "🛡️ How is contact data verified?", topic: "verification" },
  { q: "📅 How do I schedule a demo?", topic: "demo" },
];

function getBotResponse(input: string): { text: string; action?: Message["action"] } {
  const query = input.toLowerCase();

  // Overview / What is LeadIntellect
  if (query.includes("what is") || query.includes("how does it work") || query.includes("overview") || query.includes("about")) {
    return {
      text: "**LeadIntellect** is an AI-powered B2B sales intelligence and buyer intent platform.\n\nUnlike traditional static contact lists, LeadIntellect connects **who to contact** with **why to reach out now**—using real-time business signals (promotions, job changes, funding, tech stack shifts, and G2 buyer research) with verified emails and direct dials.",
      action: {
        type: "trial",
        label: "Start 7-Day Free Trial (99 Credits)",
        href: "/start-trial",
      },
    };
  }

  // Free Trial
  if (query.includes("trial") || query.includes("free credits") || query.includes("99")) {
    return {
      text: "You can start a **7-Day Free Trial** instantly with **99 free prospecting credits** allocated to your workspace.\n\n• No credit card required to begin.\n• Search verified C-Suite, VP, and Director contacts.\n• Filter by industry, headcount, revenue, and buyer intent signals.\n• Unlock and export decision-maker emails & phone coordinates.",
      action: {
        type: "trial",
        label: "Activate 7-Day Trial (99 Credits) →",
        href: "/start-trial",
      },
    };
  }

  // Pricing
  if (query.includes("price") || query.includes("pricing") || query.includes("cost") || query.includes("plans") || query.includes("subscription")) {
    return {
      text: "Our subscription plans are transparent and predictable:\n\n• **Basic (Pilot)**: **$5/mo** (₹449) — 50 credits, 2,000 contacts, 1 mailbox.\n• **Starter**: **$29/mo** (₹2,499) — 100 credits/mo, 5,000 contacts, 2 mailboxes.\n• **Growth (Most Popular)**: **$79/mo** (₹6,799) — 200 credits/mo, 20,000 contacts, 5 mailboxes.\n• **Enterprise**: Custom high-volume credits & dedicated IPs.\n\nAll payments are securely processed via Razorpay with global card and multi-currency support.",
      action: {
        type: "pricing",
        label: "View Pricing Plans →",
        href: "/pricing",
      },
    };
  }

  // Intent Signals
  if (query.includes("intent") || query.includes("signal") || query.includes("buying signal") || query.includes("recency") || query.includes("trigger")) {
    return {
      text: "**Intent Signals** help your sales team answer *'Why should I contact this prospect right now?'*\n\nLeadIntellect monitors 7 live signal categories:\n1. ⚡ **Job Changes & Leadership Appointments** (<90 days in role)\n2. 💼 **Recent Promotions**\n3. 👥 **Department Headcount & Hiring Surges**\n4. 🚀 **Funding & Capital Expansion**\n5. 🔧 **Technographic Stack & DNS Shifts**\n6. 📊 **G2.com In-Market Buyer Research**\n7. 💬 **Reddit & Quora Public Solution Inquiries**",
      action: {
        type: "article",
        label: "Read: The Future of Prospecting Article",
        href: "/blog/future-b2b-prospecting-isnt-finding-more-leads-its-why",
      },
    };
  }

  // Verification & Deliverability
  if (query.includes("verify") || query.includes("verification") || query.includes("deliver") || query.includes("bounce") || query.includes("phone")) {
    return {
      text: "🛡️ **Zero-Decay Multi-Step Verification**:\n\n• Every email undergoes active MX record validation, SMTP handshake checks, and catch-all detection.\n• We strictly deliver **98%+ deliverability confidence** on verified records.\n• Phone numbers identify direct dials vs. corporate switchboards.\n• Unverified coordinates never consume paid reveal credits.",
      action: {
        type: "trial",
        label: "Test Verification in Free Trial",
        href: "/start-trial",
      },
    };
  }

  // Demo
  if (query.includes("demo") || query.includes("walkthrough") || query.includes("meeting") || query.includes("call")) {
    return {
      text: "We'd love to give you a customized 1-on-1 walkthrough! Our product specialists will demonstrate real searches for your exact target accounts and ICP criteria.",
      action: {
        type: "demo",
        label: "Book a 15-Minute Live Demo →",
        href: "/book-demo",
      },
    };
  }

  // Contact / Support
  if (query.includes("contact") || query.includes("support") || query.includes("help") || query.includes("human") || query.includes("sales")) {
    return {
      text: "You can reach our team anytime:\n\n• **Direct Email**: contact@leadintellect.ai\n• **Customer Support**: We respond within 2 business hours.\n• **Office Hours**: Monday–Friday, 9 AM – 6 PM EST.",
      action: {
        type: "contact",
        label: "Open Contact Form",
        href: "/contact",
      },
    };
  }

  // Default Fallback
  return {
    text: "LeadIntellect combines AI agent discovery, verified multi-source enrichment, and algorithmic ICP scoring (0–100) to help sales teams focus on buyers who actually convert.\n\nWould you like to explore how ICP scoring works, or test the platform with a free trial?",
    action: {
      type: "trial",
      label: "Start 7-Day Free Trial",
      href: "/start-trial",
    },
  };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages.length, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: nextMessageId("user"),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const resp = getBotResponse(text);
      const botMsg: Message = {
        id: nextMessageId("bot"),
        sender: "bot",
        text: resp.text,
        action: resp.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="relative group p-4 rounded-full bg-navy text-teal hover:bg-slate-900 shadow-2xl border border-teal/40 transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6 text-teal group-hover:rotate-6 transition-transform" />
          <span className="sr-only">Open Chat Assistant</span>

          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-dark border-2 border-white" />
            </span>
          )}

          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-navy text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl border border-teal/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            Ask LeadIntellect AI &bull; Instant Answers
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between border-b border-teal/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal/15 border border-teal/30 flex items-center justify-center text-teal">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5 text-white">
                  <span>LeadIntellect Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-300">
                  Online &bull; Instant Product &amp; Sales Answers
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Common Question Pills */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {commonQuestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.q)}
                className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-teal/10 hover:text-teal-dark border border-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-navy text-teal flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl shadow-2xs leading-relaxed whitespace-pre-wrap ${
                      m.sender === "user"
                        ? "bg-navy text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.action && (
                    <div className="pt-1">
                      <Link
                        href={m.action.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        <span>{m.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-teal text-navy flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-text-muted text-[11px]">
                <div className="w-6 h-6 rounded-lg bg-navy text-teal flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about pricing, free trial, or signals..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-xl bg-navy text-teal hover:bg-teal hover:text-navy transition-colors disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
