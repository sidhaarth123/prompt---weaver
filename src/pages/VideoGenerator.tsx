import { useState, useRef, useEffect } from "react";
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
    Video,
    Copy,
    Check,
    RefreshCw,
    Clapperboard,
    ShoppingBag,
    Sparkles,
    Zap,
    AlertCircle,
    Bot,
    Film,
    Monitor,
    Smartphone
} from "lucide-react";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { PremiumChatbot } from "@/components/PremiumChatbot";
import { mapVideoResponseToState } from "@/mappers/videoMapper";

// --- Constants ---
const PLATFORMS = ["Instagram Reel", "Instagram Story", "YouTube Shorts", "TikTok", "YouTube Video", "Facebook Feed Video", "LinkedIn Video"];
const ASPECT_RATIOS = [
    { label: "9:16", value: "9:16", icon: Smartphone },
    { label: "16:9", value: "16:9", icon: Monitor },
    { label: "1:1", value: "1:1", icon: Smartphone },
    { label: "4:5", value: "4:5", icon: Smartphone },
];
const VIDEO_PLATFORM_ASPECT_MAP: Record<string, string> = {
    "Instagram Reel": "9:16",
    "Instagram Story": "9:16",
    "YouTube Shorts": "9:16",
    "TikTok": "9:16",
    "YouTube Video": "16:9",
    "Facebook Feed Video": "4:5",
    "LinkedIn Video": "16:9"
};
const STYLES = ["Cinematic", "UGC / Authentic", "Minimal & Clean", "Bold & Energetic", "Animated", "3D Motion"];
const AD_TONES = ["Salesy", "Luxury", "Friendly", "Educational", "High Energy"];

export default function VideoGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // Form State
    const [platform, setPlatform] = useState("");
    const [aspectRatio, setAspectRatio] = useState("9:16");
    const [duration, setDuration] = useState([15]);
    const [style, setStyle] = useState("");
    const [hook, setHook] = useState("");
    const [beats, setBeats] = useState("");
    const [visuals, setVisuals] = useState("");
    const [productName, setProductName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [cta, setCta] = useState("");
    const [adTone, setAdTone] = useState("");

    const [touchedByUser, setTouchedByUser] = useState<Record<string, boolean>>({});

    const setFieldManually = (field: string, value: any, setter: (val: any) => void) => {
        setter(value);
        setTouchedByUser(prev => ({ ...prev, [field]: true }));
    };

    const setFieldAuto = (field: string, value: any) => {
        if (touchedByUser[field]) return;
        const setters: Record<string, (val: any) => void> = {
            platform: setPlatform,
            aspectRatio: setAspectRatio,
            style: setStyle,
            hook: setHook,
            beats: setBeats,
            visuals: setVisuals,
            productName: setProductName,
            brandName: setBrandName,
            cta: setCta,
            adTone: setAdTone
        };
        const setter = setters[field];
        if (setter) setter(value);
        if (field === 'duration' && typeof value === 'number') setDuration([value]);
    };

    const {
        chatHistory,
        isLoading: assistantLoading,
        credits,
        errorStatus,
        sendMessage,
        clearChat
    } = usePromptWeaverChat({
        workflowType: 'video',
        onDataReceived: (res) => {
            if (res.final) {
                mapVideoResponseToState(res.final, {}, setFieldAuto);
            }
            if (res.prompt_package) {
                setResult({
                    text: res.prompt_package.prompt || res.prompt_package.script,
                    json: JSON.stringify(res.final, null, 2)
                });
            }
        }
    });

    const handleGenerate = async () => {
        if (!platform || !style || (!productName && !hook)) {
            toast({ title: "Missing fields", description: "Fill in Platform, Style, and Hook/Product.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const finalScript = `Video Script for ${platform} (${aspectRatio})\nDuration: ${duration}s\nStyle: ${style}\n\nHook: ${hook}\n\nBeats:\n${beats}\n\nVisuals: ${visuals}\n\nCTA: ${cta}`;
            setResult({
                text: finalScript,
                json: JSON.stringify({ platform, duration, style, hook, beats, visuals, cta }, null, 2)
            });
            toast({ title: "Video script generated!" });
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
        setProductName("");
        setBrandName("");
        setCta("");
        setAdTone("");
        setResult(null);
        setTouchedByUser({});
        clearChat();
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">
                    <div className="space-y-6">
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Video Engine v3.1</span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">Video Prompt Generator</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">Create high-converting video scripts and AI video prompts.</p>
                        </div>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Clapperboard className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Production Details</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
                                    <Select value={platform} onValueChange={(v) => { setFieldManually('platform', v, setPlatform); setFieldManually('aspectRatio', VIDEO_PLATFORM_ASPECT_MAP[v] || "9:16", setAspectRatio); }}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Duration ({duration}s)</Label>
                                    <Slider value={duration} onValueChange={setDuration} max={60} step={5} className="py-4" />
                                </div>
                            </div>
                        </section>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Film className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Script Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hook</Label>
                                    <Input placeholder="The first 3 seconds..." value={hook} onChange={e => setFieldManually('hook', e.target.value, setHook)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Story Beats</Label>
                                    <Textarea placeholder="Core message steps..." value={beats} onChange={e => setFieldManually('beats', e.target.value, setBeats)} className="bg-background/40 border-white/10 min-h-[100px]" />
                                </div>
                            </div>
                        </section>

                        <Button onClick={handleGenerate} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                            {loading ? <RefreshCw className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                            Generate Final Script
                        </Button>
                    </div>

                    <div className="lg:h-[calc(100vh-120px)] lg:sticky lg:top-24">
                        <PremiumChatbot
                            chatHistory={chatHistory}
                            isLoading={assistantLoading}
                            credits={credits}
                            errorStatus={errorStatus}
                            onSendMessage={sendMessage}
                            result={result}
                            suggestions={[
                                "UGC style unboxing for TikTok",
                                "Cinematic brand story for YouTube",
                                "Fast-paced sales reel for IG",
                                "Professional LinkedIn service intro"
                            ]}
                        />
                        <div className="mt-4 px-2">
                            <Button variant="ghost" size="sm" onClick={() => setTouchedByUser({})} className="text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors h-6">
                                <RefreshCw className="w-3 h-3 mr-1.5" /> Reset Flags
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
