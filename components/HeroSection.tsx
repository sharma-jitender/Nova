"use client";

import { motion } from "framer-motion";
import SuggestionChip from "./SuggestionChip";

const HERO_SUGGESTIONS = [
  "How far is it to the nearest star?",
  "Tell me about the Apollo 11 mission",
  "What's happening on the ISS right now?",
];

interface HeroSectionProps {
  onSuggestionClick: (text: string) => void;
  showTypewriter: boolean;
}

export default function HeroSection({ onSuggestionClick, showTypewriter }: HeroSectionProps) {
  return (
    <motion.section
      layout
      initial={{ opacity: 1, y: 0 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] pt-14 pb-20 px-4"
    >
      {/* Orbit decoration - top right */}
      <div
        className="absolute top-24 right-8 lg:right-16 w-24 h-24 rounded-full border border-[var(--border-glow)] opacity-40"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 animate-[spin_8s_linear_infinite]">
          <div
            className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--accent-cyan)]"
            style={{ transform: "translateX(40px)" }}
          />
        </div>
      </div>

      <motion.h1
        layout
        className="font-orbitron font-bold text-6xl lg:text-[96px] text-[var(--accent-cyan)] logo-pulse tracking-wider mb-4"
      >
        NOVA
      </motion.h1>

      <motion.p
        layout
        className="text-[var(--text-dim)] font-mono text-base lg:text-lg mb-12"
      >
        Your AI guide to the cosmos
      </motion.p>

      {showTypewriter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="text-[var(--text-dim)] text-sm mb-8 font-mono"
        >
          Awaiting your query...
        </motion.p>
      )}

      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {HERO_SUGGESTIONS.map((suggestion, i) => (
          <SuggestionChip
            key={suggestion}
            label={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            index={i}
          />
        ))}
      </div>
    </motion.section>
  );
}
