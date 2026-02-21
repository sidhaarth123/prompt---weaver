import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import { Zap, Send, Copy, Check, X } from "lucide-react";

/* ─── Video history sidebar items ───────────────────── */
interface VideoHistoryItem {
    id: string;
    title: string;
    gradient: string;
    emoji: string;
}

const VIDEO_HISTORY: VideoHistoryItem[] = [
    { id: "1", title: "Cinematic Drone Over Iceland", gradient: "linear-gradient(135deg,#0f4c75,#1b6ca8,#16a085)", emoji: "🏔" },
    { id: "2", title: "Cyberpunk Cityscape", gradient: "linear-gradient(135deg,#6a0572,#a855f7,#06b6d4)", emoji: "🌆" },
    { id: "3", title: "Abstract Particle Flow", gradient: "linear-gradient(135deg,#1a1a2e,#7c3aed,#a855f7)", emoji: "✨" },
    { id: "4", title: "Underwater Reef Life", gradient: "linear-gradient(135deg,#006994,#0ea5e9,#22d3ee)", emoji: "🐠" },
];

/* ─── Brand logo (replaces ChatGPT-style icon) ──────── */
function BrandAvatar() {
    return (
        <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(99,60,220,0.45)",
        }}>
            <Zap style={{ width: 17, height: 17, color: "#fff", fill: "#fff" }} />
        </div>
    );
}

