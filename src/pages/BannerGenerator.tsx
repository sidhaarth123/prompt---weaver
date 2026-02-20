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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    LayoutTemplate,
    Code2,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Layers,
    Monitor,
    ShoppingBag,
    Target,
    Zap,
    AlertCircle,
    Bot
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { PremiumChatbot } from "@/components/PremiumChatbot";
import { mapBannerResponseToState } from "@/mappers/bannerMapper";

// --- Constants ---
const PLACEMENTS = ["Meta Ad Feed", "Instagram Story", "Google Display Banner", "Shopify Hero", "Email Header", "Twitter/X Post", "LinkedIn Ad"];
const SIZE_PRESETS = ["1200x628 (Feed)", "1080x1920 (Story)", "300x250 (MREC)", "728x90 (Leaderboard)", "1600x400 (Hero)"];
const STYLES = ["Minimalist", "Bold Typography", "Luxury / Elegant", "Playful & Bright", "Clean Corporate", "High-Contrast Ad"];
const BACKGROUND_TYPES = ["Solid Color", "Gradient", "Product Photography", "Stock Lifestyle", "Abstract Shapes", "Blurred Scene"];

export default function BannerGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [touchedByUser, setTouchedByUser] = useState<Record<string, boolean>>({});

    // Form State
    const [brandName, setBrandName] = useState("");
    const [productName, setProductName] = useState("");
    const [primaryMessage, setPrimaryMessage] = useState("");
    const [cta, setCta] = useState("");
    const [placement, setPlacement] = useState("");
    const [sizePreset, setSizePreset] = useState("");
    const [style, setStyle] = useState("");
    const [backgroundType, setBackgroundType] = useState("");

    const setFieldManually = (field: string, value: any, setter: (val: any) => void) => {
        setter(value);
        setTouchedByUser(prev => ({ ...prev, [field]: true }));
    };

    const setFieldAuto = (field: string, value: any) => {
        if (touchedByUser[field]) return;
        const setters: Record<string, (val: any) => void> = {
            brandName: setBrandName,
            productName: setProductName,
            primaryMessage: setPrimaryMessage,
            cta: setCta,
            placement: setPlacement,
            sizePreset: setSizePreset,
            style: setStyle,
            backgroundType: setBackgroundType
        };
        const setter = setters[field];
        if (setter) setter(value);
    };

    const {
        chatHistory,
        isLoading: assistantLoading,
        credits,
        errorStatus,
        sendMessage,
        clearChat
    } = usePromptWeaverChat({
        workflowType: 'banner',
        onDataReceived: (res) => {
            if (res.final) {
                mapBannerResponseToState(res.final, {}, setFieldAuto);
            }
            if (res.prompt_package) {
                setResult({
                    text: res.prompt_package.prompt || "Banner generated successfully.",
                    json: JSON.stringify(res.final, null, 2)
                });
            }
        }
    });

    const handleGenerate = async () => {
        if (!brandName || !primaryMessage || !placement) {
            toast({ title: "Missing fields", description: "Fill in Brand, Message, and Placement.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const finalPrompt = `Banner Design for ${brandName}: ${productName}\nPlacement: ${placement} (${sizePreset})\nStyle: ${style}\nHeadline: ${primaryMessage}\nCTA: ${cta}`;
            setResult({
                text: finalPrompt,
                json: JSON.stringify({ brandName, productName, primaryMessage, cta, placement, sizePreset, style }, null, 2)
            });
            toast({ title: "Banner prompt generated!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">
                    <div className="space-y-6">
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Banner Engine v1.0</span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">Banner Prompt Generator</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">Design professional ad banners and shop headers with AI.</p>
                        </div>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Banner Brief</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. Aura" value={brandName} onChange={e => setFieldManually('brandName', e.target.value, setBrandName)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product</Label>
                                    <Input placeholder="e.g. Silk Mask" value={productName} onChange={e => setFieldManually('productName', e.target.value, setProductName)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Headline Message</Label>
                                <Input placeholder="Main hook for the banner..." value={primaryMessage} onChange={e => setFieldManually('primaryMessage', e.target.value, setPrimaryMessage)} className="bg-background/40 border-white/10" />
                            </div>
                        </section>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Format & Style</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Placement</Label>
                                    <Select value={placement} onValueChange={v => setFieldManually('placement', v, setPlacement)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PLACEMENTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Style</Label>
                                    <Select value={style} onValueChange={v => setFieldManually('style', v, setStyle)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        <Button onClick={handleGenerate} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                            {loading ? <RefreshCw className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                            Generate Final Concepts
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
                                "Bold typography for Meta Ad",
                                "Minimalist hero for Shopify",
                                "Cyberpunk event banner",
                                "Luxury email promotional header"
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
