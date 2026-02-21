import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import { Zap, Send, Copy, Check, Save, FlaskConical, Archive, ArrowUpRight } from "lucide-react";

/* ─── Studio history items ───────────────────────────── */
const STUDIO_HISTORY = [
    { id: "1", title: "Cyberpunk Metropolis", ago: "2M AGO", gradient: "linear-gradient(135deg,#0a1628,#1a2a4a)" },
    { id: "2", title: "Ethereal Portrait", ago: "1H AGO", gradient: "linear-gradient(135deg,#0d1a2e,#0f2342)" },
    { id: "3", title: "Neon Dreamscape", ago: "3H AGO", gradient: "linear-gradient(135deg,#0a1020,#12213a)" },
];

/* ─── Brand avatar (cyan version) ───────────────────── */
function AvatarIcon() {
    return (
        <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "rgba(6,182,212,0.15)",
            border: "1.5px solid rgba(6,182,212,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(6,182,212,0.3)",
        }}>
            <Zap style={{ width: 14, height: 14, color: "#22d3ee", fill: "#22d3ee" }} />
        </div>
    );
}

/* ─── JSON syntax highlighting ───────────────────────── */
function JsonHighlight({ json }: { json: string }) {
    const lines = json.split("\n");
    return (
        <pre style={{ margin: 0, fontFamily: "'Fira Code','Courier New',monospace", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {lines.map((line, i) => {
                const keyMatch = line.match(/^(\s*)"([^"]+)"(\s*:\s*)(.*)/);
                const braceLine = line.trim() === "{" || line.trim() === "}" || line.trim() === "}," || line.trim() === "[" || line.trim() === "],";
                if (braceLine) return <span key={i} style={{ color: "rgba(255,255,255,0.3)" }}>{line}{"\n"}</span>;
                if (keyMatch) {
                    const [, indent, key, colon, value] = keyMatch;
                    const valColor = value.startsWith('"') ? "#a78bfa" : value.startsWith("[") || value.startsWith("{") ? "rgba(255,255,255,0.3)" : "#34d399";
                    return (
                        <span key={i}>
                            {indent}<span style={{ color: "#22d3ee" }}>"{key}"</span>
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>{colon}</span>
                            <span style={{ color: valColor }}>{value}</span>{"\n"}
                        </span>
                    );
                }
                return <span key={i} style={{ color: "rgba(255,255,255,0.5)" }}>{line}{"\n"}</span>;
            })}
        </pre>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function ImageGenerator() {
    const [selectedItem, setSelectedItem] = useState("1");
    const [activeTab, setActiveTab] = useState<"human" | "json">("human");
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const defaultJson = `{
  "subject": "cyberpunk_alley",
  "environment": "rainy_tokyo",
  "lighting": ["cyan_neon", "magenta"],
  "resolution": "8k",
  "aspect_ratio": 1.77
}`;

    const defaultText = `"Cinematic high-angle shot of a Tokyo-inspired cyberpunk alleyway during a torrential downpour. Intricate neon signage in electric cyan and magenta reflecting off wet obsidian asphalt. Volumetric fog, anamorphic lens flares, Hyper-realistic, 8k, Unreal Engine 5 render style --ar 16:9 --v 6.0"`;

    const { chatHistory, isLoading, credits, sendMessage } =
        usePromptWeaverChat({
            workflowType: "image",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            subject: res.final?.subject ?? "generated",
                            environment: res.final?.environment ?? "dynamic",
                            lighting: res.final?.lighting ?? ["ambient"],
                            resolution: res.final?.resolution ?? "4k",
                            aspect_ratio: res.final?.aspect_ratio ?? 1.77,
                            negative_prompt: res.prompt_package.negative_prompt,
                        }, null, 2),
                    });
                }
            },
        });

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isLoading]);

    const handleSend = () => { if (!input.trim() || isLoading) return; sendMessage(input.trim()); setInput(""); };

    const handleCopy = async () => {
        const text = result?.text ?? defaultText;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Prompt copied!" });
    };

    /* Dimensions */
    const SIDEBAR_W = 200;
    const OUTPUT_W = 300;

    return (
        <div style={{ height: "100vh", background: "#07080d", display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 80, fontFamily: "'Inter','SF Pro',system-ui,sans-serif" }}>
            <Navbar />

            {/* 3-column body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", marginTop: 0 }}>

                {/* ════ COL 1 — STUDIO HISTORY ════ */}
                <aside style={{
                    width: SIDEBAR_W, flexShrink: 0,
                    background: "#05060a",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", flexDirection: "column",
                    padding: "20px 14px 14px",
                    overflow: "hidden",
                }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 16px 2px" }}>
                        Studio History
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
                        {STUDIO_HISTORY.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item.id)}
                                style={{
                                    borderRadius: 8, cursor: "pointer",
                                    border: selectedItem === item.id ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(255,255,255,0.05)",
                                    overflow: "hidden",
                                    outline: selectedItem === item.id ? "0px solid rgba(6,182,212,0.1)" : "none",
                                    boxShadow: selectedItem === item.id ? "0 0 12px rgba(6,182,212,0.1)" : "none",
                                    transition: "all .15s",
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{ height: 96, background: item.gradient, width: "100%" }} />
                                {/* Label */}
                                <div style={{ padding: "8px 10px", background: "#0b0c12" }}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: "0 0 2px", lineHeight: 1.3 }}>{item.title}</p>
                                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.06em" }}>{item.ago}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View Archive */}
                    <button style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>View Archive</span>
                        <ArrowUpRight style={{ width: 11, height: 11, color: "rgba(255,255,255,0.28)" }} />
                    </button>
                </aside>

                {/* ════ COL 2 — CHAT WORKSPACE ════ */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#07080d", borderRight: "1px solid rgba(255,255,255,0.04)", overflow: "hidden" }}>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Default welcome */}
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                <AvatarIcon />
                                <div style={{
                                    background: "#0d0f18", border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "2px 12px 12px 12px",
                                    padding: "14px 18px", maxWidth: "68%",
                                }}>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>
                                        Welcome to the Architect Studio. Describe the vision you'd like to materialize into a prompt.
                                    </p>
                                </div>
                            </div>
                        )}

                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                                {msg.role === "assistant" ? (
                                    <AvatarIcon />
                                ) : (
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>U</div>
                                )}
                                <div style={{
                                    background: msg.role === "assistant" ? "#0d0f18" : "#0f1118",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: msg.role === "assistant" ? "2px 12px 12px 12px" : "12px 2px 12px 12px",
                                    padding: "14px 18px", maxWidth: "68%",
                                }}>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Synthesizing loader */}
                        {isLoading && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                <AvatarIcon />
                                <div style={{ background: "#0d0f18", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px 12px 12px 12px", padding: "14px 18px" }}>
                                    <p style={{ fontSize: 13, color: "rgba(6,182,212,0.7)", margin: 0, fontStyle: "italic", letterSpacing: "0.02em" }}>
                                        Synthesizing architectural details…
                                    </p>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input bar */}
                    <div style={{ padding: "16px 24px 24px", flexShrink: 0 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "#0d0f18", borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.07)", padding: "0 6px 0 20px",
                            boxShadow: "0 0 0 1px rgba(6,182,212,0.0)",
                        }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                placeholder="Refine your vision..."
                                style={{
                                    flex: 1, height: 52, background: "transparent", border: "none", outline: "none",
                                    fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: "inherit",
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    width: 36, height: 36, borderRadius: 8, border: "none",
                                    background: input.trim() ? "linear-gradient(135deg,#0891b2,#06b6d4)" : "rgba(255,255,255,0.06)",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                    opacity: isLoading || !input.trim() ? 0.4 : 1,
                                    boxShadow: input.trim() ? "0 0 14px rgba(6,182,212,0.4)" : "none",
                                    transition: "all .2s",
                                }}
                            >
                                <Send style={{ width: 15, height: 15, color: "#fff" }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ════ COL 3 — IMAGE PROMPT GENERATOR ════ */}
                <div style={{
                    width: OUTPUT_W, flexShrink: 0,
                    background: "#05060a",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                }}>
                    {/* Panel header */}
                    <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px rgba(34,211,238,0.8)" }} />
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Image Prompt Generator</span>
                        </div>

                        {/* HUMAN / JSON tabs */}
                        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
                            {(["human", "json"] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: "8px 16px 10px", background: "none", border: "none", cursor: "pointer",
                                        fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                                        color: activeTab === tab ? "#22d3ee" : "rgba(255,255,255,0.3)",
                                        borderBottom: activeTab === tab ? "2px solid #22d3ee" : "2px solid transparent",
                                        marginBottom: -1, transition: "color .15s",
                                    }}
                                >{tab}</button>
                            ))}
                        </div>
                    </div>

                    {/* Content (scrollable) */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 18px" }}>

                        {/* Text/JSON output box */}
                        <div style={{
                            borderRadius: 8, background: "#0b0c14",
                            border: "1px solid rgba(255,255,255,0.06)",
                            padding: "16px", marginBottom: 14, minHeight: 140,
                        }}>
                            {activeTab === "human" ? (
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                                    {result?.text ?? defaultText}
                                </p>
                            ) : (
                                <JsonHighlight json={result?.json ?? defaultJson} />
                            )}
                        </div>

                        {/* Aspect Ratio + Platform pills */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                            {[
                                { label: "Aspect Ratio", value: "16:9" },
                                { label: "Platform", value: "Midjourney" },
                            ].map(pill => (
                                <div key={pill.label} style={{
                                    borderRadius: 8, background: "#0b0c14",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "12px 14px", textAlign: "center",
                                }}>
                                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", margin: "0 0 6px" }}>{pill.label}</p>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.75)", margin: 0 }}>{pill.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: "14px 18px 20px", flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 10 }}>

                        {/* COPY PROMPT */}
                        <button
                            onClick={handleCopy}
                            style={{
                                width: "100%", height: 42, borderRadius: 8,
                                background: "#0f1018", border: "1px solid rgba(255,255,255,0.08)",
                                cursor: "pointer", fontSize: 11, fontWeight: 700,
                                color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                transition: "border .15s",
                            }}
                        >
                            {copied ? <Check style={{ width: 13, height: 13, color: "#4ade80" }} /> : <Copy style={{ width: 13, height: 13 }} />}
                            {copied ? "Copied!" : "Copy Prompt"}
                        </button>

                        {/* SAVE + TEST AI */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <button
                                onClick={() => toast({ title: "Prompt saved!" })}
                                style={{
                                    height: 42, borderRadius: 8,
                                    background: "#0f1018", border: "1px solid rgba(255,255,255,0.08)",
                                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                                    color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", textTransform: "uppercase",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                }}
                            >
                                <Save style={{ width: 13, height: 13 }} /> Save
                            </button>
                            <button
                                onClick={() => toast({ title: "Opening AI tester…" })}
                                style={{
                                    height: 42, borderRadius: 8,
                                    background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
                                    cursor: "pointer", fontSize: 11, fontWeight: 700,
                                    color: "#22d3ee", letterSpacing: "0.12em", textTransform: "uppercase",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                    boxShadow: "0 0 16px rgba(6,182,212,0.1)",
                                }}
                            >
                                <FlaskConical style={{ width: 13, height: 13 }} /> Test AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
