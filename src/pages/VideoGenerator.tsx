import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    Zap, Send, Copy, History, SlidersHorizontal,
    Cpu, Paperclip, Play, Download, Share2, Plus
} from "lucide-react";

/* ─── Suggestion chips ───────────────────────────────── */
const CHIPS = ["Cyberpunk Night Market", "Slow Motion Liquid Gold", "Aerial Arctic Exploration"];

/* ─── JSON output ────────────────────────────────────── */
const DEFAULT_JSON = `{
  "id": "synth-9902-opt",
  "engine": "sora-v1",
  "params": {
    "motion": 0.75,
    "fluidity": 0.92,
    "fidelity": 1.0
  },
  "composition": "macro-eye",
  "seed": 88190223
}`;

const DEFAULT_PROMPT = `"Ultra-detailed cinematic close-up of a cybernetic eye, macro photography. Iris shows intricate shifting mechanical plates in metallic gold and obsidian. Pupil reflects a high-contrast futuristic cityscape with orange neon flares and rainy atmosphere. Volumetric lighting, 24fps, high motion blur, shot on Arri Alexa, masterwork quality."`;

/* ─── JSON syntax highlighter ────────────────────────── */
function JsonHighlight({ code }: { code: string }) {
    return (
        <pre style={{ margin: 0, fontFamily: "'Fira Code','Courier New',monospace", fontSize: 12, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {code.split("\n").map((line, i) => {
                const km = line.match(/^(\s*)"([^"]+)"(\s*:\s*)(.*)/);
                if (km) {
                    const [, indent, key, colon, val] = km;
                    const isString = val.startsWith('"');
                    const isNum = /^[\d.]+/.test(val.trim());
                    const valCol = isString ? "#c084fc" : isNum ? "#fbbf24" : "rgba(255,255,255,0.35)";
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

/* ─── Brand avatar (purple) ──────────────────────────── */
function AgentAvatar({ size = 44 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(109,40,217,0.5)",
        }}>
            <Zap style={{ width: size * 0.4, height: size * 0.4, color: "#fff", fill: "#fff" }} />
        </div>
    );
}

/* ─── Animated dots loader ───────────────────────────── */
function DotLoader() {
    return (
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#22d3ee",
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: "inline-block",
                }} />
            ))}
            <style>{`@keyframes pulse-dot{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
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
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function VideoGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { chatHistory, isLoading, sendMessage } =
        usePromptWeaverChat({
            workflowType: "video",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: `"${res.prompt_package.prompt}"`,
                        json: JSON.stringify({
                            id: `synth-${Math.floor(1000 + Math.random() * 9000)}-opt`,
                            engine: res.final?.platform === "runway" ? "runway-v3" : "sora-v1",
                            params: { motion: 0.75, fluidity: 0.92, fidelity: 1.0 },
                            composition: "cinematic",
                            seed: Math.floor(10000000 + Math.random() * 89999999),
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
            overflow: "hidden", paddingTop: 80,
            fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
        }}>
            <Navbar />

            {/* ── Two-column body ── */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 420px", overflow: "hidden" }}>

                {/* ════ LEFT PANEL ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#080a10",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}>
                    {/* ── Hero header ── */}
                    <div style={{ padding: "36px 48px 0", flexShrink: 0 }}>
                        {/* Badge */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 999, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", marginBottom: 20 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#22d3ee", textTransform: "uppercase" }}>Neural Core V4.0</span>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }} />
                        </div>

                        <h1 style={{ fontSize: 52, fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                            Video Architect
                        </h1>
                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 28px", maxWidth: 440, lineHeight: 1.6 }}>
                            Design cinematic sequences with hyper-precise prompt engineering for Sora, Runway, and Pika.
                        </p>

                        {/* HISTORY + ADVANCED buttons */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
                            {[
                                { icon: <History style={{ width: 15, height: 15 }} />, label: "History" },
                                { icon: <SlidersHorizontal style={{ width: 15, height: 15 }} />, label: "Advanced" },
                            ].map(btn => (
                                <button key={btn.label} style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 20px", borderRadius: 10,
                                    background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                                    color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em",
                                }}>
                                    {btn.icon} {btn.label.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Chat messages ── */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 48px" }}>

                        {/* SYNTHESIS AGENT welcome card */}
                        <div style={{
                            display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28,
                        }}>
                            <AgentAvatar size={44} />
                            <div style={{
                                flex: 1, borderRadius: "2px 16px 16px 16px",
                                background: "rgba(79,70,229,0.08)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                padding: "18px 22px",
                            }}>
                                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#818cf8", textTransform: "uppercase", margin: "0 0 10px" }}>
                                    Synthesis Agent
                                </p>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.7 }}>
                                    Welcome, Creator. I'm ready to architect your cinematic vision. Define your shot composition, lighting physics, and atmospheric details. What are we visualizing today?
                                </p>
                            </div>
                        </div>

                        {/* Suggestion chips */}
                        {chatHistory.length === 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                                {CHIPS.map(chip => (
                                    <button
                                        key={chip}
                                        onClick={() => handleSend(chip)}
                                        style={{
                                            padding: "9px 18px", borderRadius: 999,
                                            background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer", fontSize: 13, fontWeight: 500,
                                            color: "rgba(255,255,255,0.55)", transition: "border .15s",
                                        }}
                                    >{chip}</button>
                                ))}
                            </div>
                        )}

                        {/* Dynamic chat */}
                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ marginBottom: 22 }}>
                                {msg.role === "user" ? (
                                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                        <div style={{
                                            flex: 1, borderRadius: "16px 16px 16px 2px",
                                            background: "#0f1118", border: "1px solid rgba(255,255,255,0.06)",
                                            padding: "16px 20px",
                                        }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.65 }}>{msg.content}</p>
                                        </div>
                                        <UserAvatar />
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                                        <AgentAvatar size={36} />
                                        <div style={{ flex: 1, borderRadius: "2px 16px 16px 16px", background: "rgba(79,70,229,0.08)", border: "1px solid rgba(99,102,241,0.15)", padding: "16px 20px" }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.7 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Encoding loader */}
                        {isLoading && (
                            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 22 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                    background: "rgba(109,40,217,0.2)", border: "1px solid rgba(139,92,246,0.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Cpu style={{ width: 16, height: 16, color: "#a78bfa" }} />
                                </div>
                                <div style={{ borderRadius: "4px 16px 16px 16px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontStyle: "italic" }}>
                                        Encoding cinematic parameters & optical physics...
                                    </p>
                                    <DotLoader />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* ── Bottom input ── */}
                    <div style={{ flexShrink: 0, padding: "16px 48px 10px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "#0d0e18", borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)", padding: "0 16px",
                            boxShadow: "0 0 0 0 rgba(109,40,217,0)",
                        }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                                placeholder="Evolve your cinematic vision..."
                                style={{
                                    flex: 1, height: 58, background: "transparent", border: "none", outline: "none",
                                    fontSize: 15, color: "rgba(255,255,255,0.55)", fontFamily: "inherit",
                                }}
                            />
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: 0 }}>
                                <Paperclip style={{ width: 18, height: 18 }} />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "11px 22px", borderRadius: 10, border: "none",
                                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 800,
                                    color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase",
                                    opacity: isLoading || !input.trim() ? 0.5 : 1,
                                    boxShadow: "0 4px 20px rgba(99,60,220,0.45)",
                                    transition: "opacity .2s",
                                }}
                            >
                                Synthesize <Plus style={{ width: 15, height: 15 }} />
                            </button>
                        </div>

                        {/* Footer hints */}
                        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px 4px", marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>⌘ + ←</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#22d3ee", letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#22d3ee" }} />
                                4K Lossless Generation
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 28px 20px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Output Synthesis</span>
                        </div>
                        <div style={{ padding: "5px 12px", borderRadius: 999, background: "#0f1118", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                            Ready For Render
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                        {/* ── REFINED VIDEO PROMPT ── */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Refined Video Prompt</span>
                                <button
                                    onClick={handleCopy}
                                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Copy style={{ width: 12, height: 12 }} />
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <div style={{ borderRadius: 12, background: "#0c0e1a", border: "1px solid rgba(255,255,255,0.06)", padding: "20px", marginBottom: 14 }}>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.75, fontStyle: "italic" }}>
                                    {promptText}
                                </p>
                            </div>

                            {/* S R P platform chips + validated label */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {["S", "R", "P"].map((l, i) => (
                                    <div key={l} style={{
                                        width: 26, height: 26, borderRadius: "50%",
                                        background: ["#1e40af", "#7c3aed", "#0f766e"][i],
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 10, fontWeight: 700, color: "#fff",
                                    }}>{l}</div>
                                ))}
                                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                                    Validated for Sora, Runway &amp; Pika
                                </span>
                            </div>
                        </div>

                        {/* ── TECHNICAL SCHEMA (JSON) ── */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Technical Schema (JSON)</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(jsonText);
                                        toast({ title: "JSON exported!" });
                                    }}
                                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#818cf8", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Download style={{ width: 12, height: 12 }} /> Export
                                </button>
                            </div>

                            <div style={{ position: "relative", borderRadius: 12, background: "#0c0e1a", border: "1px solid rgba(255,255,255,0.06)", padding: "18px 18px 14px" }}>
                                <div style={{ position: "absolute", top: 12, right: 14, fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>V4.2-350K</div>
                                <JsonHighlight code={jsonText} />
                            </div>
                        </div>

                        {/* ── PROJECT READY card ── */}
                        <div style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg,#1e1b4b,#2d1952,#1a1040)",
                            border: "1px solid rgba(139,92,246,0.25)",
                            padding: "24px",
                            boxShadow: "0 8px 32px rgba(79,40,200,0.2)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 0 24px rgba(109,40,217,0.5)",
                                }}>
                                    <Zap style={{ width: 22, height: 22, color: "#fff", fill: "#fff" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "0.02em" }}>Project Ready</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Ready for High-Fidelity Export</p>
                                </div>
                            </div>

                            {/* LAUNCH IN VIDEO AI — large */}
                            <button style={{
                                width: "100%", height: 50, borderRadius: 12, border: "none",
                                background: "#fff", cursor: "pointer",
                                fontSize: 13, fontWeight: 800, color: "#18181b",
                                letterSpacing: "0.12em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                marginBottom: 12,
                            }}>
                                <Play style={{ width: 15, height: 15, fill: "#18181b" }} />
                                Launch in Video AI
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
                                        fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.55)",
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
