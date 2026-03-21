"use client";

import { useState, useCallback } from "react";
import { nanoid } from "nanoid";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const STORAGE_KEY = "nova-mission-log";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((m: Omit<Message, "timestamp"> & { timestamp: string }) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistMessages = useCallback((msgs: Message[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(msgs.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() })))
      );
    } catch {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, options?: { isRetry?: boolean }) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      setError(null);

      const isRetry = options?.isRetry ?? false;
      const historyForApi = isRetry
        ? messages
        : [...messages, { role: "user" as const, content: trimmed }];

      const userMessage: Message = {
        id: nanoid(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      if (!isRetry) {
        setMessages((prev) => {
          const next = [...prev, userMessage, assistantMessage];
          persistMessages(next);
          return next;
        });
      } else {
        setMessages((prev) => {
          const next = [...prev, assistantMessage];
          persistMessages(next);
          return next;
        });
      }
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyForApi.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status === 429) {
            throw new Error("SOLAR_INTERFERENCE");
          }
          throw new Error(data.error || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let streamedContent = "";
        let buffer = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const payload = line.slice(6);
                if (payload === "[DONE]") continue;
                try {
                  const json = JSON.parse(payload);
                  if (json.error) throw new Error(json.error);
                  const text = json.text ?? json.content ?? "";
                  if (text) streamedContent += text;
                } catch (e) {
                  if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                    throw e;
                  }
                }
              }
            }

            setMessages((prev) => {
              const next = prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: streamedContent, isStreaming: true }
                  : m
              );
              persistMessages(next);
              return next;
            });
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: streamedContent, isStreaming: false }
              : m
          )
        );
        const finalMessages = isRetry
          ? [...messages, { ...assistantMessage, content: streamedContent, isStreaming: false }]
          : [...messages, userMessage, { ...assistantMessage, content: streamedContent, isStreaming: false }];
        persistMessages(finalMessages);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMessage.id)
        );
        persistMessages(isRetry ? messages : [...messages, userMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, persistMessages]
  );

  const retry = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      sendMessage(lastUser.content, { isRetry: true });
    }
  }, [messages, sendMessage]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { messages, isLoading, error, sendMessage, retry, clearConversation };
}
