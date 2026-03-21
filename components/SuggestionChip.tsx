"use client";

import { motion } from "framer-motion";

interface SuggestionChipProps {
  label: string;
  onClick: () => void;
  index?: number;
}

export default function SuggestionChip({ label, onClick, index = 0 }: SuggestionChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(0,212,255,0.3)" }}
      whileTap={{ scale: 0.98 }}
      className="px-5 py-3 rounded-full border border-[var(--border-glow)] glass-panel text-[var(--text-primary)] text-sm font-mono hover:border-[var(--accent-cyan)] transition-colors duration-200"
    >
      {label}
    </motion.button>
  );
}
