import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, SparklesIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChat = ({ isOpen, onClose }: AIChatProps): JSX.Element | null => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello. I'm the Knowledge Tank AI. I've analyzed this episode. Ask me about scaling strategies, metrics, or guest insights.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: inputValue,
            context: "Episode: Scaling Consumer Brands in India",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const backdropStyles = isDark
    ? "bg-black/60"
    : "bg-black/40";

  const panelStyles = isDark
    ? "bg-zinc-900 border-[#fffefe0d]"
    : "bg-white border-zinc-200";

  const borderStyles = isDark
    ? "border-[#fffefe0d]"
    : "border-zinc-200";

  const titleStyles = isDark
    ? "text-white"
    : "text-zinc-900";

  const closeButtonStyles = isDark
    ? "text-[#9e9ea9] hover:text-white hover:bg-zinc-800"
    : "text-zinc-600 hover:text-black hover:bg-zinc-100";

  const assistantMessageStyles = isDark
    ? "bg-zinc-800 text-zinc-200"
    : "bg-zinc-100 text-zinc-800";

  const inputStyles = isDark
    ? "bg-zinc-800 text-white placeholder-[#9e9ea9] border-[#fffefe0d] focus:border-[#2b7fff]"
    : "bg-zinc-50 text-zinc-900 placeholder-zinc-400 border-zinc-200 focus:border-blue-500";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in ${backdropStyles}`}>
      <div className={`w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl flex flex-col border animate-fade-up ${panelStyles}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderStyles}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#1e5fd9]">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-lg font-bold [font-family:'Arial-Bold',Helvetica] ${titleStyles}`}>
              Ask KST AI
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${closeButtonStyles}`}
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#2b7fff] text-white"
                    : assistantMessageStyles
                }`}
              >
                <p className="text-sm leading-relaxed [font-family:'Arial-Regular',Helvetica]">
                  {message.content}
                </p>
                <span className="text-xs opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 ${assistantMessageStyles}`}>
                <Loader2 className="w-5 h-5 text-[#2b7fff] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={`px-6 py-4 border-t ${borderStyles}`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className={`flex-1 px-4 py-3 rounded-full border focus:outline-none transition-colors duration-200 [font-family:'Arial-Regular',Helvetica] ${inputStyles}`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2b7fff] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1e5fd9] transition-colors duration-200"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
