"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Floating robot assistant — Home page only.
 * Clicking opens the Help & Support chatbot via ?chat=1 param.
 */
export default function RobotAssistant() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-30 flex flex-col items-end gap-2 animate-fade-in-up select-none pointer-events-auto">
      {/* Speech bubble */}
      <Link
        href="/help?chat=1"
        className={`group relative bg-surface-card border border-border rounded-2xl px-4 py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-brand-500/30 ${
          hovered ? "scale-105" : ""
        }`}
        aria-label="Need any help? Open support chat"
      >
        {/* Bubble arrow */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 bg-surface-card border-r border-b border-border" />
        <p className="relative text-sm font-medium text-ink whitespace-nowrap">
          Need any help? <span className="inline-block" role="img" aria-label="wave">👋</span>
        </p>
      </Link>

      {/* Robot */}
      <Link
        href="/help?chat=1"
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="GharPe Assistant — open support chat"
      >
        <div className="animate-float">
          <svg
            width="64"
            height="72"
            viewBox="0 0 64 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-16 sm:w-16 sm:h-[72px] drop-shadow-lg"
          >
            {/* Antenna */}
            <line x1="32" y1="6" x2="32" y2="18" stroke="var(--brand-400)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="4" r="3" fill="var(--brand-400)">
              <animate attributeName="r" values="3;3.8;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Head */}
            <rect x="12" y="16" width="40" height="28" rx="10" fill="var(--brand-500)" />
            <rect x="14" y="18" width="36" height="24" rx="8" fill="var(--brand-400)" />

            {/* Face plate */}
            <rect x="18" y="22" width="28" height="16" rx="6" className="fill-surface-card" />

            {/* Eyes */}
            <circle cx="27" cy="29" r="3" className="fill-ink" />
            <circle cx="37" cy="29" r="3" className="fill-ink" />
            {/* Eye highlights */}
            <circle cx="28" cy="28" r="1" fill="white" />
            <circle cx="38" cy="28" r="1" fill="white" />

            {/* Mouth — friendly smile */}
            <path d="M27 34 Q32 38 37 34" stroke="var(--brand-400)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Body */}
            <rect x="18" y="44" width="28" height="18" rx="6" fill="var(--brand-500)" />
            <rect x="20" y="46" width="24" height="14" rx="5" fill="var(--brand-400)" />

            {/* Body heart/light */}
            <circle cx="32" cy="53" r="3" fill="var(--accent-pink)" opacity="0.8">
              <animate attributeName="r" values="3;3.5;3" dur="1.5s" repeatCount="indefinite" />
            </circle>

            {/* Left arm */}
            <rect x="8" y="46" width="10" height="5" rx="2.5" fill="var(--brand-500)" />

            {/* Right arm — waving */}
            <g className="robot-wave">
              <rect x="46" y="38" width="10" height="5" rx="2.5" fill="var(--brand-500)" transform="rotate(-10, 46, 40)" />
              {/* Hand */}
              <circle cx="56" cy="36" r="4" fill="var(--brand-400)" />
              <circle cx="56" cy="36" r="2.5" fill="var(--accent-pink)" opacity="0.6" />
            </g>

            {/* Legs */}
            <rect x="22" y="62" width="7" height="8" rx="3.5" fill="var(--brand-500)" />
            <rect x="35" y="62" width="7" height="8" rx="3.5" fill="var(--brand-500)" />
            {/* Feet */}
            <ellipse cx="25.5" cy="70" rx="5" ry="2.5" fill="var(--brand-400)" />
            <ellipse cx="38.5" cy="70" rx="5" ry="2.5" fill="var(--brand-400)" />
          </svg>
        </div>

        {/* Subtle glow behind robot */}
        <div className="absolute inset-0 -z-10 rounded-full bg-brand-500/10 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </div>
  );
}
