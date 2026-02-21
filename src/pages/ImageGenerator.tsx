import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    Zap, Send, Copy, Check, X, Plus,
    MessageSquare, Image as ImageIcon
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface HistoryItem {
    id: string;
    title: string;
    date: string;
    icon: "zap" | "image" | "bar" | "layers" | "cpu" | "pen";
}

/* ─── Mock chat history (sidebar) ──────────────────── */
const MOCK_HISTORY: HistoryItem[] = [
    { id: "1", title: "Cyberpunk Cityscape", date: "Oct 26, 2023", icon: "zap" },
    { id: "2", title: "Vintage Portrait Style", date: "Oct 26, 2023", icon: "image" },
    { id: "3", title: "Minimalist Logo Prompt", date: "Oct 26, 2023", icon: "bar" },
    { id: "4", title: "Minimalist Logo Prompt", date: "Oct 26, 2023", icon: "layers" },
    { id: "5", title: "Minimalist Portrait Style", date: "Oct 25, 2023", icon: "pen" },
    { id: "6", title: "Minimalist Logo Prompt", date: "Oct 22, 2023", icon: "cpu" },
    { id: "7", title: "Vintage Portrait Style", date: "Oct 22, 2023", icon: "image" },
    { id: "8", title: "Minimalist Logo Prompt", date: "Oct 26, 2023", icon: "bar" },
    { id: "9", title: "Vintage Portrait Style", date: "Oct 26, 2023", icon: "layers" },
    { id: "10", title: "Cyberpunk Cityscape", date: "Oct 26, 2023", icon: "zap" },
];

