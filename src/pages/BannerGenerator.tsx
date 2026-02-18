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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Code2,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Lightbulb,
    CreditCard,
    Info,
    Monitor,
    Smartphone,
    Layout,
    Type,
    Palette,
    ShieldCheck,
    Bot,
    Send,
    Zap,
    MessageSquare,
    ShoppingBag
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// --- Constants ---

const CATEGORIES = [
    "Skincare",
    "Beauty",
    "Fashion",
    "Electronics",
    "Food & Beverage",
    "Home",
    "Fitness",
    "Kids",
    "Pets",
    "Other"
];

const CTAS = [
    "Shop Now",
    "Buy Now",
    "Explore",
    "Get Offer",
    "Order Today",
    "Limited Time"
];

const PLACEMENTS = [
    "Website Hero Banner",
    "Homepage Promo Strip",
    "Product Page Banner",
    "Checkout Upsell Banner",
    "Instagram Story Banner",
    "Instagram Feed Banner",
    "Facebook Ad Banner",
    "Google Display Banner"
];

const SIZES = [
    "1920x1080 (Hero)",
    "1600x900 (Hero)",
    "1080x1080 (Square)",
    "1080x1350 (4:5)",
    "1080x1920 (Story)",
    "1200x628 (FB Ad)",
    "300x250 (Display)",
    "728x90 (Leaderboard)",
    "970x250 (Billboard)"
];

const STYLES = [
    "Luxury Premium",
    "Minimal Clean",
    "Bold Gradient",
    "Glassmorphism",
    "Modern Product Photography",
    "Festive Sale",
    "Neon / Cyber",
    "Corporate Clean"
];

const BACKGROUNDS = [
    "Studio Gradient",
    "Solid Color",
    "Lifestyle Scene",
    "Abstract Shapes",
    "Pattern",
    "Bokeh"
];

