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
    ShieldCheck
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

    const handleGenerate = async () => {
        if (!brandName || !productName || !category) {
            toast({
                title: "Missing fields",
                description: "Please fill in Brand Name, Product Name, and Category.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        // Simulate generation delay for effect
        setTimeout(() => {
            const prompt = `Design a high-converting e-commerce banner.
            
CONTEXT:
Brand: ${brandName}
Product: ${productName} (${category})
Target Audience: ${targetAudience}
Main Message: "${primaryMessage}"
Offer: ${offer}
CTA Button: ${cta}

FORMAT & TECH:
Placement: ${placement}
Size: ${sizePreset}
Safe Area Enforced: ${safeArea ? "YES" : "NO"}

AESTHETIC:
Style: ${style}
Background: ${backgroundType}
Brand Colors: ${brandColors}
Props/Elements: ${props}

QUALITY GUIDELINES:
- Typography: Ensure high readability, hierarchy with Headline > Subhead > CTA.
- Layout: Balanced composition, negative space for text overlay.
- E-commerce Focus: Product should be focal point, high contrast CTA.
${noWatermark ? "- No watermarks" : ""}
${noArtifacts ? "- No text artifacts" : ""}
${noDistortedLogos ? "- No distorted logos" : ""}
${avoidMisleading ? "- Authentic product representation" : ""}
`;

            const jsonSpec = {
                brand_name: brandName,
                product_name: productName,
                category: category,
                target_audience: targetAudience,
                offer: offer,
                cta: cta,
                primary_message: primaryMessage,
                placement: placement,
                size_preset: sizePreset,
                safe_area: safeArea,
                style: style,
                background_type: backgroundType,
                brand_colors: brandColors,
                props: props,
                rules: {
                    no_watermark: noWatermark,
                    no_artifacts: noArtifacts,
                    no_distorted_logos: noDistortedLogos,
                    avoid_misleading: avoidMisleading
                }
            };

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
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
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
                                    Ad Creative
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                <span className={THEME.gradientText}>Banner Prompt Generator</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Create high-converting e-commerce banner prompts for Midjourney, SDXL, and other AI tools.
                            </p>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* SECTION A: BRIEF */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Banner Brief</h3>
                                    <p className="text-xs text-muted-foreground">Core details about the product and offer.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. GlowUp" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Name</Label>
                                    <Input placeholder="e.g. Vit-C Serum" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Audience</Label>
                                    <Input placeholder="e.g. Gen Z Women" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer / Discount</Label>
                                    <Input placeholder="e.g. 20% OFF" value={offer} onChange={e => setOffer(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">CTA Button</Label>
                                    <Select value={cta} onValueChange={setCta}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CTAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Primary Message (Headline)</Label>
                                <Textarea
                                    placeholder="e.g. Summer Glow Essentials. Get radiant skin in 1 week."
                                    value={primaryMessage}
                                    onChange={e => setPrimaryMessage(e.target.value)}
                                    className="bg-background/40 border-white/10 min-h-[80px]"
                                />
                            </div>
                        </section>

                        {/* SECTION B: FORMAT */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Placement & Size</h3>
                                    <p className="text-xs text-muted-foreground">Where will this banner live?</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Placement</Label>
                                    <Select value={placement} onValueChange={setPlacement}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PLACEMENTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Size Preset</Label>
                                    <Select value={sizePreset} onValueChange={setSizePreset}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox id="safeArea" checked={safeArea} onCheckedChange={(c) => setSafeArea(c === true)} className="border-white/20 data-[state=checked]:bg-primary" />
                                <Label htmlFor="safeArea" className="text-sm font-medium cursor-pointer">Enforce Safe Area (Padding)</Label>
                            </div>
                        </section>

                        {/* SECTION C: VISUAL STYLE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Palette className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Creative Direction</h3>
                                    <p className="text-xs text-muted-foreground">Style, vibe, and colors.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Style</Label>
                                    <Select value={style} onValueChange={setStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Background</Label>
                                    <Select value={backgroundType} onValueChange={setBackgroundType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BACKGROUNDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Colors</Label>
                                    <Input placeholder="e.g. #FF5733, Teal, White" value={brandColors} onChange={e => setBrandColors(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Props / Elements</Label>
                                    <Input placeholder="e.g. Tropical leaves, podium, water splash" value={props} onChange={e => setProps(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </section>

                        {/* SECTION D: COMPLIANCE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-4 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Compliance</h3>
                                    <p className="text-xs text-muted-foreground">Quality control filters.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw1" checked={noWatermark} onCheckedChange={(c) => setNoWatermark(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw1" className="text-sm font-medium cursor-pointer">No Watermarks</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw2" checked={noArtifacts} onCheckedChange={(c) => setNoArtifacts(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw2" className="text-sm font-medium cursor-pointer">Clean Text (No Artifacts)</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw3" checked={noDistortedLogos} onCheckedChange={(c) => setNoDistortedLogos(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw3" className="text-sm font-medium cursor-pointer">No Distorted Logos</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="fw4" checked={avoidMisleading} onCheckedChange={(c) => setAvoidMisleading(c === true)} className="border-white/20" />
                                    <Label htmlFor="fw4" className="text-sm font-medium cursor-pointer">Authentic Representation</Label>
                                </div>
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
                                className={cn("flex-1 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all hover:scale-[1.02]")}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb className="w-4 h-4 mr-2 fill-current" /> Generate Banner Prompt
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
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 ring-1 ring-white/10 animate-pulse">
                                            <Layout className="h-10 w-10 text-primary/80" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Awaiting Ad Banner</h3>
                                        <p className="text-sm text-muted-foreground max-w-[260px] mt-3 leading-relaxed">
                                            Define your product, offer, and visuals to generate a high-performing banner prompt.
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
