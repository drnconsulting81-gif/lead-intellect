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
  Maximize2,
  Mail,
  Users,
  ShieldCheck,
  Send,
  Kanban,
  ExternalLink,
} from "lucide-react";

interface ProductDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStage?: (stage: string) => void;
  onNavigate?: (stage: string) => void;
}

const scenes = [
  {
    id: 1,
    title: "1. Whole-Web Intent Search",
    badge: "G2, Reddit, Quora & News",
    duration: 8,
    narration:
      "LeadIntellect monitors 7 public web channels: G2 software review spikes, Reddit technical discussions (r/sysadmin, r/sales), Quora inquiries, and SEC capital filings.",
    highlight: "G2 Buyer Intent & Reddit Telemetry",
  },
  {
    id: 2,
    title: "2. Build & Verify Target Lists",
    badge: "1-Credit Real-Time Waterfall",
    duration: 8,
    narration:
      "Filter decision-makers by seniority and ICP score. Save prospects to qualified lists, reveal verified direct work emails and cell phones with transparent credit accounting.",
    highlight: "Multi-Source Deliverability Engine",
  },
  {
    id: 3,
    title: "3. AI Email Sequence Dispatch",
    badge: "Contextual Icebreaker Personalization",
    duration: 9,
    narration:
      "Craft multi-touch cadences. One-click AI personalization automatically generates icebreakers referencing the lead's exact Reddit discussion or G2 evaluation topic.",
    highlight: "4-Touch Multi-Channel Cadence",
  },
  {
    id: 4,
    title: "4. Live Replies & CRM Pipeline",
    badge: "Lead-to-Revenue Conversion",
    duration: 8,
    narration:
      "Track open and reply rates in real time. Convert interested decision-makers directly into Stage 6 CRM Pipeline deals with pre-filled deal values ($25,000+).",
    highlight: "1-Click Pipeline Deal Creation",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0B132B] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#080E21] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal">
              Official Product Demo Walkthrough
            </span>
            <span className="text-xs text-slate-400 font-mono">
              LeadIntellect v2.4 (Enterprise Edition)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
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
              Scene {activeSceneIndex + 1} of {scenes.length}
            </div>
          </div>

          {/* Animated Interactive Mockup for Current Scene */}
          <div className="relative z-10 my-auto py-4">
            {activeSceneIndex === 0 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-[10px]">
                      G2.com Intent
                    </span>
                    <span>David Karlsberg &middot; Director, Network Operations</span>
                  </div>
                  <span className="text-[11px] text-teal font-mono">98% ICP Fit</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Active Review Comparison on G2 (Cloud &amp; ERP Stack)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &ldquo;Multiple sessions comparing enterprise software reviews &amp; API uptime benchmarks from 1-800-Flowers.com IP range.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Reddit r/sysadmin Thread Verified</span>
                  <span>&middot;</span>
                  <span>Signal Age: 12 days ago</span>
                </div>
              </div>
            )}

            {activeSceneIndex === 1 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Stage 2 &amp; 3: List Qualification &amp; Contact Reveal</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Multi-Tier Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Work Email</span>
                    <p className="font-mono text-teal font-bold mt-1 text-[11px]">d.karlsberg@1800flowers.com</p>
                    <span className="text-[9px] text-emerald-400">SMTP Handshake OK (Deliverable)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Direct Phone</span>
                    <p className="font-mono text-white font-bold mt-1 text-[11px]">+1 (516) 237-4921</p>
                    <span className="text-[9px] text-teal">Direct Mobile Verified</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-between text-xs text-teal">
                  <span>Transparent Deduction: 1 Credit per verified work email</span>
                  <span className="font-bold">Balance: 98 Credits</span>
                </div>
              </div>
            )}

            {activeSceneIndex === 2 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-teal" />
                    <span>AI Outbound Cadence: 4 Touchpoints</span>
                  </div>
                  <span className="text-[10px] text-teal font-bold bg-teal/20 px-2 py-0.5 rounded">
                    DKIM/SPF Safe Warmup (50/day)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 font-mono space-y-2">
                  <p className="text-teal font-semibold">Subject: Quick question regarding 1-800-Flowers.com&apos;s cloud evaluation</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    &ldquo;Hi David, noticed your team has been researching modern software infrastructure on G2 and Reddit recently. We help teams eliminate data decay without legacy contract lock-in...&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Step 1: AI Cold Email</span>
                  <span>&rarr;</span>
                  <span>Step 2: LinkedIn Touch</span>
                  <span>&rarr;</span>
                  <span>Step 3: ROI Case Study</span>
                  <span>&rarr;</span>
                  <span>Step 4: Direct Call</span>
                </div>
              </div>
            )}

            {activeSceneIndex === 3 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Kanban className="w-4 h-4 text-teal" />
                    <span>Stage 5 Engagement &rarr; Stage 6 CRM Pipeline</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Reply Received (Interested)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-400">Prospect Response:</span>
                  <p className="italic text-[11px]">
                    &ldquo;Thanks for reaching out. Yes, we are actively replacing our legacy data vendor this month. Can you share pricing for 20 seats?&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-white">Deal Added to CRM Pipeline: $50,000</span>
                  <span className="px-3 py-1 rounded-xl bg-teal text-navy text-xs font-extrabold uppercase">
                    Discovery Call Scheduled
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
                title="Restart Scene"
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
                }}
                className="px-4 py-2 rounded-xl bg-white text-navy hover:bg-slate-100 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Try Live in Discover</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
