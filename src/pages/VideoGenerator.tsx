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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Video,
    Code2,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Clapperboard,
    Music,
    Film,
    Smartphone,
    Monitor,
} from "lucide-react";

// --- Constants ---

const PLATFORMS = [
    "Instagram Reel",
    "Instagram Story",
    "YouTube Shorts",
    "TikTok",
    "YouTube Video",
    "Facebook Feed Video",
    "Facebook Story",
    "LinkedIn Video",
    "Website Hero Video"
];

const ASPECT_RATIOS = [
    { label: "9:16", value: "9:16", icon: Smartphone },
    { label: "16:9", value: "16:9", icon: Monitor },
    { label: "1:1", value: "1:1", icon: Smartphone }, // Using generic icon
    { label: "4:5", value: "4:5", icon: Smartphone },
];

// Platform to Aspect Ratio Mapping
const VIDEO_PLATFORM_ASPECT_MAP: Record<string, string> = {
    "Instagram Reel": "9:16",
    "Instagram Story": "9:16",
    "YouTube Shorts": "9:16",
    "TikTok": "9:16",
    "YouTube Video": "16:9",
    "Facebook Feed Video": "4:5",
    "Facebook Story": "9:16",
    "LinkedIn Video": "16:9",
    "Website Hero Video": "16:9"
};

const STYLES = [
    "Cinematic & High-End",
    "UGC / Authentic",
    "Minimal & Clean",
    "Bold & Energetic",
    "Documentary Style",
    "Animated / Motion Graphics",
];

const TEMPLATES = [
    {
        label: "UGC Product Ad",
        platform: "TikTok",
        style: "UGC / Authentic",
        duration: 15,
        hook: "Stop scrolling! You need to see this.",
        beats: "- Show problem (messy desk)\n- Introduce product (organizer)\n- Show satisfyting cleanup\n- Call to action",
        visuals: "Hand-held camera, natural lighting, messy bedroom setting"
    },
    {
        label: "SaaS Promo",
        platform: "LinkedIn Video",
        style: "Minimal & Clean",
        duration: 30,
        hook: "Is your team struggling with workflow chaos?",
        beats: "- Animated problem visualization\n- Screen recording of software solution\n- Testimonial overlay\n- Free trial CTA",
        visuals: "Screen capture, modern UI mockup, abstract tech background"
    },
    {
        label: "E-com Offer",
        platform: "Instagram Reel",
        style: "Bold & Energetic",
        duration: 10,
        hook: "Flash Sale Alert! 50% OFF.",
        beats: "- Fast cuts of product variants\n- Text overlay '50% OFF'\n- Lifestyle usage shot\n- Link in bio arrow",
        visuals: "Bright studio lighting, colorful background, fast transitions"
    },
    {
        label: "Explainer",
        platform: "YouTube Video",
        style: "Documentary Style",
        duration: 60,
        hook: "Here's exactly how X works.",
        beats: "- Host on camera intro\n- B-roll of concept\n- Diagram animation\n- Host summary",
        visuals: "Professional studio setup, depth of field, clear graphics"
    },
];

