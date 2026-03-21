"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorBubbleProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorBubble({
  message = "SIGNAL LOST — Unable to reach mission control. Retry?",
  onRetry,
}: ErrorBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="error-shake flex gap-3 items-start w-full max-w-3xl"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-panel)] border-2 border-[var(--accent-amber)]">
        <AlertTriangle className="w-4 h-4 text-[var(--accent-amber)]" />
      </div>
      <div className="flex-1 glass-panel rounded-lg p-4 border-l-4 border-[var(--accent-amber)] bg-[var(--error-amber)]">
        <p className="text-[var(--text-primary)] mb-3">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded border border-[var(--accent-amber)] text-[var(--accent-amber)] hover:bg-[var(--accent-amber)] hover:text-[var(--bg-void)] transition-colors text-sm font-mono uppercase tracking-wider"
          >
            RETRY
          </button>
        )}
      </div>
    </motion.div>
  );
}
