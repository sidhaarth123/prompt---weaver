import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Check, RefreshCw, Bookmark, Settings2, ChevronRight, Image as ImageIcon, Rocket, ChevronDown } from "lucide-react";

/* ── Constants ───────────────────────────────────────────── */
const PLATFORMS = ["Midjourney", "Stable Diffusion XL", "DALL-E 3", "Adobe Firefly", "Leonardo AI"];
const ASPECTS = ["1:1 (Square)", "16:9 (Landscape)", "9:16 (Portrait)", "4:5 (Instagram)", "3:2 (Photo)"];
const STYLES_LIST = ["Photorealistic", "Cyberpunk", "Minimalist", "3D Render", "Cinematic", "Oil Painting", "Vector Art"];
const LIGHTINGS = ["Cinematic Lighting", "Natural Sunlight", "Studio Softbox", "Neon / Cyber", "Golden Hour", "Moody / Dark"];

/* ── Helpers ─────────────────────────────────────────────── */
function timeAgo(ts: number) {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 60) return `${m} mins ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hours ago`;
    return h < 48 ? "Yesterday" : `${Math.floor(h / 24)} days ago`;
}

function StyledSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
                width: "100%", height: "40px", padding: "0 32px 0 12px",
                borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.85)",
                background: "#1c1c2a url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\") right 8px center / 16px no-repeat",
                border: "1px solid rgba(255,255,255,0.08)", appearance: "none", outline: "none", cursor: "pointer"
            }}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}

const DEMO_RECENT = [
    { id: "1", title: "Futuristic Neon City", ts: Date.now() - 30 * 60000 },
    { id: "2", title: "Portrait of Android", ts: Date.now() - 2 * 3600000 },
    { id: "3", title: "Abstract Flowing Colors", ts: Date.now() - 5 * 3600000 },
    { id: "4", title: "Zen Garden Minimalist", ts: Date.now() - 24 * 3600000 },
];

