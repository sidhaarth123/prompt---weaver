import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Image as ImageIcon,
    Code2,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Monitor,
    Smartphone,
    Aperture,
    Type,
} from "lucide-react";

// --- Constants ---

const PLATFORMS = [
    "Instagram Post",
    "Instagram Story",
    "Product Ad",
    "YouTube Thumbnail",
    "Website Hero",
    "Blog Header",
    "Display Banner"
];

const ASPECT_RATIOS = [
    { label: "1:1", value: "1:1", icon: Smartphone }, // Generic icon if Instagram not imported
    { label: "4:5", value: "4:5", icon: Smartphone },
    { label: "16:9", value: "16:9", icon: Monitor },
    { label: "9:16", value: "9:16", icon: Smartphone },
];

const STYLES = [
    "Minimal & Clean",
    "Premium Product Photography",
    "Cinematic & Moody",
    "Bold & Colorful",
    "Festive & Seasonal",
    "3D Render (Octane)",
    "Cyberpunk / Neon",
    "Illustrative / Flat"
];

const LIGHTING_OPTIONS = [
    "Natural Sunlight",
    "Softbox Studio",
    "Golden Hour",
    "Neon rim lights",
    "Dark & moody",
    "Volumetric fog"
];

const CAMERA_ANGLES = [
    "Eye Level",
    "Low Angle (Hero)",
    "High Angle (Bird's Eye)",
    "Macro (Close-up)",
    "Wide Angle"
];

// Platform to Aspect Ratio Mapping
const PLATFORM_ASPECT_MAP: Record<string, string> = {
    "Instagram Post": "1:1",
    "Instagram Story": "9:16",
    "Product Ad": "1:1",
    "YouTube Thumbnail": "16:9",
    "Website Hero": "16:9",
    "Blog Header": "16:9",
    "Display Banner": "4:5"
};

