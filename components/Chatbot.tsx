"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  User,
  ArrowRight,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  action?: {
    type: "trial" | "demo";
    label: string;
    href: string;
  };
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "bot",
    text: "👋 Hi there! I'm the **LeadIntellect AI Assistant**. I can help you discover how our platform finds the right accounts, scores ICP fit, enriches verified contacts, or help you get started with a free trial.",
  },
];

const quickSuggestions = [
  "🎯 How does ICP scoring work?",
  "🔍 How do you find decision-makers?",
  "⚡ Which data providers do you use?",
  "🛡️ Do you scrape LinkedIn?",
  "🚀 How do I start a free trial?",
];

function getBotResponse(input: string): { text: string; action?: Message["action"] } {
  const query = input.toLowerCase();

  if (query.includes("icp") || query.includes("score") || query.includes("fit") || query.includes("tier")) {
    return {
      text: "Our **ICP Scoring Framework** evaluates accounts from 0 to 100 based on your custom criteria:\n\n• **Company Fit**: Industry, employee headcount, annual revenue, and geography.\n• **Role Fit**: Seniority, functional ownership (e.g. CRO, VP BD).\n• **Context & Signals**: Tech stack, funding events, and growth triggers.\n\nAccounts are automatically grouped into **Tier 1 (High Priority)**, **Tier 2 (Moderate)**, and **Tier 3 (Nurture)** so your sales team always focuses on the highest-value opportunities first.",
      action: {
        type: "trial",
        label: "Test ICP Scoring with Free Trial",
        href: "/start-trial",
      },
    };
  }

  if (
    query.includes("decision maker") ||
    query.includes("decision-maker") ||
    query.includes("contact") ||
    query.includes("people") ||
    query.includes("buyer") ||
    query.includes("lead")
  ) {
    return {
      text: "LeadIntellect uses an intelligent AI Prospecting Agent. You can describe your target buyers in plain English (e.g., *'Find VPs of Growth in Series B healthcare SaaS in Europe'*).\n\nThe agent translates your prompt into structured searches, identifies exact decision-makers, and provides verified emails and direct dials.",
      action: {
        type: "demo",
        label: "Book a Demo to See Prospecting",
        href: "/book-demo",
      },
    };
  }

  if (
    query.includes("provider") ||
    query.includes("data") ||
    query.includes("source") ||
    query.includes("apollo") ||
    query.includes("enrich")
  ) {
    return {
      text: "LeadIntellect connects with **approved third-party data providers** (including Apollo and planned future sources like SalesTarget).\n\nInstead of locked-in static lists, our engine queries real-time databases and cross-verifies business emails and LinkedIn presence before recommending them to your reps.",
    };
  }

  if (query.includes("linkedin") || query.includes("scraping") || query.includes("compliance") || query.includes("ban")) {
    return {
      text: "🛡️ **LeadIntellect does NOT perform unauthorized LinkedIn scraping**.\n\nWe prioritize compliance and data safety. All discovery and enrichment rely strictly on authorized, reputable data providers and compliant APIs, protecting your company's domain and sender reputation.",
    };
  }

  if (
    query.includes("trial") ||
    query.includes("free") ||
    query.includes("pricing") ||
    query.includes("cost") ||
    query.includes("sign up") ||
    query.includes("start")
  ) {
    return {
      text: "You can **Start a Free Trial** immediately with full access to our AI search agent, ICP scoring sandbox, and enriched contact samples. No credit card is required to begin.",
      action: {
        type: "trial",
        label: "Start Free Trial Now",
        href: "/start-trial",
      },
    };
  }

  if (query.includes("demo") || query.includes("call") || query.includes("meeting")) {
    return {
      text: "We'd love to give you a tailored walkthrough! Our product specialists will show you live search results for your exact Ideal Customer Profile (ICP).",
      action: {
        type: "demo",
        label: "Book a Live Demo",
        href: "/book-demo",
      },
    };
  }

  if (
    query.includes("outreach") ||
    query.includes("email") ||
    query.includes("automate") ||
    query.includes("sequence")
  ) {
    return {
      text: "LeadIntellect keeps humans in control! We generate contextual icebreakers, pain point summaries, and recommend the **Next Best Action**.\n\nYour sales reps review and approve outreach before sending, preventing robotic or generic spam.",
    };
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return {
      text: "Hello! Welcome to LeadIntellect. What type of accounts or decision-makers are you looking to target this quarter?",
    };
  }

  return {
    text: "LeadIntellect combines AI agent discovery, verified multi-source enrichment, and algorithmic ICP scoring (0-100) to help sales teams focus on buyers who actually convert.\n\nWould you like to explore how ICP scoring works, or test the platform with a free trial?",
    action: {
      type: "trial",
      label: "Start Free Trial",
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
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.text,
        action: response.action,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-2 bg-navy text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-teal/30 animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="font-medium">Chat with AI Assistant</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-navy text-teal shadow-[0_8px_30px_rgb(11,18,32,0.35)] border-2 border-teal/40 hover:border-teal hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal/20 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-teal group-hover:rotate-6 transition-transform" />
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal border-2 border-navy" />
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="LeadIntellect AI Chatbot"
          className="fixed bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] max-h-[82vh] h-[580px] bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(11,18,32,0.35)] border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3.5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-teal to-violet flex items-center justify-center text-navy shadow-inner">
                <Bot className="w-5 h-5 text-navy" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal border-2 border-navy" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    LeadIntellect AI
                  </h3>
                  <span className="text-[10px] bg-teal/20 text-teal px-1.5 py-0.5 rounded font-medium">
                    Agent
                  </span>
                </div>
                <p className="text-[11px] text-white/60 leading-tight">
                  Always active &middot; B2B Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fbfcfd]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal" />
                  </div>
                )}

                <div className={`max-w-[85%] flex flex-col gap-2`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-xs ${
                      m.sender === "user"
                        ? "bg-navy text-white rounded-br-xs ml-auto"
                        : "bg-white text-navy border border-border/80 rounded-tl-xs shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                    }`}
                  >
                    {m.text.split("\n").map((line, lineIdx) => {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <span key={lineIdx} className="block">
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong key={pIdx} className="font-semibold text-navy">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </span>
                      );
                    })}
                  </div>

                  {m.action && (
                    <Link
                      href={m.action.href}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 self-start text-xs font-semibold px-3 py-2 rounded-lg bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors shadow-xs"
                    >
                      {m.action.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-teal" />
                </div>
                <div className="rounded-2xl rounded-tl-xs bg-white border border-border/80 px-4 py-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 pt-2 pb-1 bg-surface border-t border-border flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickSuggestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap text-[11px] font-medium bg-white hover:bg-white/80 hover:border-teal/40 text-text-muted hover:text-navy border border-border px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-border flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about prospecting, ICP, trial..."
              disabled={isTyping}
              className="flex-1 bg-surface border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-navy placeholder:text-text-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl bg-navy text-teal hover:bg-teal hover:text-navy disabled:opacity-40 disabled:hover:bg-navy disabled:hover:text-teal flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="bg-surface px-3 py-1.5 border-t border-border/50 text-[10px] text-text-muted text-center flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            LeadIntellect AI Intelligence Assistant &middot; Ready to help
          </div>
        </div>
      )}
    </>
  );
}
