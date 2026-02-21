import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    Zap, History, Settings, Copy, Download,
    Share2, Plus, Code
} from "lucide-react";

/* ─── Suggestion chips ───────────────────────────────── */
const CHIPS = ["Modern SaaS Platform", "Luxury Brand Editorial", "Web3 Dashboard Concept"];

/* ─── Default output data ────────────────────────────── */
const DEFAULT_PROMPT = `"Architect a high-end luxury skincare landing page. Visual hierarchy based on 'Cormorant Garamond' serifs. Color story: Alabaster (#FDFBF7), Onyx (#1A1A1A), and muted Sage (#9AA897). Components: Full-bleed cinematic hero, interactive product carousel, clinical efficacy grid, and split-layout editorial sections."`;

const DEFAULT_JSON = `{
  "id": "arch-0922",
  "style": "luxury-editorial",
  "typography": {
    "heading": "Cormorant",
    "body": "Inter"
  },
  "grid": "golden-ratio",
  "tokens": [0.85, 1.2, 0.4]
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
                    const isNum = /^[\d.[\]]+/.test(val.trim());
                    const valCol = isStr ? "#c084fc" : isNum ? "#fbbf24" : "rgba(255,255,255,0.3)";
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

/* ─── Sparkle / agent avatar ─────────────────────────── */
function SparkleAvatar({ size = 44 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.32, flexShrink: 0,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(109,40,217,0.5)",
            fontSize: size * 0.45,
        }}>
            ✦
        </div>
    );
}

/* ─── Animated dots ──────────────────────────────────── */
function DotLoader() {
    return (
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "rgba(255,255,255,0.4)",
                    animation: `wdot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: "inline-block",
                }} />
            ))}
            <style>{`@keyframes wdot{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
        </span>
    );
}

/* ─── User avatar ────────────────────────────────────── */
function UserAvatar() {
    return (
        <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "#1e2133", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function WebsiteGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { chatHistory, isLoading, sendMessage } =
        usePromptWeaverChat({
            workflowType: "website",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: `"${res.prompt_package.prompt}"`,
                        json: JSON.stringify({
                            id: `arch-${Math.floor(1000 + Math.random() * 8999)}`,
                            style: res.final?.style ?? "modern-saas",
                            typography: { heading: "Cormorant", body: "Inter" },
                            grid: "golden-ratio",
                            tokens: [0.85, 1.2, 0.4],
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
        toast({ title: "Prompt copied!" });
    };

    const promptText = result?.text ?? DEFAULT_PROMPT;
    const jsonText = result?.json ?? DEFAULT_JSON;

    return (
        <div style={{
            height: "100vh", background: "#080a10",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
        }}>
            <Navbar />

            {/* ── Two-column body ── */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 400px", overflow: "hidden" }}>

                {/* ════ LEFT PANEL ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#080a10",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}>
                    {/* ── Hero header ── */}
                    <div style={{ padding: "32px 44px 0", flexShrink: 0 }}>
                        {/* ENGINE V2.4 • ENTERPRISE */}
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#22d3ee", textTransform: "uppercase", margin: "0 0 14px" }}>
                            Engine V2.4 <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span> Enterprise
                        </p>

                        <h1 style={{ fontSize: 44, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-1.2px", lineHeight: 1.08 }}>
                            Website Architect
                        </h1>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", margin: "0 0 26px", maxWidth: 420, lineHeight: 1.65 }}>
                            Synthesizing high-fidelity web structures with multi-modal neural generation.
                        </p>

                        {/* History + Parameters buttons */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                            {[
                                { icon: <History style={{ width: 14, height: 14 }} />, label: "History" },
                                { icon: <Settings style={{ width: 14, height: 14 }} />, label: "Parameters" },
                            ].map(btn => (
                                <button key={btn.label} style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "9px 18px", borderRadius: 9,
                                    background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)",
                                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                                    color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em",
                                }}>
                                    {btn.icon} {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Chat messages ── */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 44px" }}>

                        {/* SYNTHESIS AGENT card */}
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 22 }}>
                            <SparkleAvatar size={44} />
                            <div style={{
                                flex: 1, borderRadius: "2px 14px 14px 14px",
                                background: "rgba(79,70,229,0.08)",
                                border: "1px solid rgba(99,102,241,0.18)",
                                padding: "16px 20px",
                            }}>
                                {/* ● Architect Initialized */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Architect Initialized</span>
                                </div>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>
                                    I'm prepared to architect your next digital experience. Describe your vision, brand essence, and functional requirements. I'll provide a refined prompt and a technical schema for immediate deployment.
                                </p>
                            </div>
                        </div>

                        {/* Suggestion chips */}
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 24 }}>
                                {CHIPS.map(chip => (
                                    <button
                                        key={chip}
                                        onClick={() => handleSend(chip)}
                                        style={{
                                            padding: "8px 16px", borderRadius: 999,
                                            background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                                            color: "rgba(255,255,255,0.5)", transition: "border .15s",
                                        }}
                                    >{chip}</button>
                                ))}
                            </div>
                        )}

                        {/* Dynamic chat messages */}
                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ marginBottom: 20 }}>
                                {msg.role === "user" ? (
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                        <div style={{
                                            flex: 1, borderRadius: "14px 14px 14px 2px",
                                            background: "#0f1118", border: "1px solid rgba(255,255,255,0.06)",
                                            padding: "15px 18px",
                                        }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", margin: 0, lineHeight: 1.65 }}>{msg.content}</p>
                                        </div>
                                        <UserAvatar />
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                        <SparkleAvatar size={36} />
                                        <div style={{ flex: 1, borderRadius: "2px 14px 14px 14px", background: "rgba(79,70,229,0.08)", border: "1px solid rgba(99,102,241,0.15)", padding: "15px 18px" }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", margin: 0, lineHeight: 1.7 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Synthesizing loader */}
                        {isLoading && (
                            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
                                <SparkleAvatar size={36} />
                                <div style={{
                                    borderRadius: "4px 14px 14px 14px",
                                    background: "#0f1118", border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "13px 18px", display: "flex", alignItems: "center", gap: 14,
                                }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", margin: 0, fontStyle: "italic" }}>
                                        Architect is synthesizing aesthetic parameters...
                                    </p>
                                    <DotLoader />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* ── Bottom input ── */}
                    <div style={{ flexShrink: 0, padding: "14px 44px 10px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: "#0d0e18", borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.08)", padding: "0 12px 0 20px",
                        }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                placeholder="Refine your architect's vision..."
                                style={{
                                    flex: 1, height: 54, background: "transparent", border: "none", outline: "none",
                                    fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "inherit",
                                }}
                            />
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: "6px" }}>
                                <Plus style={{ width: 18, height: 18 }} />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    display: "flex", alignItems: "center", gap: 7,
                                    padding: "10px 20px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.2)",
                                    background: "rgba(255,255,255,0.06)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 700,
                                    color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em",
                                    opacity: isLoading || !input.trim() ? 0.4 : 1,
                                    transition: "opacity .2s",
                                }}
                            >
                                Generate <Zap style={{ width: 14, height: 14, color: "#fbbf24", fill: "#fbbf24" }} />
                            </button>
                        </div>

                        {/* Footer hints */}
                        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "10px 4px 6px" }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>⌘ + ENTER TO SEND</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#818cf8", letterSpacing: "0.12em", fontWeight: 600 }}>
                                <Zap style={{ width: 10, height: 10, fill: "#818cf8", color: "#818cf8" }} />
                                ULTRA-HIGH FIDELITY MODE
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════ RIGHT PANEL — OUTPUT SYNTHESIS ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#070810", overflow: "hidden",
                }}>
                    {/* Panel header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 26px 18px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Output Synthesis</span>
                        </div>
                        <div style={{ padding: "4px 12px", borderRadius: 999, background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                            Ready
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>

                        {/* ── REFINED HUMAN PROMPT ── */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Refined Human Prompt</span>
                                <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                    <Copy style={{ width: 11, height: 11 }} /> {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            {/* Quote card */}
                            <div style={{ borderRadius: 12, background: "#0c0e1a", border: "1px solid rgba(255,255,255,0.06)", padding: "18px", marginBottom: 12 }}>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", margin: 0, lineHeight: 1.75, fontStyle: "italic" }}>
                                    {promptText}
                                </p>
                            </div>

                            {/* Optimized for line */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee" }} />
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em" }}>
                                    Optimized for Framer AI, Midjourney v6 &amp; Webflow.
                                </span>
                            </div>
                        </div>

                        {/* ── TECHNICAL SCHEMA (JSON) ── */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Technical Schema (JSON)</span>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(jsonText); toast({ title: "JSON exported!" }); }}
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Code style={{ width: 11, height: 11 }} /> Export
                                </button>
                            </div>
                            <div style={{ borderRadius: 12, background: "#0c0e1a", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                                <JsonHighlight code={jsonText} />
                            </div>
                        </div>

                        {/* ── PROJECT READY card ── */}
                        <div style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg,#1a1a32,#1e1540,#131028)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            padding: "22px",
                            boxShadow: "0 8px 32px rgba(60,40,180,0.18)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                                <div style={{
                                    width: 46, height: 46, borderRadius: "50%",
                                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 0 20px rgba(99,60,220,0.5)",
                                    fontSize: 18,
                                }}>✦</div>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 3px" }}>Project Ready</p>
                                    <p style={{ fontSize: 11, color: "#22d3ee", fontWeight: 600, margin: 0 }}>Deployment assets synthesized.</p>
                                </div>
                            </div>

                            {/* Launch in Framer */}
                            <button style={{
                                width: "100%", height: 48, borderRadius: 11, border: "none",
                                background: "#fff", cursor: "pointer",
                                fontSize: 13, fontWeight: 800, color: "#18181b",
                                letterSpacing: "0.06em",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                marginBottom: 10,
                            }}>
                                <Zap style={{ width: 14, height: 14, color: "#7c3aed", fill: "#7c3aed" }} />
                                Launch in Framer
                            </button>

                            {/* Assets + Share */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                                {[
                                    { label: "Assets", icon: <Download style={{ width: 12, height: 12 }} /> },
                                    { label: "Share", icon: <Share2 style={{ width: 12, height: 12 }} /> },
                                ].map(btn => (
                                    <button key={btn.label} style={{
                                        height: 40, borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
                                        background: "rgba(255,255,255,0.04)", cursor: "pointer",
                                        fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)",
                                        letterSpacing: "0.12em", textTransform: "uppercase",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
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
