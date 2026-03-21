"use client";

import { useState, useRef, useCallback } from "react";
import { Rocket, Satellite } from "lucide-react";

interface InputBarProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  showKeyboardHint?: boolean;
}

export default function InputBar({
  onSend,
  isLoading,
  showKeyboardHint = true,
}: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="glass-panel rounded-lg border-[var(--border-glow)] focus-within:border-[var(--accent-cyan)] focus-within:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all p-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-[var(--text-dim)] font-mono text-sm">
            <span className="text-[var(--accent-cyan)]">&gt;</span>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your query, astronaut..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none min-h-[24px] max-h-32 placeholder:text-[var(--text-dim)] placeholder:opacity-60"
            />
          </div>
          {showKeyboardHint && (
            <p className="text-[var(--text-dim)] text-xs mt-1">
              ↵ Send • ⇧↵ New line
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="flex-shrink-0 p-3 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-glow)] hover:border-[var(--accent-cyan)] hover:shadow-[0_0_16px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <Satellite className="w-5 h-5 text-[var(--accent-cyan)] animate-spin" />
          ) : (
            <Rocket className="w-5 h-5 text-[var(--accent-cyan)]" />
          )}
        </button>
      </div>
    </div>
  );
}
