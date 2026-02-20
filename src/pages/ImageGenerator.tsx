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
    LayoutTemplate,
    Code2,
    Type,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Aperture,
    Monitor,
    Zap,
    AlertCircle,
    ChevronRight,
    ShoppingBag,
    Tag,
    Clock,
    Wand2,
    Layers,
    Cpu
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { PremiumChatbot } from "@/components/PremiumChatbot";
import { mapImageResponseToState } from "@/mappers/imageMapper";

// --- Constants ---
const PLATFORMS = ["Meta Ads (FB/IG)", "TikTok Ads", "Google Display", "Pinterest", "Shopify Store", "Amazon Listing", "Print-on-Demand"];
const ASPECT_RATIOS = [
    { label: "1:1", value: "1:1", icon: Monitor },
    { label: "9:16", value: "9:16", icon: Monitor },
    { label: "16:9", value: "16:9", icon: Monitor },
    { label: "4:5", value: "4:5", icon: Monitor },
];
const STYLES = ["Photorealistic", "Cyberpunk", "Minimalist Studio", "Cinematic", "3D Render", "Oil Painting", "Vector Art", "Vintage Film"];
const LIGHTING_OPTIONS = ["Natural Sunlight", "Studio Softbox", "Neon / Cyber", "Golden Hour", "Moody / Dark", "High Key / Bright", "Volumetric Fog"];
const CAMERA_ANGLES = ["Eye Level", "Low Angle (Hero)", "Top Down (Flatlay)", "Close-up (Macro)", "Wide Shot", "Drone / Aerial", "Side Profile"];
const PRODUCT_CATEGORIES = ["Skincare & Beauty", "Fashion & Apparel", "Electronics & Gadgets", "Home & Furniture", "Food & Beverage", "Fitness & Sports", "Jewelry & Accessories"];
const USE_CASES = ["Main Hero Image", "Infographic / Listing", "Lifestyle Action", "Unboxing Moment", "social Media Ad", "Celebrity Style Mockup"];
const SHOOT_TYPES = ["Studio Still Life", "Outdoor Lifestyle", "Urban / Street", "Luxury Interior", "Nature / Tropical", "Minimalist Abstract"];
const BACKGROUND_SURFACES = ["Wooden Table", "Marble Countertop", "Pure White (Amazon)", "Glass / Reflective", "Soft Fabric", "Concrete / Industrial", "Sand / Beach", "Aesthetic Color Gradient"];
const LIGHTING_MOODS = ["Soft & Airy", "Dramatic Shadows", "Colorful Rim Lighting", "Harsh Direct Sun", "Cozy Warm Glow", "Cold Medical White"];
const CAMERA_FRAMING = ["Centered Bold", "Rule of Thirds", "Extreme Macro", "Wide Perspective", "Dutch Angle", "Symmetrical"];