/* ── Component ───────────────────────────────────────────── */
export default function ImageGenerator() {
    const [topic, setTopic] = useState("Cyberpunk city street at night, neon signs reflecting in puddles, cinematic lighting, ultra-detailed.");
    const [platform, setPlatform] = useState("Midjourney");
    const [aspect, setAspect] = useState("1:1 (Square)");
    const [style, setStyle] = useState("Cyberpunk");
    const [lighting, setLighting] = useState("Cinematic Lighting");
    const [keywords, setKeywords] = useState("");
    const [autoOpt, setAutoOpt] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [tab, setTab] = useState<"human" | "json">("human");
    const [copied, setCopied] = useState(false);
    const [credits, setCredits] = useState(450);
    const [recent, setRecent] = useState(DEMO_RECENT);
    const [platOpen, setPlatOpen] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({ title: "Enter a prompt topic", variant: "destructive" });
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));

        const ar = aspect.split(" ")[0];
        let text = `"A cinematic ${style.toLowerCase()} scene of ${topic.trim()}, ${lighting.toLowerCase()}`;
        if (keywords) text += `, ${keywords}`;
        if (autoOpt) text += `, intricate architectural details, 8k resolution, photorealistic"`;
        else text += `"`;

        const json = JSON.stringify({ prompt: text, platform, aspect_ratio: ar, style, lighting, negative_prompt: "blurry, low quality, watermark, text" }, null, 2);
        setResult({ text, json });
        setCredits(c => Math.max(0, c - 1));
        setRecent(prev => [{ id: Date.now().toString(), title: topic.split(",")[0].trim().slice(0, 28), ts: Date.now() }, ...prev.slice(0, 7)]);
        setLoading(false);
        toast({ title: "✨ Prompt generated!" });
    };

    /* Format prompt for the chosen export platform */
    const formatForPlatform = async (p: string) => {
        if (!result) { toast({ title: "Generate a prompt first", variant: "destructive" }); return; }
        const ar = aspect.split(" ")[0];
        let out = "";
        if (p === "Midjourney") out = `/imagine prompt: ${result.text} --ar ${ar} --v 6 --style raw`;
        else if (p === "Stable Diffusion XL") out = `Positive: ${result.text}\nNegative: blurry, low quality, watermark, text`;
        else if (p === "DALL-E 3") out = result.text;
        else if (p === "Adobe Firefly") out = `${result.text} [Firefly: aspect=${ar}, style=${style}]`;
        else if (p === "Leonardo AI") out = `${result.text} | Platform: Leonardo | AR: ${ar}`;
        else out = result.text;
        await navigator.clipboard.writeText(out);
        toast({ title: `Copied for ${p}!`, description: "Prompt formatted and ready to paste." });
        setPlatOpen(false);
    };

    const handleCopy = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(tab === "human" ? result.text : result.json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Copied!" });
    };

    /* ── Shared styles ── */
    const labelSt: React.CSSProperties = { display: "block", marginBottom: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" };
    const cardSt: React.CSSProperties = { background: "#13131d", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" };
    const btnSt: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)", cursor: "pointer", transition: "all .15s" };

    return (
        <div style={{ minHeight: "100vh", background: "#0b0b14" }}>
            <Navbar />

            <div style={{ display: "flex", paddingTop: "64px" }}>

                {/* ════════ LEFT SIDEBAR ════════ */}
                <aside style={{
                    position: "fixed", top: "64px", left: 0, bottom: 0, width: "288px",
                    background: "#0f0f1a", borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", flexDirection: "column", overflowY: "auto"
                }}>
                    <div style={{ padding: "24px 20px 12px" }}>
                        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Configuration</p>
                    </div>

                    <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", gap: "18px", paddingBottom: "100px" }}>
                        {/* Prompt Topic */}
                        <div>
                            <label style={labelSt}>Prompt Topic</label>
                            <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4}
                                placeholder="e.g. Cyberpunk city street at night..."
                                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.85)", background: "#1c1c2a", border: "1px solid rgba(255,255,255,0.08)", outline: "none", resize: "none", lineHeight: 1.55, boxSizing: "border-box" }}
                            />
                        </div>

                        <div><label style={labelSt}>Platform</label><StyledSelect value={platform} onChange={setPlatform} options={PLATFORMS} /></div>
                        <div><label style={labelSt}>Aspect Ratio</label><StyledSelect value={aspect} onChange={setAspect} options={ASPECTS} /></div>
                        <div><label style={labelSt}>Style</label><StyledSelect value={style} onChange={setStyle} options={STYLES_LIST} /></div>
                        <div><label style={labelSt}>Lighting / Style</label><StyledSelect value={lighting} onChange={setLighting} options={LIGHTINGS} /></div>

                        <div>
                            <label style={labelSt}>Keywords</label>
                            <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. moody, hyper-realistic, 8k"
                                style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.85)", background: "#1c1c2a", border: "1px solid rgba(255,255,255,0.08)", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>

                        {/* Auto-Optimize */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "10px", background: "#1c1c2a", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>Auto-Optimize</p>
                                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>AI-enhanced details</p>
                            </div>
                            <Switch checked={autoOpt} onCheckedChange={setAutoOpt} />
                        </div>
                    </div>

                    {/* Generate button */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px 20px", background: "linear-gradient(to top, #0f0f1a 70%, transparent)" }}>
                        <button onClick={handleGenerate} disabled={loading}
                            style={{ width: "100%", height: "48px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", color: "#fff", background: "linear-gradient(90deg,#06b6d4,#3b82f6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 20px rgba(6,182,212,0.35)", opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? <RefreshCw style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Zap style={{ width: 16, height: 16, fill: "#fff" }} />}
                            {loading ? "Generating…" : "Generate Prompt"}
                        </button>
                    </div>
                </aside>

                {/* ════════ MAIN CONTENT ════════ */}
                <main style={{ marginLeft: "288px", flex: 1, padding: "32px", minHeight: "calc(100vh - 64px)" }}>
                    <div style={{ maxWidth: "860px" }}>

                        {/* Page header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "4px", height: "32px", borderRadius: "4px", background: "linear-gradient(180deg,#06b6d4,#3b82f6)", flexShrink: 0 }} />
                                <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>Image Prompt Generator</h1>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "999px", background: "#1c1c2a", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <Zap style={{ width: 13, height: 13, color: "#22d3ee" }} />
                                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Credits</span>
                                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{credits}</span>
                                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>/500</span>
                                </div>
                                <button style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                                    <Settings2 style={{ width: 15, height: 15, color: "rgba(255,255,255,0.4)" }} />
                                </button>
                            </div>
                        </div>

                        {/* Output card */}
                        <div style={{ ...cardSt, marginBottom: "32px" }}>
                            {/* Tabs */}
                            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
                                {(["human", "json"] as const).map(t => (
                                    <button key={t} onClick={() => setTab(t)}
                                        style={{ position: "relative", padding: "16px 4px", marginRight: "28px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: tab === t ? "#22d3ee" : "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        {t === "human" ? "Human Prompt" : "JSON Prompt"}
                                        {tab === t && <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", borderRadius: "2px", background: "#22d3ee" }} />}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: "28px" }}>
                                {result ? (
                                    <>
                                        {tab === "human"
                                            ? <p style={{ fontSize: "17px", fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, fontFamily: "Georgia, serif", marginBottom: "20px" }}>{result.text}</p>
                                            : <pre style={{ fontSize: "12px", color: "rgba(74,222,128,0.8)", fontFamily: "monospace", lineHeight: 1.7, overflowX: "auto", background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>{result.json}</pre>
                                        }
                                        {/* Tags */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                                            {[`Aspect: ${aspect.split(" ")[0]}`, `Style: ${style}`, `Platform: ${platform}`, `Lighting: ${lighting}`].map(tag => (
                                                <span key={tag} style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>{tag}</span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ padding: "56px 0", textAlign: "center" }}>
                                        <div style={{ width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.14)" }}>
                                            <Zap style={{ width: 28, height: 28, color: "rgba(6,182,212,0.4)" }} />
                                        </div>
                                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "14px" }}>Configure your settings and click <span style={{ color: "rgba(34,211,238,0.6)" }}>Generate Prompt</span></p>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                                    {/* Copy */}
                                    <button onClick={handleCopy} disabled={!result} style={{ ...btnSt, opacity: result ? 1 : 0.3 }}>
                                        {copied ? <Check style={{ width: 15, height: 15, color: "#4ade80" }} /> : <Copy style={{ width: 15, height: 15 }} />}
                                        {copied ? "Copied!" : "Copy to Clipboard"}
                                    </button>
                                    {/* Save */}
                                    <button onClick={() => { if (result) toast({ title: "Saved to library!" }); }} disabled={!result} style={{ ...btnSt, opacity: result ? 1 : 0.3 }}>
                                        <Bookmark style={{ width: 15, height: 15 }} />
                                        Save Selection
                                    </button>
                                    {/* Platform dropdown */}
                                    <div style={{ position: "relative" }}>
                                        <button
                                            onClick={() => setPlatOpen(o => !o)}
                                            style={{
                                                ...btnSt,
                                                opacity: result ? 1 : 0.35,
                                                background: platOpen ? "rgba(139,92,246,0.18)" : "linear-gradient(135deg,rgba(139,92,246,0.16),rgba(79,70,229,0.16))",
                                                border: "1px solid rgba(139,92,246,0.35)",
                                                color: "#c4b5fd",
                                            }}
                                        >
                                            <Rocket style={{ width: 15, height: 15 }} />
                                            Platform
                                            <ChevronDown style={{ width: 13, height: 13, transition: "transform .2s", transform: platOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                                        </button>

                                        {platOpen && (
                                            <div style={{
                                                position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                                                minWidth: "210px", borderRadius: "12px", overflow: "hidden",
                                                background: "#1e1e2e", border: "1px solid rgba(139,92,246,0.25)",
                                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 50
                                            }}>
                                                <p style={{ padding: "10px 14px 6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: 0 }}>Export formatted for</p>
                                                {PLATFORMS.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => formatForPlatform(p)}
                                                        style={{
                                                            width: "100%", textAlign: "left", padding: "10px 14px",
                                                            fontSize: "13px", fontWeight: 500,
                                                            color: p === platform ? "#c4b5fd" : "rgba(255,255,255,0.75)",
                                                            background: p === platform ? "rgba(139,92,246,0.12)" : "transparent",
                                                            border: "none", cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "space-between"
                                                        }}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = p === platform ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.05)"; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = p === platform ? "rgba(139,92,246,0.12)" : "transparent"; }}
                                                    >
                                                        {p}
                                                        {p === platform && <span style={{ fontSize: "10px", color: "#a78bfa", fontWeight: 600 }}>current</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recently Generated */}
                        <div>
                            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px" }}>
                                <div>
                                    <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "4px" }}>Recently Generated</p>
                                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>Your recent creative iterations</p>
                                </div>
                                <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#22d3ee", background: "none", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
                                    View History <ChevronRight style={{ width: 13, height: 13 }} />
                                </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
                                {recent.slice(0, 4).map(item => (
                                    <div key={item.id} style={{ ...cardSt, cursor: "pointer", overflow: "hidden", transition: "transform .15s" }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                                    >
                                        <div style={{ height: "108px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}>
                                            <ImageIcon style={{ width: 28, height: 28, color: "rgba(255,255,255,0.12)" }} />
                                        </div>
                                        <div style={{ padding: "12px" }}>
                                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px", lineHeight: 1.3 }}>{item.title}</p>
                                            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{timeAgo(item.ts)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}