/* ─── Component ─────────────────────────────────────── */
export default function VideoGenerator() {
    const [selectedVideo, setSelectedVideo] = useState("1");
    const [input, setInput] = useState("");
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    /* Chat hook */
    const { chatHistory, isLoading, credits, sendMessage, clearChat } =
        usePromptWeaverChat({
            workflowType: "image", // reuse image workflow for now
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            type: "video",
                            description: res.prompt_package.prompt,
                            negative_prompt: res.prompt_package.negative_prompt,
                            ...(res.final ?? {}),
                        }, null, 2),
                    });
                }
            },
        });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isLoading]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input.trim());
        setInput("");
    };

    const copyPrompt = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.text);
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
        toast({ title: "Prompt copied!" });
    };

    const copyJson = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.json);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
        toast({ title: "JSON copied!" });
    };

    /* Shared card style */
    const cardSt: React.CSSProperties = {
        borderRadius: 12,
        border: "1px solid rgba(99,102,241,0.3)",
        background: "rgba(15,15,35,0.85)",
        overflow: "hidden",
        marginBottom: 14,
    };

    const copyBtnSt: React.CSSProperties = {
        width: "100%", height: 38, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)", cursor: "pointer", fontSize: 13,
        fontWeight: 600, color: "rgba(255,255,255,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #080820 0%, #0d0d2b 40%, #090920 100%)",
            display: "flex", flexDirection: "column",
        }}>
            <Navbar />

            {/* Page title */}
            <div style={{ textAlign: "center", padding: "28px 24px 18px", flexShrink: 0 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                    Video Prompt Generator Chat Dashboard
                </h1>
            </div>

            {/* 3-column body */}
            <div style={{
                display: "flex", flex: 1,
                padding: "0 24px 24px",
                gap: 18,
                height: "calc(100vh - 160px)",
                overflow: "hidden",
            }}>

                {/* ════════════════════════════
            COL 1 — VIDEO HISTORY
        ════════════════════════════ */}
                <aside style={{
                    width: 180, flexShrink: 0,
                    borderRadius: 14,
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: "rgba(10,10,30,0.8)",
                    padding: "16px 12px",
                    display: "flex", flexDirection: "column",
                    overflowY: "auto",
                }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 14px 2px" }}>Video History</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {VIDEO_HISTORY.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedVideo(item.id)}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    width: "100%", height: 90, borderRadius: 10,
                                    background: item.gradient,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 28, marginBottom: 6,
                                    border: selectedVideo === item.id
                                        ? "2px solid rgba(99,102,241,0.8)"
                                        : "2px solid transparent",
                                    transition: "border .15s",
                                }}>
                                    {item.emoji}
                                </div>
                                <p style={{
                                    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                                    margin: 0, lineHeight: 1.3,
                                }}>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ════════════════════════════
            COL 2 — CHAT
        ════════════════════════════ */}
                <div style={{
                    flex: 1,
                    borderRadius: 14,
                    border: "1px solid rgba(99,102,241,0.25)",
                    background: "rgba(10,10,30,0.6)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    position: "relative",
                }}>
                    {/* Purple blob glow inside chat */}
                    <div style={{
                        position: "absolute", top: "30%", left: "30%",
                        width: 300, height: 300,
                        background: "radial-gradient(circle, rgba(99,60,220,0.12) 0%, transparent 70%)",
                        filter: "blur(40px)", pointerEvents: "none",
                    }} />

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                        {/* Default welcome message */}
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <BrandAvatar />
                                <div style={{
                                    background: "rgba(99,102,241,0.18)",
                                    border: "1px solid rgba(99,102,241,0.3)",
                                    borderRadius: "4px 14px 14px 14px",
                                    padding: "12px 16px", maxWidth: "70%",
                                }}>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
                                        Hello! I'm your AI Video Prompt Generator. Describe the video you want to create, and I'll craft the perfect prompt for you.
                                    </p>
                                </div>
                            </div>
                        )}

                        {chatHistory.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 12,
                                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                }}
                            >
                                {msg.role === "assistant" ? (
                                    <BrandAvatar />
                                ) : (
                                    /* User avatar */
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                        background: "linear-gradient(135deg,#374151,#4b5563)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 13, fontWeight: 700, color: "#fff",
                                    }}>U</div>
                                )}

                                <div style={{
                                    background: msg.role === "assistant"
                                        ? "rgba(99,102,241,0.18)"
                                        : "rgba(55,65,81,0.7)",
                                    border: msg.role === "assistant"
                                        ? "1px solid rgba(99,102,241,0.3)"
                                        : "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: msg.role === "assistant"
                                        ? "4px 14px 14px 14px"
                                        : "14px 4px 14px 14px",
                                    padding: "12px 16px",
                                    maxWidth: "68%",
                                }}>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <BrandAvatar />
                                <div style={{
                                    background: "rgba(99,102,241,0.18)",
                                    border: "1px solid rgba(99,102,241,0.3)",
                                    borderRadius: "4px 14px 14px 14px",
                                    padding: "16px",
                                }}>
                                    <div style={{ display: "flex", gap: 5 }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 7, height: 7, borderRadius: "50%",
                                                background: "#818cf8",
                                                animation: `videoBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input bar */}
                    <div style={{
                        flexShrink: 0,
                        padding: "14px 20px",
                        borderTop: "1px solid rgba(99,102,241,0.2)",
                        display: "flex", gap: 10, alignItems: "center",
                        background: "rgba(10,10,30,0.8)",
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                            placeholder="Type your video idea here or ask for suggestions..."
                            style={{
                                flex: 1, height: 46, padding: "0 18px", borderRadius: 30,
                                fontSize: 14, color: "rgba(255,255,255,0.75)",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(99,102,241,0.25)", outline: "none",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: 46, height: 46, borderRadius: "50%", border: "none",
                                cursor: "pointer", flexShrink: 0,
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 16px rgba(99,102,241,0.5)",
                                opacity: isLoading || !input.trim() ? 0.5 : 1,
                            }}
                        >
                            <Send style={{ width: 18, height: 18, color: "#fff" }} />
                        </button>
                    </div>
                </div>

                {/* ════════════════════════════
            COL 3 — VIDEO OUTPUT PANEL
        ════════════════════════════ */}
                <div style={{
                    width: 310, flexShrink: 0,
                    borderRadius: 14,
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: "rgba(10,10,30,0.8)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                }}>
                    {/* Panel header */}
                    <div style={{
                        padding: "16px 18px",
                        borderBottom: "1px solid rgba(99,102,241,0.2)",
                        flexShrink: 0,
                    }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Video Output Panel</p>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>

                        {/* Human Prompt card */}
                        <div style={cardSt}>
                            {/* Card header */}
                            <div style={{
                                padding: "10px 14px",
                                background: "linear-gradient(90deg, rgba(99,102,241,0.35), rgba(139,92,246,0.2))",
                                borderBottom: "1px solid rgba(99,102,241,0.2)",
                            }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>
                                    Human Prompt <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>(Optimized for Sora/Runway)</span>
                                </p>
                            </div>
                            <div style={{ padding: "12px 14px" }}>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: "0 0 14px" }}>
                                    {result?.text ?? "Your video prompt will appear here after you describe your concept in the chat…"}
                                </p>
                                <button
                                    onClick={copyPrompt}
                                    disabled={!result}
                                    style={{ ...copyBtnSt, opacity: result ? 1 : 0.4 }}
                                >
                                    {copiedPrompt ? <Check style={{ width: 14, height: 14, color: "#4ade80" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                                    {copiedPrompt ? "Copied!" : "Copy Prompt"}
                                </button>
                            </div>
                        </div>

                        {/* JSON Prompt card */}
                        <div style={cardSt}>
                            <div style={{
                                padding: "10px 14px",
                                background: "linear-gradient(90deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                                borderBottom: "1px solid rgba(99,102,241,0.2)",
                            }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>JSON Prompt</p>
                            </div>
                            <div style={{ padding: "12px 14px" }}>
                                <div style={{
                                    background: "#07071a", borderRadius: 8, padding: "12px",
                                    maxHeight: 240, overflowY: "auto", marginBottom: 14,
                                }}>
                                    <pre style={{
                                        fontSize: 11.5, color: "rgba(255,255,255,0.75)", fontFamily: "'Fira Code', monospace",
                                        lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap",
                                    }}>
                                        {result?.json ?? `{\n  "type": "video",\n  "description": "...",\n  "style": "cinematic, photorealistic, 4K",\n  "elements": ["skyscrapers", "flying vehicles"],\n  "atmosphere": "bustling, vibrant"\n}`}
                                    </pre>
                                </div>
                                <button
                                    onClick={copyJson}
                                    disabled={!result}
                                    style={{ ...copyBtnSt, opacity: result ? 1 : 0.4 }}
                                >
                                    {copiedJson ? <Check style={{ width: 14, height: 14, color: "#4ade80" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                                    {copiedJson ? "Copied!" : "Copy JSON"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <style>{`
        @keyframes videoBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
      `}</style>
        </div>
    );
}
