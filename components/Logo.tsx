"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  href?: string;
}

export default function Logo({
  className = "",
  showText = true,
  size = "md",
  theme = "light",
  href = "/",
}: LogoProps) {
  const iconSize = size === "sm" ? 34 : size === "lg" ? 46 : 40;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 font-display group select-none transition-all ${className}`}
    >
      {/* High-Resolution Vector Emblem matching user brand asset */}
      <div
        className="relative shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="w-full h-full drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoPurple" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#6D28D9"/>
            </linearGradient>
          </defs>
          {/* Rounded Squircle */}
          <rect x="4" y="8" width="48" height="48" rx="16" fill="url(#logoPurple)"/>
          {/* Database Stack */}
          <g stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="28" cy="22" rx="12" ry="4"/>
            <path d="M16 27 C16 31, 40 31, 40 27"/>
            <path d="M16 32 C16 36, 40 36, 40 32"/>
            <path d="M16 37 C16 41, 40 41, 40 37"/>
            <path d="M16 22 L16 37"/>
            <path d="M40 22 L40 37"/>
          </g>
          {/* Cyan Notification Indicator */}
          <circle cx="50" cy="14" r="5.5" fill="#2DD4BF" stroke="#FFFFFF" strokeWidth="2"/>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSize} tracking-tight font-extrabold flex items-center`}>
            <span className={theme === "dark" ? "text-white" : "text-[#0F172A]"}>Lead</span>
            <span className="text-[#7C3AED] ml-0.5">intellect</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] ml-1 group-hover:scale-125 transition-transform" />
          </span>
          {size === "lg" && (
            <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase mt-0.5">
              B2B Sales Intelligence
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