/* ─── Small icon component for history items ────────── */
function HistoryIcon({ icon }: { icon: HistoryItem["icon"] }) {
    const gradients: Record<string, string> = {
        zap: "linear-gradient(135deg,#4f46e5,#7c3aed)",
        image: "linear-gradient(135deg,#b45309,#d97706)",
        bar: "linear-gradient(135deg,#0369a1,#0ea5e9)",
        layers: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
        cpu: "linear-gradient(135deg,#0f766e,#14b8a6)",
        pen: "linear-gradient(135deg,#9333ea,#c026d3)",
    };
    const emojis: Record<string, string> = {
        zap: "⚡", image: "🖼", bar: "📊", layers: "◻", cpu: "🔵", pen: "✏"
    };
    return (
        <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: gradients[icon], display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14,
        }}>
            {emojis[icon]}
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function ImageGenerator() {
    const [selectedChat, setSelectedChat] = useState("1");
    const [input, setInput] = useState("");
    const [copiedHuman, setCopiedHuman] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    /* Prompt Weaver chat hook */
    const { chatHistory, isLoading, credits, sendMessage, clearChat } =
        usePromptWeaverChat({
            workflowType: "image",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            prompt: res.prompt_package.prompt,
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

    const handleNewChat = () => {
        clearChat();
        setResult(null);
        setInput("");
    };

    const copyHuman = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.text);
        setCopiedHuman(true);
        setTimeout(() => setCopiedHuman(false), 2000);
        toast({ title: "Human prompt copied!" });
    };

    const copyJson = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.json);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
        toast({ title: "JSON prompt copied!" });
    };

    /* ── shared inline styles ── */
    const col: React.CSSProperties = {
        display: "flex", flexDirection: "column", overflowY: "auto",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0b0b14", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* 3-column body */}
            <div style={{ display: "flex", flex: 1, paddingTop: 64, height: "calc(100vh - 64px)", overflow: "hidden" }}>

                {/* ════════════════════════════════════
            COL 1 — CHAT HISTORY SIDEBAR
        ════════════════════════════════════ */}
                <aside style={{
                    ...col,
                    width: 248,
                    flexShrink: 0,
                    background: "#0f0f1a",
                    borderRight: "1px solid rgba(255,255,255,0.07)",
                    padding: "20px 12px",
                    gap: 0,
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
                        <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Chat History</span>
                        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                            <X style={{ width: 16, height: 16, color: "rgba(255,255,255,0.4)" }} />
                        </button>
                    </div>

                    {/* New Chat button */}
                    <button
                        onClick={handleNewChat}
                        style={{
                            width: "100%", height: 42, borderRadius: 12, border: "none", cursor: "pointer",
                            fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16,
                            background: "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
                            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                    >
                        <Plus style={{ width: 16, height: 16 }} /> New Chat
                    </button>

                    {/* History items */}
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                        {MOCK_HISTORY.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedChat(item.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                                    background: selectedChat === item.id ? "rgba(255,255,255,0.08)" : "transparent",
                                    textAlign: "left", width: "100%",
                                    transition: "background .15s",
                                }}
                                onMouseEnter={e => {
                                    if (selectedChat !== item.id)
                                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                                }}
                                onMouseLeave={e => {
                                    if (selectedChat !== item.id)
                                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                }}
                            >
                                <HistoryIcon icon={item.icon} />
                                <div style={{ overflow: "hidden" }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {item.title}
                                    </p>
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{item.date}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ════════════════════════════════════
            COL 2 — CHAT PANEL
        ════════════════════════════════════ */}
                <div style={{
                    ...col,
                    flex: 1,
                    borderRight: "1px solid rgba(255,255,255,0.07)",
                    background: "#0d0d18",
                    position: "relative",
                }}>
                    {/* Chat header */}
                    <div style={{
                        padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
                        flexShrink: 0,
                    }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Chat</span>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                {/* AI avatar */}
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Zap style={{ width: 17, height: 17, color: "#fff", fill: "#fff" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Prompt Engineer (AI)</p>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.55 }}>
                                        Welcome back, Alex! What kind of image prompt would you like to create today?
                                    </p>
                                </div>
                            </div>
                        )}

                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                {msg.role === "assistant" ? (
                                    /* AI bubble */
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                        background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Zap style={{ width: 17, height: 17, color: "#fff", fill: "#fff" }} />
                                    </div>
                                ) : (
                                    /* User bubble */
                                    <div style={{ position: "relative", flexShrink: 0 }}>
                                        <div style={{
                                            width: 38, height: 38, borderRadius: "50%",
                                            background: "linear-gradient(135deg,#d97706,#f59e0b)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14, fontWeight: 700, color: "#fff",
                                        }}>U</div>
                                        <div style={{
                                            position: "absolute", bottom: 1, right: 0,
                                            width: 10, height: 10, borderRadius: "50%",
                                            background: "#22c55e", border: "2px solid #0d0d18",
                                        }} />
                                    </div>
                                )}
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
                                        {msg.role === "assistant" ? "Prompt Engineer (AI)" : "User"}
                                    </p>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.55 }}>
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Loading bubbles */}
                        {isLoading && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Zap style={{ width: 17, height: 17, color: "#fff", fill: "#fff" }} />
                                </div>
                                <div style={{ paddingTop: 8 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Prompt Engineer (AI)</p>
                                    <div style={{ display: "flex", gap: 5 }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 7, height: 7, borderRadius: "50%", background: "#6366f1",
                                                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
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
                        flexShrink: 0, padding: "16px 24px",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        display: "flex", gap: 12, alignItems: "center",
                        background: "#0d0d18",
                    }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                            placeholder="Type your request..."
                            style={{
                                flex: 1, height: 48, padding: "0 18px", borderRadius: 24,
                                fontSize: 14, color: "rgba(255,255,255,0.7)",
                                background: "#1a1a2a", border: "1px solid rgba(255,255,255,0.08)",
                                outline: "none",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            style={{
                                height: 48, padding: "0 20px", borderRadius: 24, border: "none",
                                cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#fff",
                                background: "linear-gradient(90deg, #06b6d4, #6366f1)",
                                display: "flex", alignItems: "center", gap: 7,
                                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                                opacity: isLoading || !input.trim() ? 0.5 : 1,
                            }}
                        >
                            <Send style={{ width: 15, height: 15 }} /> Send
                        </button>
                    </div>
                </div>

                {/* ════════════════════════════════════
            COL 3 — OUTPUT PANEL
        ════════════════════════════════════ */}
                <div style={{
                    ...col,
                    width: 320,
                    flexShrink: 0,
                    background: "#0d0d18",
                    padding: "0",
                }}>
                    {/* Output header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0,
                    }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Output Panel</span>
                        {/* Credits */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                            borderRadius: 999, background: "#1a1a2a", border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                            <Zap style={{ width: 12, height: 12, color: "#22d3ee" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Credits</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{credits ?? 450}</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>/500</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

                        {/* ── Human Prompt card ── */}
                        <div style={{
                            background: "#181824", borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 16px 10px",
                            }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Human Prompt</span>
                                <button onClick={copyHuman} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                                    {copiedHuman
                                        ? <Check style={{ width: 15, height: 15, color: "#4ade80" }} />
                                        : <Copy style={{ width: 15, height: 15, color: "rgba(255,255,255,0.4)" }} />}
                                </button>
                            </div>

                            <div style={{ padding: "0 16px 14px" }}>
                                {result ? (
                                    <>
                                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: "0 0 12px" }}>
                                            "{result.text}"
                                        </p>
                                        {/* Tags */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                            {["Aspect: 16:9", "Style: Cyberpunk", "Platform: Midjourney"].map(tag => (
                                                <span key={tag} style={{
                                                    padding: "3px 10px", borderRadius: 999, fontSize: 11,
                                                    color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)",
                                                    background: "rgba(255,255,255,0.04)",
                                                }}>{tag}</span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>
                                        Your generated prompt will appear here…
                                    </p>
                                )}

                                <button
                                    onClick={copyHuman}
                                    disabled={!result}
                                    style={{
                                        width: "100%", height: 40, borderRadius: 10, border: "none", cursor: "pointer",
                                        background: "#232333", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                        opacity: result ? 1 : 0.4,
                                    }}
                                >
                                    <Copy style={{ width: 14, height: 14 }} /> Copy to Clipboard
                                </button>
                            </div>
                        </div>

                        {/* ── JSON Prompt card ── */}
                        <div style={{
                            background: "#181824", borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 16px 10px",
                            }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>JSON Prompt</span>
                                <button onClick={copyJson} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                                    {copiedJson
                                        ? <Check style={{ width: 15, height: 15, color: "#4ade80" }} />
                                        : <Copy style={{ width: 15, height: 15, color: "rgba(255,255,255,0.4)" }} />}
                                </button>
                            </div>

                            <div style={{ padding: "0 16px 14px" }}>
                                <div style={{
                                    background: "#0f0f1e", borderRadius: 10, padding: "12px", marginBottom: 14,
                                    maxHeight: 260, overflowY: "auto",
                                }}>
                                    {result ? (
                                        <pre style={{
                                            fontSize: 11.5, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap",
                                            fontFamily: "'Fira Code', 'Courier New', monospace",
                                            color: "#22d3ee",
                                        }}>
                                            {result.json}
                                        </pre>
                                    ) : (
                                        <pre style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0, fontFamily: "monospace" }}>
                                            {`{
  "prompt": "...",
  "platform": "...",
  "aspect": "...",
  "style": "..."
}`}
                                        </pre>
                                    )}
                                </div>

                                <button
                                    onClick={copyJson}
                                    disabled={!result}
                                    style={{
                                        width: "100%", height: 40, borderRadius: 10, border: "none", cursor: "pointer",
                                        background: "#232333", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                        opacity: result ? 1 : 0.4,
                                    }}
                                >
                                    <Copy style={{ width: 14, height: 14 }} /> Copy to Clipboard
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bounce animation */}
            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
        </div>
    );
}