const ASSISTANT_SUGGESTIONS = [
    "Luxury Skincare Sale Banner",
    "Black Friday Offer",
    "New Product Launch",
    "Limited Time Offer",
    "High-Converting Hero Banner"
];

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function BannerGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // --- State ---

    // Brief
    const [brandName, setBrandName] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [offer, setOffer] = useState("");
    const [cta, setCta] = useState("");
    const [primaryMessage, setPrimaryMessage] = useState("");

    // Format
    const [placement, setPlacement] = useState("");
    const [sizePreset, setSizePreset] = useState("");
    const [safeArea, setSafeArea] = useState(true);

    // Visuals
    const [style, setStyle] = useState("");
    const [backgroundType, setBackgroundType] = useState("");
    const [brandColors, setBrandColors] = useState("");
    const [props, setProps] = useState("");

    // Compliance
    const [noWatermark, setNoWatermark] = useState(true);
    const [noArtifacts, setNoArtifacts] = useState(true);
    const [noDistortedLogos, setNoDistortedLogos] = useState(true);
    const [avoidMisleading, setAvoidMisleading] = useState(true);

    // Assistant Status
    const [assistantInput, setAssistantInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isThinking]);

    // --- Logic ---

    // Helper: Build Prompt String
    const buildPrompt = (cfg: any) => {
        return `Design a high-converting e-commerce banner.
            
CONTEXT:
Brand: ${cfg.brandName}
Product: ${cfg.productName} (${cfg.category})
Target Audience: ${cfg.targetAudience}
Main Message: "${cfg.primaryMessage}"
Offer: ${cfg.offer}
CTA Button: ${cfg.cta}

FORMAT & TECH:
Placement: ${cfg.placement}
Size: ${cfg.sizePreset}
Safe Area Enforced: ${cfg.safeArea ? "YES" : "NO"}

AESTHETIC:
Style: ${cfg.style}
Background: ${cfg.backgroundType}
Brand Colors: ${cfg.brandColors}
Props/Elements: ${cfg.props}

QUALITY GUIDELINES:
- Typography: Ensure high readability, hierarchy with Headline > Subhead > CTA.
- Layout: Balanced composition, negative space for text overlay.
- E-commerce Focus: Product should be focal point, high contrast CTA.
${cfg.noWatermark ? "- No watermarks" : ""}
${cfg.noArtifacts ? "- No text artifacts" : ""}
${cfg.noDistortedLogos ? "- No distorted logos" : ""}
${cfg.avoidMisleading ? "- Authentic product representation" : ""}
`;
    };

    const buildJson = (cfg: any) => {
        return {
            brand_name: cfg.brandName,
            product_name: cfg.productName,
            category: cfg.category,
            target_audience: cfg.targetAudience,
            offer: cfg.offer,
            cta: cfg.cta,
            primary_message: cfg.primaryMessage,
            placement: cfg.placement,
            size_preset: cfg.sizePreset,
            safe_area: cfg.safeArea,
            style: cfg.style,
            background_type: cfg.backgroundType,
            brand_colors: cfg.brandColors,
            props: cfg.props,
            rules: {
                no_watermark: cfg.noWatermark,
                no_artifacts: cfg.noArtifacts,
                no_distorted_logos: cfg.noDistortedLogos,
                avoid_misleading: cfg.avoidMisleading
            }
        };
    };

    const handleGenerate = async (overrides?: any) => {
        // Current state configuration
        const currentConfig = {
            brandName, productName, category, targetAudience, offer, cta, primaryMessage,
            placement, sizePreset, safeArea,
            style, backgroundType, brandColors, props,
            noWatermark, noArtifacts, noDistortedLogos, avoidMisleading
        };

        const config = { ...currentConfig, ...overrides };

        // Fallback checks (only if manual/no overrides, though assistant might pass empty overrides)
        if (!overrides && !config.brandName && !config.productName && !config.category) {
            toast({
                title: "Missing fields",
                description: "Please fill in Brand Name, Product Name, and Category.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        // Simulate generation delay
        setTimeout(() => {
            const prompt = buildPrompt(config);
            const jsonSpec = buildJson(config);

            setResult({
                text: prompt,
                json: JSON.stringify(jsonSpec, null, 2)
            });
            setLoading(false);
            toast({ title: "Banner prompt generated!" });
        }, 1500);
    };

    const handleClear = () => {
        setBrandName("");
        setProductName("");
        setCategory("");
        setTargetAudience("");
        setOffer("");
        setCta("");
        setPrimaryMessage("");
        setPlacement("");
        setSizePreset("");
        setSafeArea(true);
        setStyle("");
        setBackgroundType("");
        setBrandColors("");
        setProps("");
        setResult(null);
        setChatHistory([]);
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

    // --- Assistant Logic (Client-Side Heuristic) ---
    const handleAssistantSubmit = async () => {
        if (!assistantInput.trim()) return;

        const userInput = assistantInput.trim();
        setAssistantInput("");
        setChatHistory(prev => [...prev, { role: "user", content: userInput }]);
        setIsThinking(true);

        // Simulate reading/parsing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 1. Parse Input (Simple Heuristics)
        const lower = userInput.toLowerCase();

        // Brand & Product
        // Naive extraction: assume first few words might be product/brand if not already set? 
        // Or just map known keywords.

        let overrides: any = {};

        // Category Detection
        const matchedCategory = CATEGORIES.find(c => lower.includes(c.toLowerCase()));
        if (matchedCategory) {
            setCategory(matchedCategory);
            overrides.category = matchedCategory;
        }

        // CTA Detection
        const matchedCTA = CTAS.find(c => lower.includes(c.toLowerCase()));
        if (matchedCTA) {
            setCta(matchedCTA);
            overrides.cta = matchedCTA;
        }

        // Placement Detection
        const matchedPlacement = PLACEMENTS.find(p => lower.includes(p.toLowerCase()) || (p.includes("Instagram") && lower.includes("instagram")) || (p.includes("Facebook") && lower.includes("facebook")));
        if (matchedPlacement) {
            setPlacement(matchedPlacement);
            overrides.placement = matchedPlacement;
        }

        // Style Detection
        const matchedStyle = STYLES.find(s => lower.includes(s.toLowerCase().split(" ")[0]) || lower.includes("neon") && s.includes("Neon"));
        if (matchedStyle) {
            setStyle(matchedStyle);
            overrides.style = matchedStyle;
        }

        // Offer Detection
        if (lower.includes("% off") || lower.includes("sale") || lower.includes("discount")) {
            let newOffer = "";
            const percentMatch = lower.match(/(\d+% off)/);
            if (percentMatch) newOffer = percentMatch[0].toUpperCase();
            else if (!offer) newOffer = "Special Sale";

            if (newOffer) {
                setOffer(newOffer);
                overrides.offer = newOffer;
            }
        }

        // Fill gaps if empty (Defaults)
        if (!brandName) {
            const def = "YourBrand";
            setBrandName(def);
            overrides.brandName = def;
        }
        if (!productName) {
            const def = "Premium Product";
            setProductName(def);
            overrides.productName = def;
        }
        if (!primaryMessage) {
            setPrimaryMessage(userInput);
            overrides.primaryMessage = userInput;
        }

        // 2. Trigger Generation
        handleGenerate(overrides);

        // 3. Assistant Response
        setIsThinking(false);
        setChatHistory(prev => [...prev, {
            role: "assistant",
            content: "I've analyzed your request and auto-filled the banner configuration. The prompt is ready below!"
        }]);
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[480px,1fr] xl:grid-cols-[480px,1fr] gap-8 items-start h-full">

                    {/* LEFT PANEL: MANUAL CONTROLS */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 h-full overflow-y-auto pb-20">
                        {/* Header */}
                        <div className="mb-2">
                            <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2 mb-4">
                                <Layout className="w-5 h-5 text-primary" />
                                Banner Controls <span className="text-sm font-normal text-muted-foreground">(Manual)</span>
                            </h2>
                        </div>

                        {/* Card 1: Brand & Offer */}
                        <div className="p-5 rounded-[18px] border border-white/[0.08] bg-white/[0.02] shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <ShoppingBag className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-base">Brand & Offer</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand / Product</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Brand Name" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                        <Input placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background/40 border-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer Details</Label>
                                    <Input placeholder="e.g. 20% OFF, Summer Sale" value={offer} onChange={e => setOffer(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Call to Action (CTA)</Label>
                                    <Select value={cta} onValueChange={setCta}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CTAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Audience</Label>
                                    <Input placeholder="e.g. Gen Z, Professionals" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Placement */}
                        <div className="p-5 rounded-[18px] border border-white/[0.08] bg-white/[0.02] shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-base">Banner Placement</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
                                    <Select value={placement} onValueChange={setPlacement}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PLACEMENTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Dimensions</Label>
                                    <Select value={sizePreset} onValueChange={setSizePreset}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <Checkbox id="safeArea" checked={safeArea} onCheckedChange={(c) => setSafeArea(c === true)} className="border-white/20 data-[state=checked]:bg-primary" />
                                    <Label htmlFor="safeArea" className="text-xs font-medium cursor-pointer text-muted-foreground">Enforce Safe Area (Padding)</Label>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Visuals */}
                        <div className="p-5 rounded-[18px] border border-white/[0.08] bg-white/[0.02] shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Palette className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-base">Visual Direction</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Style Aesthetic</Label>
                                    <Select value={style} onValueChange={setStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Background Type</Label>
                                    <Select value={backgroundType} onValueChange={setBackgroundType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BACKGROUNDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Colors</Label>
                                    <Input placeholder="e.g. Modern Pink, Black, Gold" value={brandColors} onChange={e => setBrandColors(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Props / Mood</Label>
                                    <Input placeholder="e.g. Podium, Neon, Tropical Leaves" value={props} onChange={e => setProps(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Compliance (Condensed) */}
                        <div className="p-5 rounded-[18px] border border-white/[0.08] bg-white/[0.02] shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                            <h3 className="font-semibold text-sm mb-3 text-muted-foreground">Quality Check</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw1" checked={noWatermark} onCheckedChange={(c) => setNoWatermark(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw1" className="text-xs font-medium cursor-pointer text-muted-foreground">No Watermarks</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw3" checked={noDistortedLogos} onCheckedChange={(c) => setNoDistortedLogos(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw3" className="text-xs font-medium cursor-pointer text-muted-foreground">No Distorted Logos</Label>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="w-full border-white/10 bg-background/50 backdrop-blur-md hover:bg-white/10 hover:text-destructive transition-colors rounded-xl h-10"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Reset Form
                        </Button>
                    </div>

                    {/* RIGHT PANEL: ASSISTANT */}
                    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 min-h-[85vh]">
                        {/* 1) Assistant Header & Input */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                        Banner Performance Assistant <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    </h1>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        E-commerce Conversion Architect
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                    <Bot className="w-3.5 h-3.5" />
                                    <span>Online</span>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className={cn(THEME.glassCard, "p-1 rounded-[16px] shadow-lg border-primary/20 bg-background/50 backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/30 transition-all")}>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Describe your banner... e.g. Luxury skincare launch banner, 20% OFF, Instagram Story 9:16, neon premium style."
                                        value={assistantInput}
                                        onChange={e => setAssistantInput(e.target.value)}
                                        className="w-full min-h-[100px] bg-transparent border-0 resize-none text-base p-4 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAssistantSubmit();
                                            }
                                        }}
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleAssistantSubmit}
                                            disabled={loading || isThinking || !assistantInput.trim()}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                                            Auto-Fill & Generate
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Chips */}
                            <div className="flex flex-wrap gap-2">
                                {ASSISTANT_SUGGESTIONS.map((chip, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setAssistantInput(chip)}
                                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1.5"
                                    >
                                        <Zap className="w-3 h-3" />
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2) Conversation Area */}
                        <div className="flex-1 min-h-[450px] relative rounded-[16px] border border-white/[0.08] bg-white/[0.03] overflow-hidden flex flex-col shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

                            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                {chatHistory.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm">Assistant ready.</p>
                                        <p className="text-xs">Describe your banner above to start.</p>
                                    </div>
                                ) : (
                                    chatHistory.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "max-w-[85%] rounded-[18px] p-4 text-sm leading-relaxed shadow-md backdrop-blur-sm",
                                                msg.role === "user"
                                                    ? "ml-auto bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                                                    : "mr-auto bg-white/10 border border-white/5 text-slate-200 rounded-tl-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                                            )}
                                        >
                                            {msg.content}
                                        </motion.div>
                                    ))
                                )}

                                {isThinking && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mr-auto bg-white/5 border border-white/5 px-4 py-3 rounded-[18px] rounded-tl-sm flex items-center gap-2 w-fit"
                                    >
                                        <span className="text-xs text-muted-foreground font-medium">Designing banner</span>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1s_infinite_0ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1s_infinite_200ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1s_infinite_400ms]" />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </div>

                        {/* 3) Output Section */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Code2 className="w-4 h-4" /> Generated Output
                                </h2>
                                {result && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-white" onClick={() => copyToClipboard(result.text, false)}>
                                        <Copy className="w-3 h-3 mr-1.5" /> Copy Prompt
                                    </Button>
                                )}
                            </div>

                            <div className={cn(THEME.glassCard, "overflow-hidden border-primary/10 shadow-lg min-h-[300px] flex flex-col")}>
                                <Tabs defaultValue="text" className="w-full h-full flex flex-col">
                                    <div className="border-b border-white/5 bg-background/20 px-4">
                                        <TabsList className="bg-transparent border-b-0 p-0 h-10 w-full justify-start gap-4">
                                            <TabsTrigger
                                                value="text"
                                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-xs uppercase tracking-wide"
                                            >
                                                Prompt
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="json"
                                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2 text-xs uppercase tracking-wide"
                                            >
                                                JSON Spec
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="relative flex-1 bg-black/40 min-h-[300px]">
                                        <TabsContent value="text" className="m-0 h-full">
                                            <Textarea
                                                value={result?.text || ""}
                                                readOnly
                                                placeholder="Your generated banner prompt will appear here..."
                                                className="h-full w-full resize-none border-0 bg-transparent p-6 font-mono text-sm leading-relaxed text-slate-300 focus-visible:ring-0"
                                            />
                                        </TabsContent>
                                        <TabsContent value="json" className="m-0 h-full">
                                            <pre className="h-full w-full overflow-auto p-6 text-xs font-mono text-emerald-400 leading-relaxed custom-scrollbar bg-transparent">
                                                {result?.json || ""}
                                            </pre>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
