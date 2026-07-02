"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/providers/theme-provider";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/config";
import { Button } from "@/components/ui/button";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronLeft,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export default function ChatPage() {
  const { status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch(`${baseUrl}/api/openmodel/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const json = await res.json();

      let reply = "";
      if (json.success && json.data?.content) {
        reply = json.data.content;
      } else if (json.data?.choices?.[0]?.message?.content) {
        reply = json.data.choices[0].message.content;
      } else {
        reply = "Maaf, saya tidak bisa memproses permintaan saat ini.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Terjadi kesalahan koneksi. Silakan coba lagi.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_messages");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isMounted) return null;
  if (status === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-lg border-b ${isDark ? "bg-slate-950/80 border-white/10" : "bg-white/80 border-gray-200"}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm">AI Assistant</h1>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {isLoading ? "Mengetik..." : "Online"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className={isDark ? "text-gray-300 hover:text-red-400" : "text-gray-600 hover:text-red-500"}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
              <p className={`text-sm max-w-md ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Tanyakan apa saja tentang Partner Flow, referal, komisi, atau bantuan lainnya.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-sm">
                {[
                  "Bagaimana cara mendapatkan referral?",
                  "Berapa komisi per referral?",
                  "Cara tarik saldo",
                  "Bantuan teknis",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className={`text-xs p-3 rounded-xl border text-left transition-all hover:scale-105 ${isDark ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === "user" ? "order-1" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? isDark
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-blue-500 text-white rounded-br-md"
                        : isDark
                        ? "bg-slate-800 text-gray-100 rounded-bl-md border border-white/5"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className={`text-[10px] mt-1 ${isDark ? "text-gray-500" : "text-gray-400"} ${msg.role === "user" ? "text-right" : ""}`}>
                    {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? "bg-slate-700" : "bg-gray-200"}`}>
                    <User className={`w-4 h-4 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-slate-800 border border-white/5" : "bg-white border border-gray-200 shadow-sm"}`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`sticky bottom-0 border-t backdrop-blur-lg ${isDark ? "bg-slate-950/80 border-white/10" : "bg-white/80 border-gray-200"}`}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className={`flex items-end gap-2 rounded-2xl border px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500 ${isDark ? "bg-slate-800 border-white/10" : "bg-white border-gray-200"}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              rows={1}
              className={`flex-1 bg-transparent text-sm outline-none resize-none max-h-32 py-1.5 ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-xl mb-0.5 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className={`text-[10px] text-center mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            AI dapat melakukan kesalahan. Verifikasi informasi penting.
          </p>
        </div>
      </div>
    </div>
  );
}
