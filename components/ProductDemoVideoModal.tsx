"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Mail,
  Users,
  ShieldCheck,
  Send,
  ExternalLink,
  Search,
  Filter,
  BookmarkPlus,
  Layers,
  Database,
  Building,
} from "lucide-react";
import { YouTubeIcon } from "./SocialIcons";

interface ProductDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStage?: (stage: string) => void;
  onNavigate?: (stage: string) => void;
}

const scenes = [
  {
    id: 1,
    title: "1. Search Leads & Filters",
    badge: "Natural Language AI Translation",
    timestamp: "0:00",
    duration: 8,
    narration:
      "Type conversational queries like 'Operations leaders at US manufacturing firms with 500+ employees'. LeadIntellect automatically parses your query into structured Boolean filters (Country, Industry, Headcount, Seniority) and matches 50,000+ verified decision-makers with a 0-100 ICP fit score.",
    highlight: "Natural Query Translation & ICP 0-100 Scoring",
  },
  {
    id: 2,
    title: "2. Create & Manage Lists",
    badge: "Target List Organization",
    timestamp: "1:15",
    duration: 8,
    narration:
      "Select high-intent prospects and create segmented target lists in 1 click. Name your list, tag target accounts, organize buying committees across departments, and review firmographics or export cleanly to CSV.",
    highlight: "1-Click Custom Target List Creation",
  },
  {
    id: 3,
    title: "3. Verify & 99 Credits",
    badge: "Zero-Decay Deliverability Waterfall",
    timestamp: "2:10",
    duration: 8,
    narration:
      "Reveal verified corporate emails and direct cell phone numbers with our multi-tier SMTP and MX deliverability check. Free accounts receive 99 evaluation credits on signup—0 credits are ever charged for searching or filtering.",
    highlight: "Multi-Source Handshake & 99 Free Credits",
  },
  {
    id: 4,
    title: "4. AI Outreach Studio",
    badge: "1:1 Personalized Cadences",
    timestamp: "3:05",
    duration: 9,
    narration:
      "Generate 4-step personalized cadences with 1 click. The AI analyzes buyer context to draft high-converting email icebreakers, follow-up touchpoints, LinkedIn messages, and objection battlecards.",
    highlight: "4-Touch Multi-Channel Sequence",
  },
  {
    id: 5,
    title: "5. Views & Deal Tracking",
    badge: "People & Company Views & Stages",
    timestamp: "4:00",
    duration: 8,
    narration:
      "Switch effortlessly between People View and Company View. Track lead progression across deal stages (Identified -> Contacted -> Demo Booked -> Won) to turn cold prospects into predictable revenue.",
    highlight: "Dual View Architecture & Revenue Tracking",
  },
];

