import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Globe,
    X,
    Send,
    Layers,
    Zap,
    Loader2,
    LayoutTemplate
} from "lucide-react";
import { cn } from "@/lib/theme"; // Using standard theme/utils

type Props = {
    onSend: (msg: string) => Promise<void>;
};

type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
};

const WEBSITE_SUGGESTIONS = [
    "Shopify product landing page",
    "DTC brand homepage blueprint",
    "High-converting funnel structure",
    "Premium SaaS pricing page layout"
];

export default function WebsiteAssistantWidget({ onSend }: Props) {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Welcome to the Blueprint Architect. Describe your business goals, and I'll structure a high-converting site layout for you."
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
            // Actual Logic: Call parent onSend (Website Generator Logic)
            await onSend(text);

            // UI: Add assistant success confirmation
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "Blueprint drafted. I've configured the sections, tech stack, and conversion strategy based on your requirements."
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "Architecture error. I couldn't process that structure request. Please refine the prompt."
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
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpen(true)}
                        className={cn(
                            "fixed bottom-6 right-6 z-50 flex items-center justify-center",
                            "w-[60px] h-[60px] rounded-[16px] text-white",
                            "bg-gradient-to-br from-[#00AAFF] to-[#7C3AED]"
                        )}
                        style={{
                            boxShadow: "0 0 36px rgba(0,170,255,0.45), 0 0 40px rgba(124,58,237,0.35)",
                        }}
                        aria-label="Website Assistant"
                    >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-[16px] bg-white/20 animate-pulse border border-white/20" />
                        <Layers className="w-7 h-7 relative z-10 fill-white/10" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden shadow-2xl",
                            "w-[440px] max-w-[95vw] h-[650px] max-h-[85vh]",
                            "rounded-[22px] backdrop-blur-[22px] border border-white/10"
                        )}
                        style={{
                            background: "rgba(10, 12, 18, 0.92)",
                            boxShadow: "0 26px 80px rgba(0,0,0,0.65)",
                        }}
                    >
                        {/* 1. Header (Agency/Blueprint Style) */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-transparent relative overflow-hidden">
                            {/* Tech line accent */}
                            <div className="absolute bottom-0 left-0 w-full h-px bg-white/5" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00AAFF] to-[#7C3AED] flex items-center justify-center shadow-lg ring-1 ring-white/10 group">
                                        <LayoutTemplate className="w-5 h-5 text-white relative z-10" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 border-2 border-[#0A0C12] rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-white leading-none tracking-wide font-display">Website Architect</h3>
                                    <p className="text-[11px] uppercase tracking-widest text-cyan-400/80 font-semibold pt-1.5 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                                        Conversion AI
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="group p-2.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* 2. Conversation Area */}
                        <div
                            className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar relative"
                            ref={scrollRef}
                        >
                            {/* Ambient glow in background */}
                            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full relative z-10",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] px-5 py-4 text-[13.5px] leading-[1.6] shadow-xl backdrop-blur-md",
                                            m.role === "user"
                                                ? "bg-gradient-to-br from-[#00AAFF] to-[#7C3AED] text-white rounded-[20px] rounded-tr-sm border border-white/20 font-medium"
                                                : "bg-[#13161C]/90 text-blue-50/90 border border-white/5 rounded-[20px] rounded-tl-sm shadow-inner"
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
                                    className="flex justify-start w-full relative z-10"
                                >
                                    <div className="bg-[#13161C]/90 border border-white/5 px-5 py-4 rounded-[20px] rounded-tl-sm flex items-center gap-2 backdrop-blur-md">
                                        <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider mr-1">Drafting Blueprint</span>
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 3. Input & Suggestions Area */}
                        <div className="p-5 bg-[#0A0C12] border-t border-white/5 space-y-4 backdrop-blur-xl relative z-20">
                            {/* Suggestions */}
                            <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
                                {WEBSITE_SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setMsg(s)}
                                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] font-semibold tracking-wide text-gray-400 hover:text-cyan-200 hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all flex items-center gap-2 group snap-start uppercase"
                                    >
                                        <Zap className="w-3 h-3 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Input Field (Textarea style) */}
                            <div className="relative group">
                                <div className="absolute top-4 left-4 flex items-center pointer-events-none">
                                    <Globe className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        msg ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "text-gray-600 group-hover:text-gray-500"
                                    )} />
                                </div>
                                <textarea
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe your store... e.g. DTC skincare, sections: hero, features, pricing"
                                    className="w-full min-h-[80px] bg-[#13161C] border border-white/10 text-white text-[13px] rounded-[16px] py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#181B21] transition-all placeholder:text-gray-600 shadow-inner resize-none font-sans leading-relaxed"
                                />
                                <div className="absolute bottom-3 right-3 text-[10px] text-gray-700 font-mono pointer-events-none uppercase">
                                    Return ⏎ to send
                                </div>
                            </div>

                            <button
                                onClick={send}
                                disabled={loading || !msg.trim()}
                                className={cn(
                                    "w-full py-4 rounded-[16px] text-sm font-bold tracking-wide uppercase shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden",
                                    loading || !msg.trim()
                                        ? "bg-white/5 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#00AAFF] to-[#7C3AED] text-white hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,170,255,0.3)]"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                                        <span>Designing Blueprint...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Auto-Fill Website Blueprint</span>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}

                                {/* Shine effect */}
                                {!loading && msg.trim() && (
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
