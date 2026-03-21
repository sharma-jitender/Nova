"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import StarField from "@/components/StarField";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ChatInterface from "@/components/ChatInterface";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, isLoading, error, sendMessage, retry, clearConversation } = useChat();
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    if (messages.length > 0 && !hasStarted) {
      setHasStarted(true);
    }
  }, [messages.length, hasStarted]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("nova-mission-log")) {
      setShowRestoreBanner(true);
    }
  }, []);

  const handleClearMission = () => {
    clearConversation();
    setShowRestoreBanner(false);
    setHasStarted(false);
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && !last?.isStreaming) {
      const orig = document.title;
      document.title = "📡 NOVA responded";
      const t = setTimeout(() => (document.title = orig), 2000);
      return () => clearTimeout(t);
    }
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => setShowTypewriter(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleSuggestionClick = (text: string) => {
    setHasStarted(true);
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg-void)]">
      <StarField />
      <NavBar />

      <AnimatePresence>
        {showRestoreBanner && hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-lg glass-panel border border-[var(--border-glow)] text-sm"
          >
            <span className="text-[var(--text-dim)]">Mission restored.</span>
            <button
              type="button"
              onClick={handleClearMission}
              className="text-[var(--accent-amber)] hover:underline font-mono"
            >
              Clear & start fresh
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutGroup>
        <div className="flex flex-col flex-1 min-h-0 pt-14">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              <HeroSection
                key="hero"
                onSuggestionClick={handleSuggestionClick}
                showTypewriter={showTypewriter}
              />
            ) : (
              <ChatInterface
                key="chat"
                messages={messages}
                isLoading={isLoading}
                error={error}
                onSend={sendMessage}
                onRetry={retry}
                showKeyboardHint={messages.length <= 2}
              />
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </main>
  );
}