const PLATFORM_ASPECT_MAP: Record<string, string> = {
    "Meta Ads (FB/IG)": "1:1",
    "TikTok Ads": "9:16",
    "Pinterest": "2:3",
    "Shopify Store": "3:4",
    "Amazon Listing": "1:1",
    "Google Display": "16:9",
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

    // --- E-commerce State ---
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [brandName, setBrandName] = useState("");
    const [targetCustomer, setTargetCustomer] = useState("");
    const [benefits, setBenefits] = useState("");
    const [offerBadge, setOfferBadge] = useState("");
    const [variants, setVariants] = useState("");

    const [useCase, setUseCase] = useState("");
    const [shootType, setShootType] = useState("");
    const [amazonCompliant, setAmazonCompliant] = useState(false);
    const [textOverlay, setTextOverlay] = useState(false);
    const [headline, setHeadline] = useState("");
    const [cta, setCta] = useState("");
    const [brandColors, setBrandColors] = useState("");
    const [surface, setSurface] = useState("");
    const [props, setProps] = useState("");
    const [lightingMood, setLightingMood] = useState("");
    const [framing, setFraming] = useState("");
    const [compositionNotes, setCompositionNotes] = useState("");

    const [touchedByUser, setTouchedByUser] = useState<Record<string, boolean>>({});

    const [rules, setRules] = useState({
        noWatermark: false,
        noExtraText: false,
        noDistortedLogos: false,
        avoidClaims: false
    });

    const setFieldManually = (field: string, value: any, setter: (val: any) => void) => {
        setter(value);
        setTouchedByUser(prev => ({ ...prev, [field]: true }));
    };

    const setFieldAuto = (field: string, value: any) => {
        if (touchedByUser[field]) return; // Protected

        // Rule fields
        if (field.startsWith('rule_')) {
            const ruleKey = field.replace('rule_', '') as keyof typeof rules;
            setRules(prev => ({ ...prev, [ruleKey]: !!value }));
            return;
        }

        const setters: Record<string, (val: any) => void> = {
            platform: setPlatform,
            aspectRatio: setAspectRatio,
            subject: setSubject,
            style: setStyle,
            background: setBackground,
            lighting: setLighting,
            camera: setCamera,
            negative: setNegative,
            productName: setProductName,
            category: setCategory,
            brandName: setBrandName,
            targetCustomer: setTargetCustomer,
            benefits: setBenefits,
            offerBadge: setOfferBadge,
            variants: setVariants,
            useCase: setUseCase,
            shootType: setShootType,
            amazonCompliant: setAmazonCompliant,
            textOverlay: setTextOverlay,
            headline: setHeadline,
            cta: setCta,
            brandColors: setBrandColors,
            surface: setSurface,
            props: setProps,
            lightingMood: setLightingMood,
            framing: setFraming,
            compositionNotes: setCompositionNotes
        };

        const setter = setters[field];
        if (setter) setter(value);
    };

    // --- Premium Chat Hook ---
    const {
        chatHistory,
        isLoading: assistantLoading,
        credits,
        errorStatus,
        sendMessage,
        clearChat
    } = usePromptWeaverChat({
        workflowType: 'image',
        onDataReceived: (res) => {
            if (res.final) {
                mapImageResponseToState(res.final, {}, setFieldAuto);
            }
            if (res.prompt_package) {
                setResult({
                    text: res.prompt_package.prompt,
                    json: JSON.stringify({
                        prompt: res.prompt_package.prompt,
                        negative_prompt: res.prompt_package.negative_prompt,
                        ...res.final
                    }, null, 2)
                });
            }
        }
    });

    const toggleRule = (key: keyof typeof rules) => {
        setRules(prev => ({ ...prev, [key]: !prev[key] }));
        setTouchedByUser(prev => ({ ...prev, [`rule_${key}`]: true }));
    };

    const resetAutofill = () => {
        setTouchedByUser({});
        toast({ title: "Autofill flags reset", description: "Assistant can now overwrite all fields." });
    };

    const handleGenerate = async () => {
        if ((!subject && !productName) || !platform || !style) {
            toast({
                title: "Missing fields",
                description: "Fill in Platform, Subject/Product, and Style.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            let ecomPrompt = "";
            let ecomNegative = "";

            if (productName) {
                ecomPrompt += `Product Photography of ${productName} by ${brandName || "Brand"}. Category: ${category}. `;
                if (benefits) ecomPrompt += `Key visuals highlighting: ${benefits}. `;
                if (variants) ecomPrompt += `Show variants: ${variants}. `;
                if (targetCustomer) ecomPrompt += `Targeting: ${targetCustomer}. `;
                ecomPrompt += `\nSetting: ${shootType} for ${useCase}. `;
                ecomPrompt += `Surface/Background: ${surface || background}. `;
                if (props) ecomPrompt += `Props: ${props}. `;
                if (brandColors) ecomPrompt += `Brand Palette: ${brandColors}. `;
                if (lightingMood) ecomPrompt += `Lighting: ${lightingMood}. `;
                if (framing) ecomPrompt += `Framing: ${framing}. `;
                if (compositionNotes) ecomPrompt += `Notes: ${compositionNotes}. `;

                if (amazonCompliant) {
                    ecomPrompt += "\nCRITICAL AMAZON COMPLIANCE: Pure white background (RGB 255,255,255). No text, watermarks. ";
                    ecomNegative += "text, watermark, graphics, logo, ";
                } else if (textOverlay) {
                    ecomPrompt += `\nDesign Layout: Leave negative space for text overlay. Headline: "${headline}", CTA: "${cta}". `;
                }
            }

            const finalPrompt = `${ecomPrompt}\n${subject}\n\nStyle: ${style}. Lighting: ${lighting}. Camera: ${camera}. Aspect Ratio: ${aspectRatio}. Platform: ${platform}`;

            if (rules.noWatermark) ecomNegative += "watermark, ";
            if (rules.noExtraText) ecomNegative += "text, ";

            const finalNegative = `blurry, low quality, watermark, ${ecomNegative} ${negative}`;

            setResult({
                text: finalPrompt,
                json: JSON.stringify({ prompt: finalPrompt, negative_prompt: finalNegative }, null, 2)
            });
            toast({ title: "Image prompt generated!" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
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
        setProductName("");
        setCategory("");
        setBrandName("");
        setTargetCustomer("");
        setBenefits("");
        setOfferBadge("");
        setVariants("");
        setUseCase("");
        setShootType("");
        setAmazonCompliant(false);
        setTextOverlay(false);
        setHeadline("");
        setCta("");
        setBrandColors("");
        setSurface("");
        setProps("");
        setLightingMood("");
        setFraming("");
        setCompositionNotes("");
        setRules({ noWatermark: false, noExtraText: false, noDistortedLogos: false, avoidClaims: false });
        setResult(null);
        clearChat();
        setTouchedByUser({});
    };

    const copyToClipboard = async (text: string, isJson: boolean) => {
        await navigator.clipboard.writeText(text);
        if (isJson) { setCopiedJson(true); setTimeout(() => setCopiedJson(false), 2000); }
        else { setCopiedText(true); setTimeout(() => setCopiedText(false), 2000); }
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
                        <div className="mb-2 relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]">
                                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Visual Engine v3.1
                                </span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">
                                Image Prompt Generator
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Craft professional image prompts with AI-guided precision.
                            </p>
                        </div>

                        {/* SECTION 1: CONTEXT */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Context & Format</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
                                    <Select value={platform} onValueChange={(v) => { setFieldManually('platform', v, setPlatform); setFieldManually('aspectRatio', PLATFORM_ASPECT_MAP[v] || "1:1", setAspectRatio); }}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Aspect Ratio</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {ASPECT_RATIOS.map(r => (
                                            <button key={r.value} onClick={() => setFieldManually('aspectRatio', r.value, setAspectRatio)} className={cn("p-2 rounded-lg border transition-all text-xs", aspectRatio === r.value ? "bg-primary/20 border-primary/50" : "bg-white/5 border-white/5")}>
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* E-COMMERCE PRODUCT BRIEF */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Product Brief</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Name</Label>
                                    <Input placeholder="e.g. Vitamin C Serum" value={productName} onChange={e => setFieldManually('productName', e.target.value, setProductName)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={v => setFieldManually('category', v, setCategory)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Key Benefits</Label>
                                <Textarea placeholder="e.g. brightens skin..." value={benefits} onChange={e => setFieldManually('benefits', e.target.value, setBenefits)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>
                        </section>

                        {/* LISTING SPECS */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Listing Specs</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Use Case</Label>
                                    <Select value={useCase} onValueChange={v => setFieldManually('useCase', v, setUseCase)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Shoot Type</Label>
                                    <Select value={shootType} onValueChange={v => setFieldManually('shootType', v, setShootType)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{SHOOT_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <Label>Amazon Compliant Mode</Label>
                                <Switch checked={amazonCompliant} onCheckedChange={v => setFieldManually('amazonCompliant', v, setAmazonCompliant)} />
                            </div>
                        </section>

                        <div className="pt-4">
                            <Button onClick={handleGenerate} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                                Generate Final Prompt
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: PREMIUM ASSISTANT */}
                    <div className="lg:h-[calc(100vh-120px)] lg:sticky lg:top-24">
                        <PremiumChatbot
                            chatHistory={chatHistory}
                            isLoading={assistantLoading}
                            credits={credits}
                            errorStatus={errorStatus}
                            onSendMessage={sendMessage}
                            result={result}
                            suggestions={[
                                "Modern luxury skincare campaign",
                                "Cyberpunk tech product shot",
                                "Organic food flatlay for Instagram",
                                "Minimalist app hero illustration"
                            ]}
                        />

                        <div className="mt-4 px-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetAutofill}
                                className="text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors h-6"
                            >
                                <RefreshCw className="w-3 h-3 mr-1.5" />
                                Reset Smart-Lock Flags
                            </Button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
