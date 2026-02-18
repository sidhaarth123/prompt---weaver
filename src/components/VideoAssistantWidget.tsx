import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Video,
    X,
    Send,
    Clapperboard,
    Zap,
    Loader2,
    Film
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

const VIDEO_SUGGESTIONS = [
    "15s TikTok skincare ad",
    "Amazon listing demo video",
    "UGC style testimonial ad",
    "High-converting Shopify hero video"
];

export default function VideoAssistantWidget({ onSend }: Props) {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Ready on set! Describe your video ad concept, and I'll structure the perfect script and prompt for you."
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
            // Actual Logic: Call parent onSend (Video Generator Logic)
            await onSend(text);

            // UI: Add assistant success confirmation
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "Scene set! I've updated the script, visuals, and audio settings. Review the storyboard above."
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: "Cut! I ran into an issue processing that direction. Please try again."
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
                            "w-[60px] h-[60px] rounded-[18px] text-white",
                            "bg-gradient-to-br from-[#FF5A3C] to-[#FF8C3C]"
                        )}
                        style={{
                            boxShadow: "0 0 35px rgba(255,90,60,0.6)",
                        }}
                        aria-label="Video Assistant"
                    >
                        {/* Pulse effect */}
                        <span className="absolute inset-0 rounded-[18px] bg-white/20 animate-pulse border border-white/20" />
                        <Clapperboard className="w-7 h-7 relative z-10 fill-white/10" />
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
                            "w-[420px] max-w-[95vw] h-[650px] max-h-[85vh]",
                            "rounded-[22px] backdrop-blur-[22px] border border-white/10"
                        )}
                        style={{
                            background: "rgba(15, 10, 8, 0.92)",
                            boxShadow: "0 25px 70px rgba(0,0,0,0.65)",
                        }}
                    >
                        {/* 1. Header (Cinematic Film Style) */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-gradient-to-r from-orange-500/5 to-transparent relative overflow-hidden">
                            {/* Cinematic lighting accent */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF5A3C] to-[#C03010] flex items-center justify-center shadow-lg ring-1 ring-white/10 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                        <Film className="w-5 h-5 text-white relative z-10" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1a0f0a] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-white leading-none tracking-wide font-display">Video Director</h3>
                                    <p className="text-[11px] uppercase tracking-widest text-orange-400/80 font-semibold pt-1.5 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                                        Performance AI
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="group p-2.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* 2. Conversation Area */}
                        <div
                            className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar relative"
                            ref={scrollRef}
                        >
                            {/* Ambient glow in background */}
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

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
                                                ? "bg-gradient-to-br from-[#FF5A3C] to-[#D9381E] text-white rounded-[20px] rounded-tr-sm border border-white/20 font-medium"
                                                : "bg-[#1A120F]/80 text-orange-50/90 border border-white/5 rounded-[20px] rounded-tl-sm shadow-inner"
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
                                    <div className="bg-[#1A120F]/80 border border-white/5 px-5 py-4 rounded-[20px] rounded-tl-sm flex items-center gap-2 backdrop-blur-md">
                                        <span className="text-xs font-medium text-orange-400 uppercase tracking-wider mr-1">Scripting</span>
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse [animation-delay:0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse [animation-delay:0.3s]" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 3. Input & Suggestions Area */}
                        <div className="p-5 bg-[#0F0A08] border-t border-white/5 space-y-4 backdrop-blur-xl relative z-20">
                            {/* Suggestions */}
                            <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
                                {VIDEO_SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setMsg(s)}
                                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] font-semibold tracking-wide text-gray-400 hover:text-orange-200 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(255,90,60,0.15)] transition-all flex items-center gap-2 group snap-start uppercase"
                                    >
                                        <Zap className="w-3 h-3 text-orange-600 group-hover:text-orange-400 transition-colors" />
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Input Field */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Video className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        msg ? "text-orange-500 drop-shadow-[0_0_8px_rgba(255,90,60,0.6)]" : "text-gray-600 group-hover:text-gray-500"
                                    )} />
                                </div>
                                <input
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe your video... e.g. 15s skincare, 9:16, hook"
                                    className="w-full bg-[#181210] border border-white/10 text-white text-[13px] rounded-[16px] py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:bg-[#1f1714] transition-all placeholder:text-gray-600 shadow-inner"
                                />
                                <button
                                    onClick={send}
                                    disabled={loading || !msg.trim()}
                                    className={cn(
                                        "absolute inset-y-1.5 right-1.5 px-4 rounded-[12px] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all",
                                        loading || !msg.trim()
                                            ? "text-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#FF5A3C] to-[#E04020] text-white shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02]"
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <span className="text-[10px] text-gray-600/70 font-medium tracking-widest uppercase">
                                    AI-Director Mode Active
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