export default function ImageGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // Form State
    const [platform, setPlatform] = useState("");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [subject, setSubject] = useState("");
    const [style, setStyle] = useState("");
    const [background, setBackground] = useState("");
    const [lighting, setLighting] = useState("");
    const [camera, setCamera] = useState("");
    const [negative, setNegative] = useState("");

    const handleGenerate = async () => {
        if (!subject || !platform || !style) {
            toast({
                title: "Missing fields",
                description: "Please fill in Platform, Subject, and Style.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "image",
                    userText: subject,
                    platform,
                    aspectRatio,
                    stylePreset: style,
                    lighting,
                    cameraAngle: camera,
                    background,
                    negativePrompt: negative,
                    subject
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Generation failed");
            }

            if (data.status === "succeeded" && data.result) {
                setResult({
                    text: data.result.humanReadable,
                    json: JSON.stringify(data.result.jsonPrompt, null, 2)
                });
                toast({ title: "Image prompt generated!" });
            } else {
                throw new Error("Invalid response format");
            }

        } catch (error: any) {
            console.error("Generation error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to generate prompt. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPlatform("");
        setAspectRatio("1:1");
        setSubject("");
        setStyle("");
        setBackground("");
        setLighting("");
        setCamera("");
        setNegative("");
        setResult(null);
    };

    const copyToClipboard = async (text: string, isJson: boolean) => {
        await navigator.clipboard.writeText(text);
        if (isJson) {
            setCopiedJson(true);
            setTimeout(() => setCopiedJson(false), 2000);
        } else {
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 2000);
        }
        toast({ title: "Copied to clipboard" });
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">

                    {/* LEFT: INPUTS */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Visual Engine
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                <span className={THEME.gradientText}>Image Prompt Generator</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Craft professional image prompts for Midjourney, DALL-E 3, and Stable Diffusion.
                            </p>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* SECTION 1: CONTEXT */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Context & Format</h3>
                                    <p className="text-xs text-muted-foreground">Where will this image be used?</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
                                    <Select
                                        value={platform}
                                        onValueChange={(value) => {
                                            setPlatform(value);
                                            // Automatically set aspect ratio based on platform
                                            const defaultAspectRatio = PLATFORM_ASPECT_MAP[value];
                                            if (defaultAspectRatio) {
                                                setAspectRatio(defaultAspectRatio);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Select platform..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PLATFORMS.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Aspect Ratio</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {ASPECT_RATIOS.map((r) => (
                                            <button
                                                key={r.value}
                                                onClick={() => setAspectRatio(r.value)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs gap-1",
                                                    aspectRatio === r.value
                                                        ? "bg-primary/20 border-primary/50 text-foreground ring-1 ring-primary/20"
                                                        : "bg-background/30 border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10"
                                                )}
                                            >
                                                <r.icon className="w-3.5 h-3.5 opacity-70" />
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: SUBJECT */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Type className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Subject Details</h3>
                                    <p className="text-xs text-muted-foreground">Describe the main focus.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Subject Description</Label>
                                    <Textarea
                                        placeholder="e.g. A futuristic sleek silver sports car driving through a neon city at night..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px]"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Art Style</Label>
                                        <Select value={style} onValueChange={setStyle}>
                                            <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                                <SelectValue placeholder="Choose style..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STYLES.map((s) => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Background / Scene</Label>
                                        <Input
                                            placeholder="e.g. Minimal studio grey"
                                            value={background}
                                            onChange={(e) => setBackground(e.target.value)}
                                            className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: ADVANCED */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Aperture className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Composition</h3>
                                    <p className="text-xs text-muted-foreground">Lighting, framing, and exclusions.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Lighting</Label>
                                    <Select value={lighting} onValueChange={setLighting}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Select lighting..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LIGHTING_OPTIONS.map((l) => (
                                                <SelectItem key={l} value={l}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Camera Angle</Label>
                                    <Select value={camera} onValueChange={setCamera}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Select angle..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CAMERA_ANGLES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Negative Prompt (Optional)</Label>
                                <Input
                                    placeholder="e.g. blurry, text, watermark, low quality"
                                    value={negative}
                                    onChange={(e) => setNegative(e.target.value)}
                                    className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10"
                                />
                            </div>
                        </section>

                        {/* ACTIONS */}
                        <div className="flex gap-4 pt-4 sticky bottom-6 z-20">
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                className="h-12 px-6 border-white/10 bg-background/50 backdrop-blur-md hover:bg-white/10 hover:text-destructive transition-colors rounded-xl"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Clear
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className={cn("flex-1 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all hover:scale-[1.02]")}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Prompt...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-4 h-4 mr-2" /> Generate Image Prompt
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: OUTPUTS (Sticky) */}
                    <div className="lg:sticky lg:top-24 space-y-4 h-fit animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Code2 className="w-4 h-4" /> Output Preview
                            </h2>
                            {result && (
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md animate-pulse">
                                    Ready
                                </span>
                            )}
                        </div>

                        <div className="min-h-[600px]">
                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className={cn(THEME.glassCard, "overflow-hidden flex flex-col shadow-2xl border-primary/20")}
                                    >
                                        <Tabs defaultValue="text" className="w-full flex-1 flex flex-col">
                                            <div className="border-b border-white/5 bg-background/40 px-3 pb-0 pt-3 backdrop-blur-sm">
                                                <TabsList className="w-full bg-transparent border-b-0 p-0 h-auto gap-1">
                                                    <TabsTrigger
                                                        value="text"
                                                        className="flex-1 rounded-t-lg rounded-b-none border border-transparent border-b-0 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 transition-all font-medium text-xs uppercase tracking-wide"
                                                    >
                                                        Prompt
                                                    </TabsTrigger>
                                                    <TabsTrigger
                                                        value="json"
                                                        className="flex-1 rounded-t-lg rounded-b-none border border-transparent border-b-0 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 transition-all font-medium text-xs uppercase tracking-wide"
                                                    >
                                                        JSON Spec
                                                    </TabsTrigger>
                                                </TabsList>
                                            </div>

                                            <div className="relative flex-1 bg-[#09090b]">
                                                <TabsContent value="text" className="m-0 h-full">
                                                    <div className="relative h-full text-area-wrapper group">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            onClick={() => copyToClipboard(result.text, false)}
                                                            className="absolute top-4 right-4 h-9 w-9 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white z-10 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            {copiedText ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                        <Textarea
                                                            value={result.text}
                                                            readOnly
                                                            className="h-full min-h-[500px] w-full resize-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed text-slate-300 focus-visible:ring-0 selection:bg-primary/30"
                                                            style={{ fontFamily: '"Geist Mono", monospace' }}
                                                        />
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="json" className="m-0 h-full">
                                                    <div className="relative h-full group">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            onClick={() => copyToClipboard(result.json, true)}
                                                            className="absolute top-4 right-4 h-9 w-9 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white z-10 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            {copiedJson ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                        <pre className="h-full min-h-[500px] w-full overflow-auto p-6 text-xs text-xs font-mono text-emerald-400 leading-relaxed custom-scrollbar">
                                                            {result.json}
                                                        </pre>
                                                    </div>
                                                </TabsContent>
                                            </div>
                                        </Tabs>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center min-h-[500px]"
                                    >
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center mb-6 ring-1 ring-white/10 animate-pulse">
                                            <ImageIcon className="h-10 w-10 text-primary/80" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Awaiting Input</h3>
                                        <p className="text-sm text-muted-foreground max-w-[260px] mt-3 leading-relaxed">
                                            Describe your image idea on the left to generate detailed Midjourney or DALL-E prompts.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
