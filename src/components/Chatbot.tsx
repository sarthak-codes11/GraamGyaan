"use client";

import React, { useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function Chatbot({
  pageId,
  locale,
  systemPrompt,
  docked = true,
}: {
  pageId: string;
  locale?: "en" | "hi" | "te";
  systemPrompt?: string;
  docked?: boolean;
}) {
  const [open, setOpen] = useState(docked ? false : true);
  const [loading, setLoading] = useState(false);
  const initialGreeting = () =>
    locale === "hi"
      ? "नमस्ते! मैं आपकी सहायता करने के लिए यहाँ हूँ। आप क्या सीखना चाहते हैं?"
      : locale === "te"
      ? "హలో! నేను మీకు సహాయం చేయడానికి ఇక్కడున్నాను. మీరు ఏమి నేర్చుకోవాలనుకుంటున్నారు?"
      : "Hello! I’m here to help. What would you like to learn?";
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: initialGreeting() },
  ]);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const clearChat = () => {
    setMessages([{ role: "assistant", content: initialGreeting() }]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const send = async () => {
    const text = (inputRef.current?.value || "").trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    if (inputRef.current) inputRef.current.value = "";
    setLoading(true);

    try {
      const resp = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt:
            systemPrompt ??
            `You are a helpful GraamGyaan tutor chatbot embedded on the ${pageId} page. Answer clearly and concisely. If the user greets you in ${locale || "English"}, respond in that language when possible.`,
          messages: [
            { role: "system", content: `Page: ${pageId}, Locale: ${locale || "en"}` },
            ...messages,
            { role: "user", content: text },
          ],
        }),
      });
      const data = (await resp.json()) as { text?: string };
      if (data?.text) {
        setMessages((m) => [...m, { role: "assistant", content: data.text! }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Sorry, I couldn't get a response right now." },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const Bubble = ({ role, content }: ChatMessage) => (
    <div
      className={`max-w-[85%] rounded-2xl border-2 px-3 py-2 text-sm ${
        role === "user"
          ? "self-end bg-white border-gray-200"
          : "self-start bg-[#FFF7ED] border-[#FED7AA]"
      }`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      {content}
    </div>
  );

  const Panel = (
    <div
      className="flex flex-col rounded-2xl border-4 p-3 w-full sm:w-96 max-h-[70vh] bg-white"
      style={{ borderColor: "#E5E7EB" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-extrabold text-[#6F0E1B]">Tutor Chat</div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="rounded-xl border-2 px-2 py-1 text-xs font-bold"
            style={{ background: "#DBEAFE", borderColor: "#93C5FD", color: "#1D4ED8" }}
            aria-label="Clear chat"
            title="Clear chat"
          >
            Clear
          </button>
          {docked && (
            <button
              onClick={() => setOpen(false)}
              className="rounded-full w-8 h-8 border-2 flex items-center justify-center"
              style={{ background: "#FFE4E6", borderColor: "#FFB4C1", color: "#9F1239" }}
              aria-label="Close chat"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-auto pr-1 mb-2">
        {messages.map((m, i) => (
          <Bubble key={i} {...m} />
        ))}
        {loading && <div className="text-xs text-gray-500">Thinking…</div>}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef as any}
          type="text"
          placeholder={
            locale === "hi"
              ? "अपना सवाल पूछें…"
              : locale === "te"
              ? "మీ ప్రశ్నను టైప్ చేయండి…"
              : "Type your question…"
          }
          className="flex-1 rounded-xl border-2 px-3 py-3 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-xl border-2 border-b-4 px-3 py-2 font-extrabold"
          style={{
            background: "#E6FAFB",
            borderColor: "#8AE1E8",
            color: "#0D7681",
            opacity: loading ? 0.7 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );

  if (!docked) return Panel;

  return (
    <div
      className="fixed z-40"
      style={{
        right: "0.75rem",
        bottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))`,
        left: undefined,
      }}
    >
      {open ? (
        <div className="mb-2 sm:mb-2 w-[calc(100vw-1.5rem)] sm:w-auto sm:max-w-none" style={{ maxWidth: "24rem" }}>
          {Panel}
        </div>
      ) : null}
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full w-16 h-16 sm:w-14 sm:h-14 border-2 border-b-4 shadow-lg flex items-center justify-center"
        style={{ background: "#FFDB58", borderColor: "#F59E0B" }}
        aria-label={open ? "Close tutor chat" : "Open tutor chat"}
        title={open ? "Close chat" : "Open chat"}
      >
        💬
      </button>
    </div>
  );
}
