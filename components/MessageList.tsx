"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ErrorBubble from "./ErrorBubble";
import type { Message } from "@/hooks/useChat";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({
  messages,
  isLoading,
  error,
  onRetry,
  scrollRef,
}: MessageListProps) {
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, scrollRef]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <ErrorBubble
            message={
              error === "SOLAR_INTERFERENCE"
                ? "SOLAR INTERFERENCE DETECTED — Rate limit or network issue. Please wait a moment and retry."
                : error
            }
            onRetry={onRetry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
