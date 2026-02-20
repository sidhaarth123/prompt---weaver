import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Send,
    RefreshCw,
    Copy,
    Check,
    Zap,
    AlertCircle,
    Clock,
    ChevronRight,
    Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/theme";
import { ChatMessage } from "@/hooks/usePromptWeaverChat";

interface PremiumChatbotProps {
    chatHistory: ChatMessage[];
    isLoading: boolean;
    credits: number | null;
    errorStatus: 'UNAUTHORIZED' | 'NO_CREDITS' | 'CONFIG_ERROR' | null;
    suggestions?: string[];
    onSendMessage: (message: string) => void;
    result?: { text: string; json: string } | null;
}

export const PremiumChatbot: React.FC<PremiumChatbotProps> = ({
    chatHistory,
    isLoading,
    credits,
    errorStatus,
    suggestions = [],
    onSendMessage,
    result
}) => {
    const [input, setInput] = useState("");
    const [copiedText, setCopiedText] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isLoading]);

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput("");
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

    return (
        <div className="flex flex-col h-full min-h-[600px] border border-white/10 rounded-3xl bg-[#09090b]/80 backdrop-blur-xl overflow-hidden shadow-2xl relative group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />

            {/* 1. HEADER */}
            <header className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#09090b] shadow-sm shadow-emerald-500/50" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                            Prompt Weaver Assistant
                            <Badge className="text-[10px] font-mono border-primary/30 text-primary/80 px-1.5 py-0 h-4 uppercase bg-transparent">v3.1</Badge>
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-emerald-400/90 tracking-wide uppercase">AI Active</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wide uppercase">Real-time Optimization</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {credits !== null && (
                        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 shadow-inner">
                            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                            <span className="text-xs font-bold text-white/90">{credits} <span className="text-[10px] text-muted-foreground font-medium uppercase ml-0.5 opacity-60">Credits</span></span>
                        </div>
                    )}
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 text-white font-bold h-7 px-3 rounded-full shadow-lg shadow-indigo-500/20">
                        PRO PLAN
                    </Badge>
                </div>
            </header>

            {/* 2. CHAT AREA */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar relative z-10">
                <AnimatePresence initial={false}>
                    {chatHistory.length === 0 && !result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center py-20 opacity-40"
                        >
                            <div className="relative mb-6">
                                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            </div>
                            <p className="text-lg font-medium text-white mb-2">Architect Mode Ready</p>
                            <p className="text-sm max-w-[240px] leading-relaxed">Describe your project requirements to start building a premium prompt.</p>
                        </motion.div>
                    )}

                    {chatHistory.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] rounded-[20px] px-5 py-3.5 text-sm leading-relaxed border shadow-lg backdrop-blur-md",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-primary via-primary/95 to-indigo-600 text-white border-primary/20 rounded-tr-sm"
                                    : "bg-white/[0.03] text-foreground/95 border-white/10 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-start items-center gap-3"
                        >
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 flex items-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Assistant is thinking...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. OUTPUT CARDS */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 pt-4"
                        >
                            <div className="flex items-center gap-2 px-1">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/80">Premium Prompt Generated</span>
                            </div>

                            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.1)] group/card relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-white/10"
                                        onClick={() => handleCopy(result.text)}
                                    >
                                        {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                                    </Button>
                                </div>
                                <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Final Prompt</h4>
                                <div className="text-[13px] font-mono text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto custom-scrollbar pr-4">
                                    {result.text}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full h-10 border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/40 rounded-xl text-xs font-semibold"
                                onClick={handleSubmit}
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                                Regenerate Concept
                            </Button>
                        </motion.div>
                    )}

                    {/* 4. ERROR STATES */}
                    {errorStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "p-4 rounded-2xl border flex flex-col gap-3",
                                errorStatus === 'NO_CREDITS'
                                    ? "bg-yellow-500/10 border-yellow-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <AlertCircle className={cn("w-5 h-5", errorStatus === 'NO_CREDITS' ? "text-yellow-400" : "text-red-400")} />
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        {errorStatus === 'UNAUTHORIZED' ? "Session Expired" :
                                            errorStatus === 'NO_CREDITS' ? "Out of Credits" : "System Configuration Error"}
                                    </h4>
                                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                                        {errorStatus === 'UNAUTHORIZED' ? "Your session has ended. Please login again to continue." :
                                            errorStatus === 'NO_CREDITS' ? "You've reached your generation limit. Upgrade to Scale plan for unlimited prompts." :
                                                "Assistant webhook is not configured correctly. Please check environment variables."}
                                    </p>
                                </div>
                            </div>
                            <Button size="sm" className={cn("w-full h-9 rounded-xl font-bold text-xs uppercase tracking-wider",
                                errorStatus === 'NO_CREDITS' ? "bg-yellow-500 hover:bg-yellow-600 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "bg-primary")}
                                onClick={() => {
                                    if (errorStatus === 'UNAUTHORIZED') navigate("/auth");
                                    else if (errorStatus === 'NO_CREDITS') navigate("/pricing");
                                }}
                            >
                                {errorStatus === 'UNAUTHORIZED' ? "Login Again" :
                                    errorStatus === 'NO_CREDITS' ? "Upgrade Now" : "Contact Support"}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* 5. SUGGESTIONS */}
            {suggestions.length > 0 && chatHistory.length === 0 && (
                <div className="px-6 py-4 flex flex-wrap gap-2 relative z-10 border-t border-white/5 bg-white/[0.01]">
                    {suggestions.slice(0, 4).map((s) => (
                        <button
                            key={s}
                            onClick={() => { setInput(s); }}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-muted-foreground hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* 6. INPUT AREA */}
            <footer className="p-6 pt-2 border-t border-white/5 bg-[#0F0F12] relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition duration-500 blur-sm pointer-events-none" />
                    <div className="relative bg-[#09090b] border border-white/10 rounded-2xl p-1 shadow-2xl transition-all duration-300 group-focus-within/input:border-primary/50 group-focus-within/input:shadow-[0_0_20px_-5px_rgba(124,58,237,0.2)]">
                        <Textarea
                            placeholder="Message Assistant... (e.g. 'Luxury skincare campaign for Instagram')"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[90px] w-full resize-none border-0 bg-transparent px-4 py-3.5 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/40 leading-relaxed"
                            disabled={isLoading || errorStatus === 'UNAUTHORIZED'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <div className="flex justify-between items-center px-4 pb-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    <span>Enter to Send</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Auto-Mapping Active</span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={isLoading || !input.trim()}
                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 border-0 h-9 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-20 translate-y-[-2px]"
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-2" /> Send Message</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
