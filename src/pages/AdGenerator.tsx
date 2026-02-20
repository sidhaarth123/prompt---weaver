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
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Megaphone,
    MousePointerClick,
    Target,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Layers,
    Monitor,
    Lightbulb,
    ShoppingBag,
    TrendingUp,
    Bot,
    ArrowUp,
    Code2,
    Music,
    Video,
    Smartphone
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import AssistantTypingIndicator from "@/components/AssistantTypingIndicator";

// --- Constants ---

const PLATFORMS = [
    "Meta Ads (Facebook/Instagram)",
    "Google Ads (YouTube/Display)",
    "TikTok Ads",
    "Pinterest Ads",
    "LinkedIn Ads",
    "Snapchat Ads"
];

const PLACEMENTS = [
    "Feed (Image/Video)",
    "Story / Reels (9:16)",
    "YouTube Shorts",
    "Display Banner",
    "Search (Text)",
    "Collection / Catalog",
    "Carousel"
];

const OBJECTIVES = [
    "Sales / Conversions",
    "Leads Generation",
    "Brand Awareness",
    "Traffic / Clicks",
    "App Installs",
    "Retargeting"
];

const ASPECT_RATIOS = ["1:1 (Square)", "4:5 (Portrait)", "9:16 (Vertical)", "16:9 (Landscape)"];

const CATEGORIES = [
    "Skincare & Beauty",
    "Fashion & Apparel",
    "Electronics & Gadgets",
    "Fitness & Wellness",
    "Food & Beverage",
    "Home & Decor",
    "Digital Product / SaaS",
    "Other"
];

const OFFER_TYPES = [
    "Percentage OFF (e.g. 20%)",
    "Free Shipping",
    "Bundle Deal (BOGO)",
    "New Launch / Drop",
    "Limited Time Flash Sale",
    "Free Gift with Purchase",
    "No Offer (Brand focus)"
];

const TARGET_AUDIENCES_EXAMPLES = [
    "Women 18-34, beauty enthusiasts",
    "Tech-savvy professionals, 25-45",
    "Fitness beginners looking for weight loss",
    "Homeowners interested in decor",
    "Parents of toddlers"
];

const TONES = [
    "Luxury & Premium",
    "Minimal & Clean",
    "Bold & High Energy",
    "UGC / Authentic",
    "Direct Response / Salesy",
    "Humorous & Witty",
    "Educational / Trust"
];

const VISUAL_STYLES = [
    "High-end Studio Photography",
    "User Generated Content (UGC)",
    "Lifestyle / In-context",
    "Minimalist Geometry",
    "Neon / Cyberpunk",
    "Text-Heavy / Graphic",
    "Collage / Mixed Media"
];

const HOOK_STYLES = [
    "Problem → Solution",
    "Social Proof / Testimonial",
    "Us vs Them (Comparison)",
    "Unboxing / Demo",
    "Offer-First (Flash Sale)",
    "Educational / How-to",
    "Shock / Pattern Interrupt"
];

const CTA_OPTIONS = [
    "Shop Now",
    "Buy Now",
    "Learn More",
    "Sign Up",
    "Get Offer",
    "Order Now",
    "Watch More"
];

const AD_TYPES = [
    "Static Image Ad",
    "UGC Video Ad Script",
    "Carousel Ad (Multi-card)",
    "Short-form Video Script",
    "Collection Ad"
];

const VIDEO_LENGTHS = ["6s (Bumper)", "15s (Story)", "30s (Feed)", "60s (Long form)"];

const SECTIONS = [
    "Hook / Attention Grabber",
    "Problem Agitation",
    "Solution / Product Intro",
    "Key Benefits",
    "Social Proof / Trust",
    "Offer Details",
    "Call to Action (CTA)"
];

