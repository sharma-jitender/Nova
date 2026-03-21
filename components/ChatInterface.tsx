"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import Sidebar from "./Sidebar";
import type { Message } from "@/hooks/useChat";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onRetry: () => void;
  showKeyboardHint: boolean;
}

export default function ChatInterface({
  messages,
  isLoading,
  error,
  onSend,
  onRetry,
  showKeyboardHint,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollFAB, setShowScrollFAB] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      const threshold = el.scrollHeight - el.clientHeight - 100;
      setShowScrollFAB(el.scrollTop < threshold && el.scrollHeight > el.clientHeight);
    };
    el.addEventListener("scroll", check);
    check();
    return () => el.removeEventListener("scroll", check);
  }, [messages.length, messages[messages.length - 1]?.content?.length ?? 0]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  return (
    <motion.div
      layout
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-1 min-h-0 nebula-glow"
    >
      <Sidebar onProbeClick={onSend} />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            scrollRef={scrollRef}
          />
        </div>

        <div className="p-4 pb-6 lg:pb-4">
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 -mx-1 scrollbar-hide">
            {[
              "Explain dark matter",
              "Saturn's rings",
              "Next SpaceX launch",
              "Black holes",
              "Mars colonization",
            ].map((probe) => (
              <button
                key={probe}
                type="button"
                onClick={() => onSend(probe)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-mono border border-[var(--border-glow)] hover:border-[var(--accent-cyan)] transition-colors"
              >
                {probe}
              </button>
            ))}
          </div>
          <InputBar
            onSend={onSend}
            isLoading={isLoading}
            showKeyboardHint={showKeyboardHint}
          />
        </div>
      </div>

      <AnimatePresence>
        {showScrollFAB && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 lg:right-8 px-4 py-2 rounded-full glass-panel border border-[var(--border-glow)] flex items-center gap-2 text-sm font-mono hover:border-[var(--accent-cyan)] transition-colors z-30"
          >
            <ChevronDown className="w-4 h-4" />
            New transmission
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
