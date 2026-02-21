import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { toast } from "@/hooks/use-toast";
import {
    Code2, History, Terminal, Copy, Download,
    Share2, Plus, Zap, Cpu, RefreshCw
} from "lucide-react";

/* ─── Suggestion chips ───────────────────────────────── */
const CHIPS = ["React Authentication Logic", "Python Data Aggregator", "Node.js Microservice", "Rust Performance Hook"];

/* ─── Default output data ────────────────────────────── */
const DEFAULT_PROMPT = `"Architect a robust React component for an enterprise-level data dashboard. Features: Real-time WebSocket integration, memoized state management using signals or Context API, and Virtualized List rendering for 10k+ rows. Styling: Tailwind CSS with a focus on accessibility (ARIA-compliant). Error handling: Robust boundary isolation and fallback UI."`;

const DEFAULT_JSON = `{
  "id": "cod-9904-opt",
  "language": "TypeScript / React",
  "complexity": "Enterprise",
  "patterns": ["Observer", "Strategy", "Factory"],
  "optimizations": [
    { "target": "Render Cycle", "method": "React.memo" },
    { "target": "Data Fetch", "method": "SWR / TanStack Query" }
  ],
  "dependencies": ["lucide-react", "framer-motion", "zod"]
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
                    const valCol = isStr ? "#a78bfa" : (val.trim().startsWith("[") || val.trim().startsWith("{")) ? "rgba(255,255,255,0.3)" : "#a855f7";
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

/* ─── Coding Agent Avatar ────────────────────────────── */
function CodingAgentAvatar({ size = 44 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
            background: "linear-gradient(135deg,#7c3aed,#9333ea)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(124,58,237,0.35)",
        }}>
            <Code2 style={{ width: size * 0.45, height: size * 0.45, color: "#fff" }} />
        </div>
    );
}

/* ─── Animated matrix loader ─────────────────────────── */
function MatrixLoader() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 4px)", gap: 3 }}>
            {[...Array(9)].map((_, i) => (
                <div key={i} style={{
                    width: 4, height: 4, borderRadius: 1,
                    background: "#a855f7",
                    animation: `matrix-drop 1.4s infinite ease-in-out ${i * 0.15}s`,
                }} />
            ))}
            <style>{`@keyframes matrix-drop{0%,100%{opacity:0;transform:translateY(-2px)}50%{opacity:1;transform:translateY(2px)}}`}</style>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function CodingAssistantGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { chatHistory, isLoading, sendMessage } =
        usePromptWeaverChat({
            workflowType: "coding",
            onDataReceived: (res) => {
                if (res.prompt_package) {
                    setResult({
                        text: res.prompt_package.prompt,
                        json: JSON.stringify({
                            id: `cod-${Math.floor(1000 + Math.random() * 8999)}-opt`,
                            language: res.final?.language ?? "TypeScript",
                            framework: res.final?.framework ?? "Next.js",
                            complexity: "Advanced",
                            patterns: ["Factory", "Dependency Injection"],
                            optimizations: [
                                { target: "State", method: "Redux / Zustand" }
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
        toast({ title: "Coding prompt copied!" });
    };

    const promptText = result?.text ?? DEFAULT_PROMPT;
    const jsonText = result?.json ?? DEFAULT_JSON;

    return (
        <div style={{
            height: "100vh", background: "#06070a",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Inter','SF Pro',system-ui,sans-serif",
        }}>
            <Navbar />

            {/* ── Two-column body ── */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 420px", overflow: "hidden" }}>

                {/* ════ LEFT PANEL — CODING ARCHITECT ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#06070a",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{ padding: "34px 48px 0", flexShrink: 0 }}>
                        {/* KERNEL V2.5 • LOW LATENCY */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 999, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.22)", marginBottom: 18 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#a855f7", textTransform: "uppercase" }}>Kernel V2.5</span>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#7c3aed" }} />
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Low Latency</span>
                        </div>

                        <h1 style={{ fontSize: 48, fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                            Coding Architect
                        </h1>
                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", maxWidth: 440, lineHeight: 1.65 }}>
                            Precision-synthesizing architectural prompts, microservices, and logic patterns with enterprise neural optimization.
                        </p>

                        {/* History + Terminal buttons */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 34 }}>
                            {[
                                { icon: <History style={{ width: 14, height: 14 }} />, label: "Commit History" },
                                { icon: <Terminal style={{ width: 14, height: 14 }} />, label: "Logic Matrix" },
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
                            <CodingAgentAvatar size={44} />
                            <div style={{
                                flex: 1, borderRadius: "2px 16px 16px 16px",
                                background: "rgba(124,58,237,0.06)",
                                border: "1px solid rgba(124,58,237,0.18)",
                                padding: "18px 22px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
                                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>Compiler Agent Initialized</span>
                                </div>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>
                                    I'm ready to architect your next software component. Describe the stack, the bottleneck, or the feature requirements. I'll provide a composited prompt and a technical schema.
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
                                        <CodingAgentAvatar size={36} />
                                        <div style={{ flex: 1, borderRadius: "2px 16px 16px 16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.14)", padding: "16px 20px" }}>
                                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loader */}
                        {isLoading && (
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                <CodingAgentAvatar size={36} />
                                <div style={{
                                    borderRadius: "4px 16px 16px 16px",
                                    background: "#0d0f17", border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
                                }}>
                                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontStyle: "italic" }}>
                                        Architect is debugging logic trees...
                                    </p>
                                    <MatrixLoader />
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
                                placeholder="Evolve your software's logic strategy..."
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
                                    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
                                    cursor: "pointer", fontSize: 13, fontWeight: 800,
                                    color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase",
                                    opacity: isLoading || !input.trim() ? 0.4 : 1,
                                    boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                                    transition: "opacity .2s",
                                }}
                            >
                                Synthesize <Plus style={{ width: 14, height: 14 }} />
                            </button>
                        </div>

                        {/* Shortcuts */}
                        <div style={{ display: "flex", gap: 20, paddingTop: 12, paddingLeft: 6 }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>⌘ + ENTER TO SEND</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#a855f7", letterSpacing: "0.14em", fontWeight: 600 }}>
                                <RefreshCw style={{ width: 10, height: 10 }} /> JIT COMPILATION ACTIVE
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════ RIGHT PANEL — OUTPUT ════ */}
                <div style={{
                    display: "flex", flexDirection: "column",
                    background: "#06070a", overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 28px 20px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px rgba(168,85,247,0.8)" }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Output Synthesis</span>
                        </div>
                        <div style={{ padding: "4px 12px", borderRadius: 999, background: "#0d0f17", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                            Optimized
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                        {/* CODING PROMPT */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Refined Human Prompt</span>
                                <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#a855f7", letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#a855f7", letterSpacing: "0.12em", textTransform: "uppercase" }}
                                >
                                    <Download style={{ width: 11, height: 11 }} /> Export
                                </button>
                            </div>
                            <div style={{ borderRadius: 12, background: "#0c0e16", border: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px" }}>
                                <JsonHighlight code={jsonText} />
                            </div>
                        </div>

                        {/* LOGIC READY card */}
                        <div style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg,#200e3b,#2a1152,#16092e)",
                            border: "1px solid rgba(124,58,237,0.25)",
                            padding: "24px",
                            boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 50, height: 50, borderRadius: 14,
                                    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                                }}>
                                    <Cpu style={{ width: 22, height: 22, color: "#fff" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "0.02em" }}>Logic Ready</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#a855f7", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Verified Technical Assets</p>
                                </div>
                            </div>

                            {/* ACTION: OPEN IN IDE */}
                            <button style={{
                                width: "100%", height: 50, borderRadius: 12, border: "none",
                                background: "#fff", cursor: "pointer",
                                fontSize: 13, fontWeight: 800, color: "#18181b",
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                marginBottom: 12,
                            }}>
                                <Zap style={{ width: 15, height: 15, fill: "#000" }} />
                                Sync to IDE Environment
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