export default function VideoGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // Form State
    const [platform, setPlatform] = useState("");
    const [aspectRatio, setAspectRatio] = useState("9:16");
    const [duration, setDuration] = useState([15]); // array for slider
    const [style, setStyle] = useState("");
    const [hook, setHook] = useState("");
    const [beats, setBeats] = useState("");
    const [visuals, setVisuals] = useState("");
    const [characters, setCharacters] = useState("");
    const [textOverlay, setTextOverlay] = useState("");

    // Audio toggles
    const [voiceover, setVoiceover] = useState(false);
    const [voiceTone, setVoiceTone] = useState("");
    const [music, setMusic] = useState(false);
    const [musicVibe, setMusicVibe] = useState("");

    const [negative, setNegative] = useState("");

    const applyTemplate = (templateName: string) => {
        const t = TEMPLATES.find(t => t.label === templateName);
        if (t) {
            setPlatform(t.platform);
            setStyle(t.style);
            setDuration([t.duration]);
            setHook(t.hook);
            setBeats(t.beats);
            setVisuals(t.visuals);
            toast({ title: `Applied "${t.label}" template` });
        }
    };

    const handleGenerate = async () => {
        if (!platform || !style || !beats) {
            toast({
                title: "Missing fields",
                description: "Please fill in Platform, Style, and Scene Beats.",
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
                    type: "video",
                    userText: beats,
                    platform,
                    aspectRatio,
                    stylePreset: style,
                    extra: {
                        duration: String(duration[0]),
                        hook,
                        visuals,
                        characters,
                        textOverlay,
                        voiceover: voiceover ? `Yes - ${voiceTone}` : "No",
                        music: music ? `Yes - ${musicVibe}` : "No"
                    },
                    negativePrompt: negative
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
                toast({ title: "Video prompt generated!" });
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
        setAspectRatio("9:16");
        setDuration([15]);
        setStyle("");
        setHook("");
        setBeats("");
        setVisuals("");
        setCharacters("");
        setTextOverlay("");
        setVoiceover(false);
        setVoiceTone("");
        setMusic(false);
        setMusicVibe("");
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
                <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">

                    {/* LEFT: INPUTS */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Clapperboard className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Director Mode
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-3">
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight">
                                        <span className={THEME.gradientText}>Video Prompt Generator</span>
                                    </h1>
                                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mt-2">
                                        Storyboard scenes and generate prompts for AI video models like Sora, Pika, and Runway.
                                    </p>
                                </div>
                                <Select onValueChange={applyTemplate}>
                                    <SelectTrigger className="w-[200px] bg-background/40 border-primary/20 text-primary">
                                        <SelectValue placeholder="Load Template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEMPLATES.map((t) => (
                                            <SelectItem key={t.label} value={t.label}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* SECTION 1: FORMAT & STYLE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                    <Film className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Format & Style</h3>
                                    <p className="text-xs text-muted-foreground">Define the technical constraints.</p>
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
                                            const defaultAspectRatio = VIDEO_PLATFORM_ASPECT_MAP[value];
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
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Video Style</Label>
                                    <Select value={style} onValueChange={setStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Select style..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STYLES.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5 items-end">
                                <div className="space-y-3">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Aspect Ratio</Label>
                                    <div className="flex gap-2">
                                        {ASPECT_RATIOS.map((r) => (
                                            <button
                                                key={r.value}
                                                onClick={() => setAspectRatio(r.value)}
                                                className={cn(
                                                    "flex-1 flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs gap-1",
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
                                <div className="space-y-3 pb-1">
                                    <div className="flex justify-between">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Duration</Label>
                                        <span className="text-xs font-mono text-primary">{duration[0]}s</span>
                                    </div>
                                    <Slider
                                        value={duration}
                                        onValueChange={setDuration}
                                        max={120}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: SCRIPT & VISUALS */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Clapperboard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Script & Visuals</h3>
                                    <p className="text-xs text-muted-foreground">What happens in the video?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hook (First 3 Seconds)</Label>
                                    <Input
                                        placeholder="e.g. Stop scrolling! You won't believe this..."
                                        value={hook}
                                        onChange={(e) => setHook(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Scene Beats</Label>
                                    <Textarea
                                        placeholder="- Scene 1: Intro shot&#10;- Scene 2: Detail shot&#10;- Scene 3: Conclusion"
                                        value={beats}
                                        onChange={(e) => setBeats(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[100px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Details (Location, Moody, Camera)</Label>
                                    <Input
                                        placeholder="e.g. Sunny park, handheld camera, natural lighting"
                                        value={visuals}
                                        onChange={(e) => setVisuals(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Characters / Props</Label>
                                        <Input
                                            placeholder="e.g. Young woman, coffee cup"
                                            value={characters}
                                            onChange={(e) => setCharacters(e.target.value)}
                                            className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">On-Screen Text</Label>
                                        <Input
                                            placeholder="e.g. '50% OFF', 'Link in Bio'"
                                            value={textOverlay}
                                            onChange={(e) => setTextOverlay(e.target.value)}
                                            className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: AUDIO & CONTROLS */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Music className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Audio & Controls</h3>
                                    <p className="text-xs text-muted-foreground">Soundscape and constraints.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2 cursor-pointer">
                                            <Switch checked={voiceover} onCheckedChange={setVoiceover} />
                                            <span className="font-medium">Voiceover</span>
                                        </Label>
                                    </div>
                                    {voiceover && (
                                        <Input
                                            placeholder="Tone & Language (e.g. Energetic English)"
                                            value={voiceTone}
                                            onChange={(e) => setVoiceTone(e.target.value)}
                                            className="bg-background/40 border-white/10 h-9"
                                        />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2 cursor-pointer">
                                            <Switch checked={music} onCheckedChange={setMusic} />
                                            <span className="font-medium">Music / SFX</span>
                                        </Label>
                                    </div>
                                    {music && (
                                        <Input
                                            placeholder="Vibe (e.g. Lofi Beat)"
                                            value={musicVibe}
                                            onChange={(e) => setMusicVibe(e.target.value)}
                                            className="bg-background/40 border-white/10 h-9"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Negative Constraints</Label>
                                <Input
                                    placeholder="e.g. static shots, blurry, shaky camera"
                                    value={negative}
                                    onChange={(e) => setNegative(e.target.value)}
                                    className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
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
                                className={cn("flex-1 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all hover:scale-[1.02]")}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Screenplay...
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4 mr-2" /> Generate Video Prompt
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
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-6 ring-1 ring-white/10 animate-pulse">
                                            <Clapperboard className="h-10 w-10 text-red-500/80" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Awaiting Direction</h3>
                                        <p className="text-sm text-muted-foreground max-w-[260px] mt-3 leading-relaxed">
                                            Set the scene, define the beats, and generate a director-level video prompt.
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
