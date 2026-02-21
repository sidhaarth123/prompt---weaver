import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    PenLine, History, FileText, Copy, Download,
    Share2, Plus, Zap, Type, RefreshCcw
} from "lucide-react";

/* ─── Suggestion chips ───────────────────────────────── */
const CHIPS = ["Thought Leadership Blog", "SEO Optimized Article", "Persuasive Sales Email", "Viral Social Thread"];

/* ─── Default output data ────────────────────────────── */
const DEFAULT_PROMPT = `"Architect a comprehensive 1,500-word blog post on 'The Future of AI-Driven Commerce'. Narrative arc: From algorithmic recommendation to autonomous negotiation. Tone: Sophisticated, Forward-thinking, Analytical. Structure: Executive summary, 4 core pillars of transformation, and a final synthesis on human-AI collaboration. Style: The Economist meets Wired."`;

const DEFAULT_JSON = `{
  "id": "cnt-4403-opt",
  "type": "Thought Leadership",
  "word_count": 1500,
  "tone_map": {
    "analytical": 0.8,
    "engaging": 0.7,
    "visionary": 0.9
  },
  "keywords": ["autonomous commerce", "neural retail", "UX", "future-tech"]
}`;

/* ─── JSON syntax highlighter ────────────────────────── */
function JsonHighlight({ code }: { code: string }) {
    return (
        <pre style={{ margin: 0, fontFamily: "'Fira Code','Courier New',monospace", fontSize: 12, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {code.split("\n").map((line, i) => {
                const km = line.match(/^(\s*)"([^"]+)"(\s*:\s*)(.*)/);
                if (km) {
                    const [, indent, key, colon, val] = km;
                    const isStr = val.startsWith('"');
                    const isNum = /^[\d.[\]{}:,]+/.test(val.trim());
                    const valCol = isStr ? "#a78bfa" : (val.trim().startsWith("[") || val.trim().startsWith("{")) ? "rgba(255,255,255,0.3)" : "#60a5fa";
                    return (
                        <span key={i}>
                            {indent}
                            <span style={{ color: "#22d3ee" }}>"{key}"</span>
                            <span style={{ color: "rgba(255,255,255,0.3)" }}>{colon}</span>
                            <span style={{ color: valCol }}>{val}</span>{"\n"}
                        </span>
                    );
                }
                return <span key={i} style={{ color: "rgba(255,255,255,0.3)" }}>{line}{"\n"}</span>;
            })}
        </pre>
    );
}

/* ─── Content Agent Avatar ───────────────────────────── */
function ContentAgentAvatar({ size = 44 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.35, flexShrink: 0,
            background: "linear-gradient(135deg,#2563eb,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.35)",
        }}>
            <PenLine style={{ width: size * 0.45, height: size * 0.45, color: "#fff" }} />
        </div>
    );
}