export default function AdGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // --- State ---
    const [assistantInput, setAssistantInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Card 1: Campaign Basics
    const [platform, setPlatform] = useState("");
    const [placement, setPlacement] = useState("");
    const [objective, setObjective] = useState("");
    const [aspectRatio, setAspectRatio] = useState("");

    // Card 2: Product & Offer
    const [brandName, setBrandName] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [benefit, setBenefit] = useState("");
    const [offerType, setOfferType] = useState("");
    const [offerDetails, setOfferDetails] = useState("");
    const [price, setPrice] = useState("");

    // Card 3: Audience & Angle
    const [targetAudience, setTargetAudience] = useState("");
    const [painPoint, setPainPoint] = useState("");
    const [emotion, setEmotion] = useState("");
    const [tone, setTone] = useState("");

    // Card 4: Creative Direction
    const [visualStyle, setVisualStyle] = useState("");
    const [hookStyle, setHookStyle] = useState("");
    const [cta, setCta] = useState("");
    const [onScreenText, setOnScreenText] = useState("");
    const [music, setMusic] = useState("");
    const [negativeConstraints, setNegativeConstraints] = useState("");

    // Card 5: Output Type
    const [adType, setAdType] = useState("");
    const [videoLength, setVideoLength] = useState("");
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isThinking, loading]);

    // Toggles
    const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
    };

    const handleAssistantSubmit = async () => {
        if (!assistantInput.trim() || loading || isThinking) return;

        const input = assistantInput;
        setAssistantInput("");
        setChatHistory(prev => [...prev, { role: 'user', content: input }]);
        setIsThinking(true);

        try {
            await askAdAssistant(input);
            setIsThinking(false);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Generated! I've updated the fields and created your ad concepts." }]);
        } catch (error) {
            setIsThinking(false);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an issue generating the ad. Please try again." }]);
        }
    };

    const handleClear = () => {
        setPlatform("");
        setPlacement("");
        setObjective("");
        setAspectRatio("");
        setBrandName("");
        setProductName("");
        setCategory("");
        setBenefit("");
        setOfferType("");
        setOfferDetails("");
        setPrice("");
        setTargetAudience("");
        setPainPoint("");
        setEmotion("");
        setTone("");
        setVisualStyle("");
        setHookStyle("");
        setCta("");
        setOnScreenText("");
        setMusic("");
        setNegativeConstraints("");
        setAdType("");
        setVideoLength("");
        setSelectedSections([]);
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

    async function askAdAssistant(message: string) {
        const form_state = {
            ad: {
                campaign: {
                    platform,
                    placement,
                    objective,
                    aspect_ratio: aspectRatio
                },
                product: {
                    brand_name: brandName,
                    product_name: productName,
                    category,
                    benefit,
                    offer_type: offerType,
                    offer_details: offerDetails,
                    price
                },
                audience: {
                    target: targetAudience,
                    pain_point: painPoint,
                    emotion,
                    tone
                },
                creative: {
                    visual_style: visualStyle,
                    hook_style: hookStyle,
                    cta,
                    on_screen_text: onScreenText,
                    music,
                    negative_constraints: negativeConstraints
                },
                output: {
                    ad_type: adType,
                    video_length: videoLength,
                    sections: selectedSections
                }
            }
        };

        // Reuse the logic structure from other generators
        // NOTE: Wiring to generic endpoint or ad-specific one. 
        // Using /api/ad-prompt-assistant assuming it exists or will be handled by the backend router.
        const res = await fetch("/api/ad-prompt-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, form_state }),
        });

        // Fallback to simulate response if endpoint missing for Frontend Demo
        if (res.status === 404) {
            // Simulation Logic for preview purposes if API is not yet live
            await new Promise(r => setTimeout(r, 2000));
            // Mock fill
            if (!brandName) setBrandName("BrandX");
            if (!platform) setPlatform("Meta Ads");
            setResult({
                text: "Here is your generated ad script based on the inputs...",
                json: JSON.stringify({ mock: "data" }, null, 2)
            });
            return;
        }

        const json = await res.json();

        if (!res.ok || !json.ok) {
            toast({
                title: "Assistant Error",
                description: json.error || "Failed to generate ad.",
                variant: "destructive",
            });
            return;
        }

        const data = json.data || {};
        const fill = data.fill || {};
        const output = data.output || {};

        // Auto-fill logic (simplified for brevity)
        const c = fill.campaign || {};
        if (c.platform) setPlatform(c.platform);
        if (c.placement) setPlacement(c.placement);
        if (c.objective) setObjective(c.objective);
        if (c.aspect_ratio) setAspectRatio(c.aspect_ratio);

        const p = fill.product || {};
        if (p.brand_name) setBrandName(p.brand_name);
        if (p.product_name) setProductName(p.product_name);
        if (p.category) setCategory(p.category);
        if (p.benefit) setBenefit(p.benefit);
        if (p.offer_type) setOfferType(p.offer_type);
        if (p.offer_details) setOfferDetails(p.offer_details);
        if (p.price) setPrice(p.price);

        const a = fill.audience || {};
        if (a.target) setTargetAudience(a.target);
        if (a.pain_point) setPainPoint(a.pain_point);
        if (a.emotion) setEmotion(a.emotion);
        if (a.tone) setTone(a.tone);

        const cr = fill.creative || {};
        if (cr.visual_style) setVisualStyle(cr.visual_style);
        if (cr.hook_style) setHookStyle(cr.hook_style);
        if (cr.cta) setCta(cr.cta);
        if (cr.on_screen_text) setOnScreenText(cr.on_screen_text);
        if (cr.music) setMusic(cr.music);

        const o = fill.output || {};
        if (o.ad_type) setAdType(o.ad_type);
        if (o.video_length) setVideoLength(o.video_length);
        if (o.sections) setSelectedSections(o.sections);


        // Output Preview
        if (output.prompt) {
            setResult({
                text: output.prompt,
                json: JSON.stringify(output.json_spec || {}, null, 2)
            });
        }
    }

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">

                    {/* LEFT: INPUTS */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header */}
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Megaphone className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Ad Prompt Generator
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                <span className={THEME.gradientText}>E-commerce Ad Architect</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Create high-converting ad scripts and prompts for Meta, TikTok, and Google Ads.
                            </p>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* CARD 1: CAMPAIGN BASICS */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Campaign Basics</h3>
                                    <p className="text-xs text-muted-foreground">Platform, objective, and format.</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
                                    <Select value={platform} onValueChange={setPlatform}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select platform..." /></SelectTrigger>
                                        <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Placement</Label>
                                    <Select value={placement} onValueChange={setPlacement}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select placement..." /></SelectTrigger>
                                        <SelectContent>{PLACEMENTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Objective</Label>
                                    <Select value={objective} onValueChange={setObjective}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select objective..." /></SelectTrigger>
                                        <SelectContent>{OBJECTIVES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Aspect Ratio</Label>
                                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select ratio..." /></SelectTrigger>
                                        <SelectContent>{ASPECT_RATIOS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* CARD 2: PRODUCT & OFFER */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Product & Offer</h3>
                                    <p className="text-xs text-muted-foreground">What are we selling and what's the deal?</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. AuraGlow" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Name</Label>
                                    <Input placeholder="e.g. Vitamin C Serum" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select category..." /></SelectTrigger>
                                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Price Point (Optional)</Label>
                                    <Input placeholder="e.g. $49.99" value={price} onChange={e => setPrice(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Core Benefit</Label>
                                <Input placeholder="e.g. Brightens skin in 7 days" value={benefit} onChange={e => setBenefit(e.target.value)} className="bg-background/40 border-white/10" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer Type</Label>
                                    <Select value={offerType} onValueChange={setOfferType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select offer..." /></SelectTrigger>
                                        <SelectContent>{OFFER_TYPES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer Details</Label>
                                    <Input placeholder="e.g. 20% OFF code: SAVE20" value={offerDetails} onChange={e => setOfferDetails(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </section>

                        {/* CARD 3: AUDIENCE & ANGLE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Audience & Angle</h3>
                                    <p className="text-xs text-muted-foreground">Who is this for and how should they feel?</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Audience</Label>
                                <Input placeholder="e.g. Busy moms aged 30-45" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="bg-background/40 border-white/10" />
                            </div>
                            <div className="grid sm:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pain Point</Label>
                                    <Input placeholder="e.g. Tired looking eyes" value={painPoint} onChange={e => setPainPoint(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Desired Emotion</Label>
                                    <Input placeholder="e.g. Confident, Relieved" value={emotion} onChange={e => setEmotion(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tone</Label>
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select tone..." /></SelectTrigger>
                                        <SelectContent>{TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* CARD 4: CREATIVE DIRECTION */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Creative Direction</h3>
                                    <p className="text-xs text-muted-foreground">Visuals, hooks, and style.</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Style</Label>
                                    <Select value={visualStyle} onValueChange={setVisualStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select style..." /></SelectTrigger>
                                        <SelectContent>{VISUAL_STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hook Style</Label>
                                    <Select value={hookStyle} onValueChange={setHookStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select hook..." /></SelectTrigger>
                                        <SelectContent>{HOOK_STYLES.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">CTA Button</Label>
                                    <Select value={cta} onValueChange={setCta}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select CTA..." /></SelectTrigger>
                                        <SelectContent>{CTA_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">On-Screen Text</Label>
                                    <Input placeholder="e.g. 'Best Serum 2024'" value={onScreenText} onChange={e => setOnScreenText(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Music / SFX</Label>
                                    <Input placeholder="e.g. Upbeat pop, ASMR crunch" value={music} onChange={e => setMusic(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Negative Constraints</Label>
                                    <Input placeholder="e.g. No fake testimonials" value={negativeConstraints} onChange={e => setNegativeConstraints(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </section>

                        {/* CARD 5: OUTPUT TYPE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Output Format</h3>
                                    <p className="text-xs text-muted-foreground">Ad type and required sections.</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Ad Type</Label>
                                    <Select value={adType} onValueChange={setAdType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select ad type..." /></SelectTrigger>
                                        <SelectContent>{AD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Length (if Video)</Label>
                                    <Select value={videoLength} onValueChange={setVideoLength}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select length..." /></SelectTrigger>
                                        <SelectContent>{VIDEO_LENGTHS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Included Sections</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {SECTIONS.map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => toggleSelection(section, selectedSections, setSelectedSections)}
                                            className={cn(
                                                "group relative flex items-center justify-between text-xs font-medium px-4 py-3 rounded-xl border transition-all duration-200 text-left",
                                                selectedSections.includes(section)
                                                    ? "bg-primary/10 border-primary/50 text-foreground ring-1 ring-primary/20"
                                                    : "bg-background/30 border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10"
                                            )}
                                        >
                                            {section}
                                            {selectedSections.includes(section) && (
                                                <Check className="w-3.5 h-3.5 text-primary animate-in zoom-in" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Manual Controls</h3>
                            <span className="text-xs text-muted-foreground/60 italic">AI Assistant can auto-fill this entire form</span>
                        </div>

                        <div className="flex gap-4 pt-4 sticky bottom-6 z-20">
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                className="h-12 px-6 border-white/10 bg-background/50 backdrop-blur-md hover:bg-white/10 hover:text-destructive transition-colors rounded-xl"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Clear
                            </Button>
                        </div>

                    </div>

                    {/* RIGHT: AD ASSISTANT PANEL */}
                    <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">

                        {/* 1. HEADER (Title + Chips) */}
                        <div className={cn(THEME.glassCard, "p-5 space-y-4 border-primary/20 relative overflow-hidden group")}>
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 p-20 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 flex items-center gap-2">
                                        <Bot className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                                        Prompt Weaver Assistant <span className="text-[10px] text-muted-foreground/50 font-mono">v3</span>
                                    </h2>
                                    <p className="text-xs text-indigo-300/80 font-medium mt-1">
                                        Auto-fill and generate high-converting ads
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                                </div>
                            </div>

                            {/* CHIPS */}
                            <div className="flex flex-wrap gap-2 relative z-10">
                                {["UGC conversion ad", "Luxury product ad", "Discount offer ad", "Problem-solution ad", "Testimonial ad"].map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => setAssistantInput(chip)}
                                        className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. STICKY INPUT */}
                        <div className="sticky top-24 z-30 group/input">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover/input:opacity-40 transition duration-500 blur-sm" />
                            <div className="relative bg-[#0F0F12] rounded-xl p-1 shadow-2xl border border-white/10">
                                <Textarea
                                    placeholder="Describe your ad concept... e.g. 15s UGC video for skincare serum, targeting young adults..."
                                    value={assistantInput}
                                    onChange={(e) => setAssistantInput(e.target.value)}
                                    className="min-h-[80px] w-full resize-none border-0 bg-transparent p-3 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAssistantSubmit();
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center px-2 pb-2">
                                    <span className="text-[10px] text-muted-foreground/60 pl-2">Press Enter to generate</span>
                                    <Button
                                        size="sm"
                                        onClick={handleAssistantSubmit}
                                        disabled={loading || isThinking || !assistantInput.trim()}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 border-0 h-8 px-4 rounded-lg font-medium text-xs transition-all hover:scale-105 active:scale-95"
                                    >
                                        {(loading || isThinking) ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                        Auto-Fill & Generate
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 3. CHAT MESSAGES (Scrollable) */}
                        <div className="min-h-[320px] max-h-[420px] overflow-y-auto custom-scrollbar space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[inset_0_0_22px_rgba(99,102,241,0.10)] flex flex-col">
                            {chatHistory.length === 0 && !result && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-70 mt-12">
                                    <Sparkles className="w-10 h-10 mb-4 text-primary/60 animate-pulse" />
                                    <p className="text-[15px] font-medium mb-1">Director Assistant Ready</p>
                                    <p className="text-sm text-muted-foreground">Type an ad concept above to start.</p>
                                </div>
                            )}
                            {chatHistory.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex w-full mb-2",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md backdrop-blur-md leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm border border-primary/20"
                                            : "bg-muted/60 text-foreground/90 rounded-tl-sm border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && <AssistantTypingIndicator />}
                        </div>

                        {/* DIVIDER */}
                        <div className="border-t border-white/10 pb-4" />

                        {/* 4. OUTPUT RESULT (Bottom) */}
                        <div className="h-auto min-h-[300px] mt-4 flex flex-col">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className={cn(THEME.glassCard, "flex-1 overflow-hidden flex flex-col shadow-2xl border-primary/20 rounded-xl relative")}
                                >
                                    {/* Soft Glow Border */}
                                    <div className="absolute inset-0 border border-primary/20 rounded-xl pointer-events-none z-20" />

                                    <Tabs defaultValue="text" className="w-full h-auto flex flex-col">
                                        <div className="border-b border-white/5 bg-background/40 px-3 py-2 backdrop-blur-sm flex justify-between items-center">
                                            <TabsList className="bg-transparent border-0 p-0 h-auto gap-2">
                                                <TabsTrigger value="text" className="data-[state=active]:bg-primary/20 h-7 text-[10px] px-3 rounded-full">PROMPT</TabsTrigger>
                                                <TabsTrigger value="json" className="data-[state=active]:bg-primary/20 h-7 text-[10px] px-3 rounded-full">JSON SPEC</TabsTrigger>
                                            </TabsList>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyToClipboard(result.text, false)}>
                                                    <Copy className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="relative h-auto min-h-[300px] bg-[#09090b]">
                                            <TabsContent value="text" className="m-0 h-full">
                                                <div className="h-full w-full p-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words border-0 bg-transparent" style={{ fontFamily: '"Geist Mono", monospace' }}>
                                                    {result.text}
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="json" className="m-0 h-full">
                                                <pre className="h-full w-full overflow-auto p-4 text-[10px] font-mono text-emerald-400 leading-relaxed custom-scrollbar whitespace-pre-wrap break-all">
                                                    {result.json}
                                                </pre>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </motion.div>
                            ) : (
                                // Placeholder for visual balance
                                <div className="h-32 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground/30">Output will appear here</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
