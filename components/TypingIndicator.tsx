"use client";

import { motion } from "framer-motion";
import { Satellite } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start w-full max-w-3xl"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-panel)] border border-[var(--border-glow)]">
        <Satellite className="w-4 h-4 text-[var(--accent-cyan)] animate-spin" />
      </div>
      <div className="flex-1 glass-panel rounded-lg p-4 border-l-4 border-[var(--accent-cyan)]">
        <p className="text-xs uppercase tracking-wider text-[var(--text-dim)] mb-3">
          NOVA IS PROCESSING...
        </p>
        <div className="flex gap-1.5 mb-3">
          <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
          <span className="typing-dot w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
        </div>
        <div className="h-0.5 bg-[var(--bg-panel)] rounded overflow-hidden">
          <div className="h-full w-1/3 bg-[var(--accent-cyan)] progress-indeterminate rounded" />
        </div>
      </div>
    </motion.div>
  );
}
