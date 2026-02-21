import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    Megaphone, History, Layout, Copy, Download,
    Share2, Plus, Target, RefreshCw
} from "lucide-react";

/* ─── Suggestion chips ───────────────────────────────── */
const CHIPS = ["High-Converting UGC Script", "Luxury Product Showcase", "Limited Flash Sale Hook", "Problem-Solution Reel"];

/* ─── Default output data ────────────────────────────── */
const DEFAULT_PROMPT = `"Architect a high-impact Meta Ad for a premium vertical skincare brand. Visual: Cinematic macro of bottle texture vs. skin application. Hook: 'Your skin is 60% water, but it's thirstier than you think.' Body: Focus on the 72-hour hydration claim and clean ingredients. CTA: Shop 'The Hydration Drop' with 15% first-order discount. Tone: Authoritative, Minimalist, Luxury."`;

const DEFAULT_JSON = `{
  "id": "ad-7702-opt",
  "platform": "Meta / Instagram",
  "objective": "Conversion",
  "format": "9:16 Vertical",
  "hook_angle": "Educational / Thirst",
  "segments": [
    { "time": "0-3s", "content": "Visual hook: Deep ocean zoom to bottle" },
    { "time": "4-10s", "content": "Value prop: Molecular weight hydration" },
    { "time": "11-15s", "content": "Offer: First Order SAVE15" }
  ]
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
                    const valCol = isStr ? "#a78bfa" : (val.trim().startsWith("[") || val.trim().startsWith("{")) ? "rgba(255,255,255,0.3)" : "#f59e0b";
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

/* ─── Ad Agent Avatar ────────────────────────────────── */
function AdAgentAvatar({ size = 44 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
            background: "linear-gradient(135deg,#f43f5e,#e11d48)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(225,29,72,0.4)",
        }}>
            <Megaphone style={{ width: size * 0.45, height: size * 0.45, color: "#fff", fill: "#fff" }} />
        </div>
    );
}

/* ─── Animated pulse loader ──────────────────────────── */
function PulseLoader() {
    return (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#f43f5e",
                    animation: `pulse-ad 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
            <style>{`@keyframes pulse-ad{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function AdGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { chatHistory, isLoading, sendMessage } =
        usePromptWeaverChat({
            workflowType: "ad",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            id: `ad-${Math.floor(1000 + Math.random() * 8999)}-opt`,
                            platform: res.final?.platform ?? "Meta / Instagram",
                            objective: res.final?.objective ?? "Conversion",
                            format: res.final?.aspect_ratio ?? "9:16 Vertical",
                            hook_angle: res.final?.hook_style ?? "Direct / Problem-Solution",
                            segments: [
                                { time: "0-3s", content: res.final?.hook_copy ?? "Hook visual sequence" },
                                { time: "4-12s", content: "Main body value proposition" },
                                { time: "13-15s", content: `CTA: ${res.final?.cta ?? "Shop Now"}` }
                            ]
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
        toast({ title: "Ad script copied!" });
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

                {/* ════ LEFT PANEL — AD ARCHITECT ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#05060b",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}>
                    {/* Header section */}
                    <div style={{ padding: "34px 48px 0", flexShrink: 0 }}>
                        {/* PERFORMANCE V5.1 • CONVERSION */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 999, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.22)", marginBottom: 18 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#fb7185", textTransform: "uppercase" }}>Performance V5.1</span>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#f43f5e" }} />
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Conversion</span>
                        </div>

                        <h1 style={{ fontSize: 48, fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                            Ad Architect
                        </h1>
                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", maxWidth: 460, lineHeight: 1.65 }}>
                            Synthesizing high-converting ad concepts and prompt formulas for Meta, TikTok, and YouTube.
                        </p>

                        {/* History + Strategy buttons */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 34 }}>
                            {[
                                { icon: <History style={{ width: 14, height: 14 }} />, label: "Creative History" },
                                { icon: <Target style={{ width: 14, height: 14 }} />, label: "Strategy Matrix" },
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

                        {/* Welcome message */}
                        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                            <AdAgentAvatar size={44} />
                            <div style={{
                                flex: 1, borderRadius: "2px 16px 16px 16px",
                                background: "rgba(244,63,94,0.06)",
                                border: "1px solid rgba(244,63,94,0.18)",
                                padding: "18px 22px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e" }} />
                                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>Director Agent Online</span>
                                </div>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>
                                    I'm ready to architect your next high-performance campaign. Describe your product, target audience, and current objective. I'll engineer a response-optimized script and technical spec.
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

                        {/* History loop */}
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
                                        <AdAgentAvatar size={36} />
                                        <div style={{ flex: 1, borderRadius: "2px 16px 16px 16px", background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.14)", padding: "16px 20px" }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loader */}
                        {isLoading && (
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                <AdAgentAvatar size={36} />
                                <div style={{
                                    borderRadius: "4px 16px 16px 16px",
                                    background: "#0d0f17", border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
                                }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontStyle: "italic" }}>
                                        Architect is computing conversion anchors...
                                    </p>
                                    <PulseLoader />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* ── Input bar ── */}
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
                                placeholder="Evolve your ad's creative strategy..."
                                style={{
                                    flex: 1, height: 56, background: "transparent", border: "none", outline: "none",
                                    fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "inherit",
                                }}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "11px 22px", borderRadius: 10, border: "none",
                                    background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 800,
                                    color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase",
                                    opacity: isLoading || !input.trim() ? 0.4 : 1,
                                    boxShadow: "0 4px 20px rgba(225,29,72,0.3)",
                                    transition: "opacity .2s",
                                }}
                            >
                                Synthesize <Plus style={{ width: 14, height: 14 }} />
                            </button>
                        </div>

                        {/* Shortcuts */}
                        <div style={{ display: "flex", gap: 20, paddingTop: 12, paddingLeft: 6 }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>⌘ + ENTER TO SEND</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#fb7185", letterSpacing: "0.14em", fontWeight: 600 }}>
                                <RefreshCw style={{ width: 10, height: 10 }} /> MULTI-CHANNEL ADAPTATION ACTIVE
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
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.8)" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Output Synthesis</span>
                        </div>
                        <div style={{ padding: "4px 12px", borderRadius: 999, background: "#0d0f17", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                            Optimized
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                        {/* AD SCRIPT / PROMPT */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Refined Ad Script</span>
                                <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#fb7185", letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#fb7185", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Download style={{ width: 11, height: 11 }} /> Export
                                </button>
                            </div>
                            <div style={{ borderRadius: 12, background: "#0c0e16", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                                <JsonHighlight code={jsonText} />
                            </div>
                        </div>

                        {/* CAMPAIGN READY card */}
                        <div style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg,#310e16,#42111d,#20090e)",
                            border: "1px solid rgba(244,63,94,0.22)",
                            padding: "24px",
                            boxShadow: "0 8px 32px rgba(225,29,72,0.15)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 50, height: 50, borderRadius: 14,
                                    background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 0 20px rgba(225,29,72,0.4)",
                                }}>
                                    <Megaphone style={{ width: 22, height: 22, color: "#fff", fill: "#fff" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "0.02em" }}>Campaign Ready</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#fb7185", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Verified Performance Assets</p>
                                </div>
                            </div>

                            {/* ACTION: SYNC TO ADS MANAGER */}
                            <button style={{
                                width: "100%", height: 50, borderRadius: 12, border: "none",
                                background: "#fff", cursor: "pointer",
                                fontSize: 13, fontWeight: 800, color: "#18181b",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                marginBottom: 12,
                            }}>
                                <Layout style={{ width: 15, height: 15 }} />
                                Sync to Ads Manager
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