export default function ProductDemoVideoModal({
  isOpen,
  onClose,
  onNavigateToStage,
  onNavigate,
}: ProductDemoVideoModalProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const currentScene = scenes[activeSceneIndex];
    const intervalTime = 100;
    const step = (100 / (currentScene.duration * 1000)) * intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeSceneIndex < scenes.length - 1) {
            setActiveSceneIndex((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeSceneIndex]);

  if (!isOpen) return null;

  const currentScene = scenes[activeSceneIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B132B] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#080E21] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal">
              Official Product Walkthrough &amp; Masterclass
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
              LeadIntellect Enterprise Intelligence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/@Leadintellect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-[#ff0000] text-white px-3 py-1.5 rounded-lg hover:bg-[#cc0000] transition-colors flex items-center gap-1.5"
            >
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>YouTube Channel</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative aspect-video bg-gradient-to-br from-[#0B132B] via-[#111C3D] to-[#080E21] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Scene Top Badge */}
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 border border-teal/40 text-teal text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>{currentScene.badge}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Chapter {activeSceneIndex + 1} of {scenes.length} &bull; {currentScene.timestamp}
            </div>
          </div>

          {/* Animated Interactive Mockup for Current Scene */}
          <div className="relative z-10 my-auto py-2">
            {/* Scene 1: Search Leads & Natural Query Translation */}
            {activeSceneIndex === 0 && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Search className="w-4 h-4 text-teal" />
                    <span>Search Leads: Natural Language Query &rarr; Filters</span>
                  </div>
                  <span className="text-[10px] bg-teal/20 text-teal px-2 py-0.5 rounded-full font-mono font-bold">
                    50,000+ Cleaned Records
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-teal shrink-0" />
                  <p className="text-xs text-white font-medium truncate">
                    &ldquo;Find Operations &amp; IT leaders at US manufacturing firms with 500&ndash;5,000 headcount&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Country: United States</span>
                  <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Seniority: VP / Director</span>
                  <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Industry: Manufacturing</span>
                  <span className="px-2 py-1 rounded-md bg-teal/15 text-teal font-bold border border-teal/30">ICP Score: &gt; 90/100</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Sarah Jenkins &middot; VP Operations</p>
                    <p className="text-[11px] text-slate-400">Nexus Industrial Solutions (Chicago, IL &bull; 1,200 emp)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    ICP 94/100
                  </span>
                </div>
              </div>
            )}

            {/* Scene 2: Creating & Managing Lists */}
            {activeSceneIndex === 1 && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <BookmarkPlus className="w-4 h-4 text-teal" />
                    <span>Save Prospects to Custom Target Lists</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    1-Click Segmentation
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-teal/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">List Name: &ldquo;Q4 Priority Healthcare &amp; IT Targets&rdquo;</span>
                    <span className="text-[10px] bg-teal text-navy font-extrabold px-2 py-0.5 rounded">Active List</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    42 high-scoring decision-makers saved &middot; Auto-tag: Tier 1 ICP Accounts &middot; Direct export ready
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Saved Prospects</span>
                    <span className="font-bold text-white text-xs">42 Decision-Makers</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block text-[10px]">Export Options</span>
                    <span className="font-bold text-teal text-xs">CSV Auto-Column Mapping</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 3: Contact Verification & 99 Credits */}
            {activeSceneIndex === 2 && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Deliverability Handshake &amp; Credit Ledger</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Zero-Decay Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Corporate Email</span>
                    <p className="font-mono text-teal font-bold mt-1 text-[11px]">s.jenkins@nexusindustrial.com</p>
                    <span className="text-[9px] text-emerald-400">MX + SMTP Validated (100% Deliverable)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Direct Phone</span>
                    <p className="font-mono text-white font-bold mt-1 text-[11px]">+1 (312) 554-8219</p>
                    <span className="text-[9px] text-teal">Telecom Carrier Confirmed Active</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-between text-xs text-teal">
                  <span>Transparent 1-credit lookup policy</span>
                  <span className="font-bold">Free Signup Balance: 99 Credits</span>
                </div>
              </div>
            )}

            {/* Scene 4: AI Outreach Studio */}
            {activeSceneIndex === 3 && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span>4-Touch AI Personalization Studio</span>
                  </div>
                  <span className="text-[10px] bg-teal/20 text-teal px-2 py-0.5 rounded font-bold">
                    Context-Aware Copy
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs font-mono space-y-1.5">
                  <p className="text-teal font-semibold text-[11px]">Subject: Operations streamlining at Nexus Industrial &mdash; Quick question</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    &ldquo;Hi Sarah, noticed your team manages operations across 1,200 headcount. Most VPs we speak with want to cut vendor data silos without downtime. We helped similar industrial leaders accelerate output by 40%...&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Step 1: 1:1 Cold Email</span>
                  <span>&rarr;</span>
                  <span>Step 2: LinkedIn Touch</span>
                  <span>&rarr;</span>
                  <span>Step 3: ROI Case Study</span>
                  <span>&rarr;</span>
                  <span>Step 4: Phone Battlecard</span>
                </div>
              </div>
            )}

            {/* Scene 5: Views & Deal Stage Tracking */}
            {activeSceneIndex === 4 && (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Layers className="w-4 h-4 text-teal" />
                    <span>People View, Company View &amp; Deal Tracking</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Revenue Conversion
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Identified</span>
                    <span className="font-bold text-white text-xs">48 Leads</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Contacted</span>
                    <span className="font-bold text-teal text-xs">24 Sent</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Replies</span>
                    <span className="font-bold text-amber-300 text-xs">12 Active</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-400 block">Won</span>
                    <span className="font-bold text-emerald-300 text-xs">$35,000+</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal" />
                    <span>Company View &bull; 50,000+ Verified Accounts with Hierarchy &amp; Tech Stack</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles / Narration Box */}
          <div className="relative z-10 bg-black/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-md">
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              <strong className="text-teal font-bold">{currentScene.title}:</strong>{" "}
              {currentScene.narration}
            </p>
          </div>
        </div>

        {/* Video Scrubber & Controls */}
        <div className="p-5 bg-[#080E21] border-t border-slate-800 space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div
              className="bg-teal h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-teal text-navy hover:bg-teal-dark hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Restart Chapter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Scene Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSceneIndex === idx
                      ? "bg-teal text-navy shadow-xs"
                      : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Launch Action */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const navFn = onNavigate || onNavigateToStage;
                  if (navFn) navFn("discover");
                  else window.location.href = "/dashboard";
                }}
                className="px-4 py-2 rounded-xl bg-white text-navy hover:bg-slate-100 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Try In Live Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
