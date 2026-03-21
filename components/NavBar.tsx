"use client";

import { Globe } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-[var(--border-glow)]">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-[var(--accent-cyan)]" aria-hidden />
          <span className="font-orbitron font-bold text-lg tracking-wider">NOVA</span>
        </div>

        <div className="flex items-center gap-2 text-[var(--text-dim)] text-xs">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-panel)]"
            aria-hidden
          >
            <span
              className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse"
              aria-hidden
            />
            SIGNAL: STRONG
          </span>
        </div>
      </div>
    </nav>
  );
}
