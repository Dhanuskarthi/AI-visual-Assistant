"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

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

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

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
          messages: newMessages
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
          content: "Always ensure the appliance is completely unplugged before touching internal components. What specific step can I clarify?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-xl text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm md:text-base">AI Repair Chatbot</h3>
            <p className="text-[11px] text-slate-400">Instant answers for {applianceType}</p>
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

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Assistant is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => handleSend("Where is the filter located?")}
          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
        >
          💡 Where is the filter?
        </button>
        <button
          type="button"
          onClick={() => handleSend("What safety precautions should I take?")}
          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
        >
          🛡️ Safety precautions?
        </button>
        <button
          type="button"
          onClick={() => handleSend("How to test the appliance after repair?")}
          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
        >
          ⚡ How to test after repair?
        </button>
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
          placeholder={`Ask anything about repairing your ${applianceType}...`}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
