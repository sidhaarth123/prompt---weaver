import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Sparkles,
    X,
    Send,
    Bot,
    Zap,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/theme";

type Props = {
    onSend: (msg: string) => Promise<void>;
};

type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
};

const SUGGESTIONS = [
    "Amazon product hero",
    "Luxury skincare ad",
    "Minimal studio packshot",
    "UGC-style product shot"
];

export default function PromptAssistantWidget({ onSend }: Props) {
    console.log("NEW UI VERSION LOADED");
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Hello! I'm your E-commerce AI Assistant. Describe your vision, and I'll auto-fill the details for you."
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open, loading]);

    async function send() {
        const text = msg.trim();
        if (!text) return;

        // UI: Add user message immediately
        const userMsg: Message = { id: Date.now().toString(), role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setMsg("");
        setLoading(true);

        try {
            // Actual Logic: Call parent onSend (Image Generator Logic)
            await onSend(text);

            // UI: Add assistant success confirmation
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "I've updated the form with your innovative concept. Ready to generate!"
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "Sorry, I encountered an issue fulfilling that request."
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpen(true)}
                        className={cn(
                            "fixed bottom-6 right-6 z-50 flex items-center justify-center",
                            "w-14 h-14 rounded-2xl text-white shadow-2xl",
                            "bg-gradient-to-br from-violet-600 to-indigo-600"
                        )}
                        style={{
                            boxShadow: "0 0 30px rgba(124,58,237,0.6)",
                        }}
                        aria-label="Prompt Assistant"
                    >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                        <Sparkles className="w-6 h-6 relative z-10" fill="currentColor" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                        className={cn(
                            "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden shadow-2xl",
                            "w-[400px] max-w-[95vw] h-[600px] max-h-[80vh]",
                            "rounded-[20px] backdrop-blur-xl border border-white/10"
                        )}
                        style={{
                            background: "rgba(15,15,20,0.85)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                        }}
                    >
                        {/* 1. Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg ring-1 ring-white/10">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1a1a20] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-tight">Prompt Weaver</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium pt-0.5">E-commerce AI Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="group p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all duration-200"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* 2. Conversation Area */}
                        <div
                            className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
                            ref={scrollRef}
                        >
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] px-4 py-3.5 text-sm leading-relaxed shadow-lg backdrop-blur-sm",
                                            m.role === "user"
                                                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm border border-white/10"
                                                : "bg-white/5 text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm hover:bg-white/10 transition-colors"
                                        )}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start w-full"
                                >
                                    <div className="bg-white/5 border border-white/5 px-4 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 backdrop-blur-sm">
                                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 3. Input & Suggestions Area */}
                        <div className="p-4 bg-black/40 border-t border-white/5 space-y-3 backdrop-blur-md">
                            {/* Suggestions */}
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setMsg(s)}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 hover:border-violet-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all flex items-center gap-1.5 group snap-start"
                                    >
                                        <Zap className="w-3 h-3 text-violet-500 group-hover:text-violet-400 transition-colors" />
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Input Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Sparkles className={cn(
                                        "w-4 h-4 transition-colors duration-300",
                                        msg ? "text-violet-400 animate-pulse" : "text-gray-500 group-hover:text-gray-400"
                                    )} />
                                </div>
                                <input
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe your prompt idea..."
                                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-[14px] py-3.5 pl-10 pr-12 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:bg-white/10 transition-all placeholder:text-gray-500/80 shadow-inner"
                                />
                                <button
                                    onClick={send}
                                    disabled={loading || !msg.trim()}
                                    className="absolute inset-y-1.5 right-1.5 px-3 rounded-[10px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:brightness-100 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
                                >
                                    {loading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            <div className="text-center pt-1">
                                <span className="text-[10px] text-gray-600 font-medium tracking-wide">
                                    AI-generated suggestions may vary. Review before use.
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
