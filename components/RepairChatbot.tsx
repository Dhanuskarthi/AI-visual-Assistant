"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface RepairChatbotProps {
  applianceType: string;
  identifiedIssue: string;
  isDiySafe: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function RepairChatbot({ applianceType, identifiedIssue, isDiySafe }: RepairChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Troubleshooting Assistant for your ${applianceType}. Ask me any follow-up questions about step details, component locations, or safety precautions.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const { language, t } = useLanguage();

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    // Duplicate send guard (#6)
    const lastUserMessage = messages.filter((m) => m.role === "user").slice(-1)[0]?.content;
    if (lastUserMessage && lastUserMessage.toLowerCase() === query.toLowerCase() && isLoading) {
      return;
    }

    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance_type: applianceType,
          identified_issue: identifiedIssue,
          is_diy_safe: isDiySafe,
          messages: newMessages,
          language: language
        })
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "I am analyzing your question." }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Safety Precaution: Ensure the appliance or engine ignition is completely powered off before inspecting any components. What specific step can I clarify for you?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Contextual quick prompt chips based on isDiySafe (#6)
  const diyPrompts = [
    "What if it doesn't work?",
    "Where do I buy replacement parts?",
    "What safety precautions should I take?"
  ];

  const proPrompts = [
    "How do I stay safe until help arrives?",
    "What emergency helpline should I call?",
    "Should I turn off the main circuit breaker?"
  ];

  const quickPrompts = isDiySafe ? diyPrompts : proPrompts;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-xl text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">AI Repair Assistant</h3>
            <p className="text-[11px] text-slate-400">Ask questions about {applianceType}</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
          Active Assistant
        </span>
      </div>

      {/* Message List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-rose-600 text-white rounded-tr-none font-medium"
                  : "bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator showing BEFORE first token (#6) */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40 w-fit animate-pulse motion-reduce:animate-none">
            <RefreshCw className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" />
            <span>AI Assistant is typing…</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Contextual Quick Prompt Chips (#6) */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors focus:ring-2 focus:ring-rose-500 focus:outline-none min-h-[44px]"
          >
            💡 {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about repairing your ${applianceType}…`}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500 placeholder:text-slate-500 min-h-[44px]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-40 min-h-[44px] focus:ring-2 focus:ring-rose-500 focus:outline-none"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