/* ─── Animated flow loader ───────────────────────────── */
function FlowLoader() {
    return (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    width: 2, height: 12, borderRadius: 1,
                    background: "#3b82f6",
                    animation: `flow-bar 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
            <style>{`@keyframes flow-bar{0%,100%{height:4px;opacity:.3}50%{height:14px;opacity:1}}`}</style>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function ContentWritingGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { chatHistory, isLoading, sendMessage } =
        usePromptWeaverChat({
            workflowType: "content",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            id: `cnt-${Math.floor(1000 + Math.random() * 8999)}-opt`,
                            type: "Dynamic Article",
                            tone_map: { analytical: 0.8, engaging: 0.7, visionary: 0.9 },
                            word_target: 1200,
                            structure: ["Hook", "Context", "Pillars", "Conclusion"]
                        }, null, 2),
                    });
                }
            },
        });

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isLoading]);

    const handleSend = (msg?: string) => {
        const text = msg ?? input.trim();
        if (!text || isLoading) return;
        sendMessage(text);
        setInput("");
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result?.text ?? DEFAULT_PROMPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Content prompt copied!" });
    };

    const promptText = result?.text ?? DEFAULT_PROMPT;
    const jsonText = result?.json ?? DEFAULT_JSON;

    return (
        <div style={{
            height: "100vh", background: "#05060b",
            display: "flex", flexDirection: "column",
            overflow: "hidden", paddingTop: 80,
            fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
        }}>
            <Navbar />

            {/* ── Two-column body ── */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 420px", overflow: "hidden" }}>

                {/* ════ LEFT PANEL — CONTENT ARCHITECT ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#05060b",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{ padding: "34px 48px 0", flexShrink: 0 }}>
                        {/* LEXICON V4.0 • SEMANTIC OPTIMIZED */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 999, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.22)", marginBottom: 18 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#60a5fa", textTransform: "uppercase" }}>Lexicon V4.0</span>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3b82f6" }} />
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Semantic Optimized</span>
                        </div>

                        <h1 style={{ fontSize: 48, fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                            Content Architect
                        </h1>
                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", maxWidth: 440, lineHeight: 1.65 }}>
                            Engineering high-fidelity narratives, thought leadership, and persuasive copy with neural linguistic composition.
                        </p>

                        {/* History + Presets buttons */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 34 }}>
                            {[
                                { icon: <History style={{ width: 14, height: 14 }} />, label: "Writing History" },
                                { icon: <Type style={{ width: 14, height: 14 }} />, label: "Style Presets" },
                            ].map(btn => (
                                <button key={btn.label} style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 22px", borderRadius: 10,
                                    background: "#0d0f17", border: "1px solid rgba(255,255,255,0.08)",
                                    cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                    color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em",
                                }}>
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Chat Messages ── */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 48px" }}>

                        {/* Welcome Agent */}
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                            <ContentAgentAvatar size={44} />
                            <div style={{
                                flex: 1, borderRadius: "2px 16px 16px 16px",
                                background: "rgba(59,130,246,0.06)",
                                border: "1px solid rgba(59,130,246,0.18)",
                                padding: "18px 22px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>Editorial Agent Initialized</span>
                                </div>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>
                                    I'm prepared to architect your next narrative experiment. Describe the topic, target persona, and required tone. I'll provide a composited prompt and a technical structural schema.
                                </p>
                            </div>
                        </div>

                        {/* Chips */}
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                                {CHIPS.map(chip => (
                                    <button
                                        key={chip}
                                        onClick={() => handleSend(chip)}
                                        style={{
                                            padding: "8px 18px", borderRadius: 999,
                                            background: "#0d0f17", border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer", fontSize: 13, fontWeight: 500,
                                            color: "rgba(255,255,255,0.45)", transition: "all .15s",
                                        }}
                                    >{chip}</button>
                                ))}
                            </div>
                        )}

                        {/* Chat History */}
                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ marginBottom: 22 }}>
                                {msg.role === "user" ? (
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "flex-end" }}>
                                        <div style={{
                                            flex: 1, maxWidth: "70%", borderRadius: "16px 16px 2px 16px",
                                            background: "#0d0f17", border: "1px solid rgba(255,255,255,0.06)",
                                            padding: "15px 20px",
                                        }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.65 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                        <ContentAgentAvatar size={36} />
                                        <div style={{ flex: 1, borderRadius: "2px 16px 16px 16px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.14)", padding: "16px 20px" }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loader */}
                        {isLoading && (
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                <ContentAgentAvatar size={36} />
                                <div style={{
                                    borderRadius: "4px 16px 16px 16px",
                                    background: "#0d0f17", border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
                                }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontStyle: "italic" }}>
                                        Architect is mapping semantic clusters...
                                    </p>
                                    <FlowLoader />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: "16px 48px 24px", flexShrink: 0 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "#0d0e18", borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)", padding: "0 10px 0 20px",
                        }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                placeholder="Evolve your content strategy..."
                                style={{
                                    flex: 1, height: 56, background: "transparent", border: "none", outline: "none",
                                    fontSize: 14.5, color: "rgba(255,255,255,0.5)", fontFamily: "inherit",
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "11px 22px", borderRadius: 10, border: "none",
                                    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 800,
                                    color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase",
                                    opacity: isLoading || !input.trim() ? 0.4 : 1,
                                    boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                                    transition: "opacity .2s",
                                }}
                            >
                                Synthesize <Plus style={{ width: 14, height: 14 }} />
                            </button>
                        </div>

                        {/* Shortcuts */}
                        <div style={{ display: "flex", gap: 20, paddingTop: 12, paddingLeft: 6 }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>⌘ + ENTER TO SEND</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#60a5fa", letterSpacing: "0.14em", fontWeight: 600 }}>
                                <RefreshCcw style={{ width: 10, height: 10 }} /> NEURAL STYLE-TRANSFER ACTIVE
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════ RIGHT PANEL — OUTPUT ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#05060b", overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 28px 20px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px rgba(96,165,250,0.8)" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Output Synthesis</span>
                        </div>
                        <div style={{ padding: "4px 12px", borderRadius: 999, background: "#0d0f17", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                            Ready
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                        {/* CONTENT PROMPT */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Refined Human Prompt</span>
                                <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                    <Copy style={{ width: 11, height: 11 }} /> {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <div style={{ borderRadius: 12, background: "#0c0e16", border: "1px solid rgba(255,255,255,0.06)", padding: "18px" }}>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.75, fontStyle: "italic" }}>
                                    {promptText}
                                </p>
                            </div>
                        </div>

                        {/* TECHNICAL SCHEMA */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Technical Schema (JSON)</span>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(jsonText); toast({ title: "JSON Exported!" }); }}
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Download style={{ width: 11, height: 11 }} /> Export
                                </button>
                            </div>
                            <div style={{ borderRadius: 12, background: "#0c0e16", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                                <JsonHighlight code={jsonText} />
                            </div>
                        </div>

                        {/* MANUSCRIPT READY card */}
                        <div style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg,#0e1e3b,#112a52,#09162e)",
                            border: "1px solid rgba(59,130,246,0.25)",
                            padding: "24px",
                            boxShadow: "0 8px 32px rgba(59,130,246,0.15)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 50, height: 50, borderRadius: 14,
                                    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 0 20px rgba(59,130,246,0.4)",
                                }}>
                                    <FileText style={{ width: 22, height: 22, color: "#fff" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "0.02em" }}>Manuscript Ready</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Verified Semantic Assets</p>
                                </div>
                            </div>

                            {/* ACTION: OPEN IN EDITOR */}
                            <button style={{
                                width: "100%", height: 50, borderRadius: 12, border: "none",
                                background: "#fff", cursor: "pointer",
                                fontSize: 13, fontWeight: 800, color: "#18181b",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                marginBottom: 12,
                            }}>
                                <Zap style={{ width: 15, height: 15, fill: "#000" }} />
                                Deep-Draft Integration
                            </button>

                            {/* ASSETS + SHARE */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { label: "Assets", icon: <Download style={{ width: 13, height: 13 }} /> },
                                    { label: "Share", icon: <Share2 style={{ width: 13, height: 13 }} /> },
                                ].map(btn => (
                                    <button key={btn.label} style={{
                                        height: 42, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
                                        background: "rgba(255,255,255,0.05)", cursor: "pointer",
                                        fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)",
                                        letterSpacing: "0.14em", textTransform: "uppercase",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                    }}>
                                        {btn.icon} {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
