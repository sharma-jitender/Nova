"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Globe, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import type { Message } from "@/hooks/useChat";

function formatMissionTime(date: Date): string {
  return date.toISOString().split("T")[1]?.slice(0, 8) ?? "00:00:00";
}

function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const isUser = message.role === "user";
  const readTime =
    !isUser && message.content.length > 200
      ? readingTimeMinutes(message.content)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "flex gap-3 items-start w-full max-w-3xl",
        isUser && "flex-row-reverse ml-auto"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-panel)] border border-[var(--border-glow)]">
          <Globe className="w-4 h-4 text-[var(--accent-cyan)]" aria-hidden />
        </div>
      )}

      <div
        className={clsx(
          "relative group flex-1 rounded-lg p-4",
          isUser
            ? "bg-[var(--accent-amber)]/20 border border-[var(--accent-amber)]/30 text-[var(--text-primary)]"
            : "glass-panel border-l-4 border-[var(--accent-cyan)]"
        )}
        onMouseEnter={() => !isUser && setShowCopy(true)}
        onMouseLeave={() => !isUser && setShowCopy(false)}
      >
        {isUser ? (
          <p className="font-mono text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <div className="chat-markdown prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || (message.isStreaming ? "▌" : "")}
              </ReactMarkdown>
            </div>
            {readTime > 0 && !message.isStreaming && (
              <p className="text-[var(--text-dim)] text-xs mt-2">
                ~{readTime} min read
              </p>
            )}
            {!message.isStreaming && message.content && (
              <button
                type="button"
                onClick={handleCopy}
                className={clsx(
                  "absolute top-2 right-2 px-2 py-1 rounded text-xs flex items-center gap-1 transition-opacity",
                  showCopy || copied ? "opacity-100" : "opacity-0",
                  "text-[var(--text-dim)] hover:text-[var(--accent-cyan)]"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> COPY TRANSMISSION
                  </>
                )}
              </button>
            )}
          </>
        )}

        <p className="text-[var(--text-dim)] text-xs mt-2">
          MISSION TIME: {formatMissionTime(message.timestamp)} UTC
        </p>
      </div>
    </motion.div>
  );
}
