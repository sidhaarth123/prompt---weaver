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
    ShoppingBag,
    Tag,
    Camera,
    Palette,
    Layers,
    AlertCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import AssistantTypingIndicator from "@/components/AssistantTypingIndicator";

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

// --- E-commerce Constants ---

const PRODUCT_CATEGORIES = ["Skincare", "Beauty", "Fashion", "Electronics", "Food & Beverage", "Home & Living", "Fitness", "Kids", "Pets", "Other"];
const USE_CASES = ["Amazon Main Image (Compliant)", "Amazon Secondary (Lifestyle)", "Shopify Hero Banner", "Instagram Ad", "Google Display Banner", "Packaging Mockup", "Product Infographic (Feature Callouts)"];
const SHOOT_TYPES = ["Studio Packshot (Product Only)", "Lifestyle Scene", "Model + Product", "In-Hand / Scale Shot", "Flat Lay", "Before / After", "Infographic / Callouts"];
const BACKGROUND_SURFACES = ["White Seamless", "Soft Gradient Studio", "Marble", "Wood", "Fabric", "Acrylic / Glossy", "Bathroom", "Kitchen", "Outdoor", "Minimal Set"];
const LIGHTING_MOODS = ["Soft Studio", "High-End Cinematic", "Natural Daylight", "Moody Low-Key", "Neon / Cyber", "Golden Hour"];
const CAMERA_FRAMING = ["Front Centered", "Three-Quarter Angle", "Top-Down Flat Lay", "Close-Up Macro", "Wide Hero Shot", "In-Hand POV"];

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

    // --- Assistant State ---
    const [assistantInput, setAssistantInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);

    const [rules, setRules] = useState({
        noWatermark: false,
        noExtraText: false,
        noDistortedLogos: false,
        avoidClaims: false
    });

    const toggleRule = (key: keyof typeof rules) => {
        setRules(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAssistantSubmit = async () => {
        if (!assistantInput.trim()) return;

        const userMsg = assistantInput;
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setAssistantInput("");

        await askAssistant(userMsg);
    };

    const handleGenerate = async () => {
        // Validation: Require either Subject OR Product Name to proceed
        if ((!subject && !productName) || !platform || !style) {
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
            const response = await fetch("/api/prompt-assistant", {
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

            // Construct E-commerce Part of Prompt
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
                    ecomPrompt += "\nCRITICAL AMAZON COMPLIANCE: Pure white background (RGB 255,255,255). No text, watermarks, or graphics. Product fills 85% of frame. ";
                    ecomNegative += "text, watermark, graphics, logo, grey background, shadows, borders, ";
                } else if (textOverlay) {
                    ecomPrompt += `\nDesign Layout: Leave negative space for text overlay. Headline: "${headline}", CTA: "${cta}". `;
                    if (offerBadge) ecomPrompt += `Include badge: "${offerBadge}". `;
                }
            }

            // Append standard subject/style if not fully covered by ecom
            const finalPrompt = `${ecomPrompt}\n${subject}\n\nStyle: ${style}. Lighting: ${lighting}. Camera: ${camera}. Aspect Ratio: ${aspectRatio}. Platform: ${platform}`;

            // Ecom Specific Negative
            if (rules.noWatermark) ecomNegative += "watermark, copyright symbol, ";
            if (rules.noExtraText) ecomNegative += "text, letters, words, username, ";
            if (rules.noDistortedLogos) ecomNegative += "distorted logo, bad spelling, ";
            if (rules.avoidClaims) ecomNegative += "medical claims, fake badges, ";

            const finalNegative = `blurry, low quality, watermark, text artifacts, distorted product, extra limbs, ${ecomNegative} ${negative}`;

            // Construct the detailed JSON spec
            const jsonSpec = {
                prompt: finalPrompt,
                negative_prompt: finalNegative,
                platform,
                aspect_ratio: aspectRatio,
                subject_description: subject,
                art_style: style,
                background_scene: background,
                lighting: lighting,
                camera_angle: camera,
                ecom: {
                    product_name: productName,
                    category,
                    brand_name: brandName,
                    target_customer: targetCustomer,
                    benefits,
                    offer_badge: offerBadge,
                    variants,
                    use_case: useCase,
                    shoot_type: shootType,
                    amazon_compliant: amazonCompliant,
                    text_overlay_enabled: textOverlay,
                    headline_text: headline,
                    cta_text: cta,
                    brand_colors: brandColors,
                    background_surface: surface,
                    props,
                    lighting_mood: lightingMood,
                    camera_framing: framing,
                    composition_notes: compositionNotes,
                    rules
                }
            };

            if (data.status === "succeeded" && data.result) {
                // We override the simple API result with our richer constructed prompt
                setResult({
                    text: finalPrompt,
                    json: JSON.stringify(jsonSpec, null, 2)
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

        // Clear E-com
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
        setRules({
            noWatermark: false,
            noExtraText: false,
            noDistortedLogos: false,
            avoidClaims: false
        });

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

    async function askAssistant(message: string) {
        setLoading(true); // START LOADING FOR ASSISTANT
        const form_state = {
            platform: platform ?? "",
            aspect_ratio: aspectRatio ?? "",
            subject_description: subject ?? "",
            art_style: style ?? "",
            background_scene: background ?? "",
            lighting: lighting ?? "",
            camera_angle: camera ?? "",
            negative_prompt: negative ?? "",
            ecom: {
                product_name: productName,
                category,
                brand_name: brandName,
                target_customer: targetCustomer,
                benefits,
                offer_badge: offerBadge,
                variants,
                use_case: useCase,
                shoot_type: shootType,
                amazon_compliant: amazonCompliant,
                text_overlay_enabled: textOverlay,
                headline_text: headline,
                cta_text: cta,
                brand_colors: brandColors,
                background_surface: surface,
                props,
                lighting_mood: lightingMood,
                camera_framing: framing,
                composition_notes: compositionNotes,
                rules
            }
        };

        try {
            const res = await fetch("/api/prompt-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, form_state }),
            });

            const json = await res.json();

            if (!json?.ok) {
                throw new Error(json?.error || "Failed to generate prompt.");
            }

            const fill = json?.data?.fill || {};
            const output = json?.data?.output || {};

            // Add Assistant Response to Chat
            // We use a predefined nice success message or use something from the API if available. 
            // The API doesn't return a "message" field usually, just data. 
            // So we'll synthesize a message.
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: "I've updated the settings and generated your prompt!"
            }]);

            // ✅ Normalize aspect ratio to match your button values exactly
            const allowedAspectRatios = new Set(["1:1", "4:5", "16:9", "9:16"]);
            let ar = (fill.aspect_ratio || "").trim();
            if (!allowedAspectRatios.has(ar)) {
                const arLower = ar.toLowerCase().replace(/\s+/g, "");
                if (arLower.includes("1:1") || arLower === "1x1" || arLower === "square") ar = "1:1";
                else if (arLower.includes("4:5") || arLower === "4x5" || arLower.includes("portrait")) ar = "4:5";
                else if (arLower.includes("16:9") || arLower === "16x9" || arLower.includes("landscape")) ar = "16:9";
                else if (arLower.includes("9:16") || arLower === "9x16" || arLower.includes("vertical") || arLower.includes("story")) ar = "9:16";
            }

            // Helper for fuzzy matching options
            const matchOption = (val: string, options: string[]) => {
                if (!val) return "";
                const v = val.toLowerCase();
                // Try exact, then partial (either direction)
                return options.find(o => o.toLowerCase() === v) ||
                    options.find(o => o.toLowerCase().includes(v) || v.includes(o.toLowerCase())) ||
                    val;
            };

            // ✅ Apply fill (only if present)
            if (fill.platform) setPlatform(matchOption(fill.platform, PLATFORMS));
            if (ar) setAspectRatio(ar);
            if (fill.subject_description) setSubject(fill.subject_description);
            if (fill.art_style) setStyle(matchOption(fill.art_style, STYLES));
            if (fill.background_scene) setBackground(fill.background_scene);
            if (fill.lighting) setLighting(matchOption(fill.lighting, LIGHTING_OPTIONS));
            if (fill.camera_angle) setCamera(matchOption(fill.camera_angle, CAMERA_ANGLES));
            if (fill.negative_prompt !== undefined) setNegative(fill.negative_prompt);

            // Apply E-com Fill
            if (fill.ecom) {
                const e = fill.ecom;
                if (e.product_name) setProductName(e.product_name);
                if (e.category) setCategory(matchOption(e.category, PRODUCT_CATEGORIES));
                if (e.brand_name) setBrandName(e.brand_name);
                if (e.target_customer) setTargetCustomer(e.target_customer);
                if (e.benefits) setBenefits(e.benefits);
                if (e.offer_badge) setOfferBadge(e.offer_badge);
                if (e.variants) setVariants(e.variants);

                if (e.use_case) setUseCase(matchOption(e.use_case, USE_CASES));
                if (e.shoot_type) setShootType(matchOption(e.shoot_type, SHOOT_TYPES));
                if (typeof e.amazon_compliant === 'boolean') setAmazonCompliant(e.amazon_compliant);
                if (typeof e.text_overlay_enabled === 'boolean') setTextOverlay(e.text_overlay_enabled);
                if (e.headline_text) setHeadline(e.headline_text);
                if (e.cta_text) setCta(e.cta_text);
                if (e.brand_colors) setBrandColors(e.brand_colors);
                if (e.background_surface) setSurface(matchOption(e.background_surface, BACKGROUND_SURFACES));
                if (e.props) setProps(e.props);
                if (e.lighting_mood) setLightingMood(matchOption(e.lighting_mood, LIGHTING_MOODS));
                if (e.camera_framing) setFraming(matchOption(e.camera_framing, CAMERA_FRAMING));
                if (e.composition_notes) setCompositionNotes(e.composition_notes);

                if (e.rules) {
                    setRules(prev => ({
                        ...prev,
                        noWatermark: !!e.rules.no_watermark,
                        noExtraText: !!e.rules.no_extra_text,
                        noDistortedLogos: !!e.rules.no_distorted_logos,
                        avoidClaims: !!e.rules.avoid_claims
                    }));
                }
            }

            // Construct the detailed JSON spec
            const jsonSpec = {
                prompt: output.prompt || "",
                negative_prompt: output.negative_prompt || fill.negative_prompt || "",
                aspect_ratio: output.params?.aspect_ratio || fill.aspect_ratio || "",
                art_style: output.params?.art_style || fill.art_style || "",
                lighting: output.params?.lighting || fill.lighting || "",
                camera_angle: output.params?.camera_angle || fill.camera_angle || ""
            };

            // ✅ Apply Output Preview (map to your existing output states)
            if (output.prompt !== undefined) {
                setResult({
                    text: output.prompt,
                    json: JSON.stringify(jsonSpec, null, 2)
                });
            }

        } catch (error: any) {
            console.error("Prompt assistant error:", error);
            toast({
                title: "Assistant Error",
                description: error.message || "Failed to generate prompt.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

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

                        {/* MANUAL CONTROLS HEADER */}
                        <div className="flex items-center justify-between pb-2">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Manual Controls (Optional)
                                </h3>
                                <p className="text-xs text-muted-foreground/60 mt-0.5">
                                    You can edit fields manually or let the Assistant handle everything.
                                </p>
                            </div>
                        </div>

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

                        {/* NEW: E-COMMERCE PRODUCT BRIEF */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">E-commerce Product Brief</h3>
                                    <p className="text-xs text-muted-foreground">Detailed specs for product shots.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Name</Label>
                                    <Input placeholder="e.g. Vitamin C Serum" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. GlowLabs" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Customer</Label>
                                    <Input placeholder="e.g. Women 20-35" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Key Benefits / USP</Label>
                                <Textarea placeholder="e.g. brightens skin, reduces dark spots..." value={benefits} onChange={e => setBenefits(e.target.value)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer Badge (Opt)</Label>
                                    <Input placeholder="e.g. NEW LAUNCH" value={offerBadge} onChange={e => setOfferBadge(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Variants (Opt)</Label>
                                    <Input placeholder="e.g. 30ml, Rose" value={variants} onChange={e => setVariants(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </section>

                        {/* NEW: LISTING / AD REQUIREMENTS */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Listing / Ad Specs</h3>
                                    <p className="text-xs text-muted-foreground">Technical requirements & compliance.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Use Case</Label>
                                    <Select value={useCase} onValueChange={setUseCase}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Shoot Type</Label>
                                    <Select value={shootType} onValueChange={setShootType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{SHOOT_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Amazon Compliant Mode</Label>
                                    <p className="text-xs text-muted-foreground">Enforce white background & no text</p>
                                </div>
                                <Switch checked={amazonCompliant} onCheckedChange={setAmazonCompliant} />
                            </div>

                            {!amazonCompliant && (
                                <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Text Overlay</Label>
                                        <Switch checked={textOverlay} onCheckedChange={setTextOverlay} />
                                    </div>
                                    {textOverlay && (
                                        <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <Input placeholder="Headline Text" value={headline} onChange={e => setHeadline(e.target.value)} className="bg-background/40 border-white/10 h-9 text-xs" />
                                            <Input placeholder="CTA Text" value={cta} onChange={e => setCta(e.target.value)} className="bg-background/40 border-white/10 h-9 text-xs" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Colors</Label>
                                    <Input placeholder="e.g. #7C3AED, gold" value={brandColors} onChange={e => setBrandColors(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Background / Surface</Label>
                                    <Select value={surface} onValueChange={setSurface}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BACKGROUND_SURFACES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Props (Optional)</Label>
                                <Input placeholder="e.g. oranges, droppers, ice cubes" value={props} onChange={e => setProps(e.target.value)} className="bg-background/40 border-white/10" />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Lighting Mood</Label>
                                    <Select value={lightingMood} onValueChange={setLightingMood}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{LIGHTING_MOODS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Camera / Framing</Label>
                                    <Select value={framing} onValueChange={setFraming}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CAMERA_FRAMING.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Composition Notes</Label>
                                <Textarea placeholder="Specific notes on layout or focus..." value={compositionNotes} onChange={e => setCompositionNotes(e.target.value)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {Object.entries(rules).map(([key, val]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox id={key} checked={val} onCheckedChange={() => toggleRule(key as keyof typeof rules)} />
                                        <label htmlFor={key} className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </label>
                                    </div>
                                ))}
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


                        {/* ACTIONS - REMOVED VISIBLE BUTTON, LOGIC REMAINS */}
                        {/* <div className="flex gap-4 pt-4 sticky bottom-6 z-20"> ... </div> */}

                    </div>

                    {/* RIGHT: AI ASSISTANT PANEL */}
                    {/* RIGHT: AI ASSISTANT PANEL */}
                    <div className="lg:sticky lg:top-24 h-[calc(100vh-120px)] min-h-[600px] flex flex-col animate-in fade-in slide-in-from-right-4 duration-700 delay-100">

                        {/* 1. ASSISTANT HEADER & INPUT */}
                        <div className={cn(THEME.glassCard, "p-5 space-y-4 border-primary/20 shadow-2xl relative overflow-hidden group mb-4")}>
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 p-20 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                                        Prompt Weaver Assistant
                                    </h2>
                                    <p className="text-xs text-purple-300/80 font-medium mt-1">
                                        Auto-fill fields and generate premium e-commerce prompts
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                                </div>
                            </div>

                            {/* CHIPS */}
                            <div className="flex flex-wrap gap-2 relative z-10">
                                {["Amazon packshot", "Lifestyle skincare", "Minimal studio", "Neon luxury", "Bold product ad"].map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => setAssistantInput(chip)}
                                        className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>

                            {/* INPUT AREA */}
                            <div className="relative z-10 group/input">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl opacity-20 group-hover/input:opacity-40 transition duration-500 blur-sm" />
                                <div className="relative bg-[#0F0F12] rounded-xl p-1">
                                    <Textarea
                                        placeholder="Describe your product image... e.g. Luxury skincare serum for Instagram Story 9:16"
                                        value={assistantInput}
                                        onChange={(e) => setAssistantInput(e.target.value)}
                                        className="min-h-[80px] w-full resize-none border-0 bg-transparent p-3 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAssistantSubmit();
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center px-2 pb-2">
                                        <span className="text-[10px] text-muted-foreground/60 pl-2">Press Enter to generate</span>
                                        <Button
                                            size="sm"
                                            onClick={handleAssistantSubmit}
                                            disabled={loading || !assistantInput.trim()}
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 border-0 h-8 px-4 rounded-lg font-medium text-xs transition-all hover:scale-105 active:scale-95"
                                        >
                                            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                                            Auto-Fill & Generate
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. CHAT HISTORY (Middle) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 p-5 mb-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[inset_0_0_20px_rgba(140,90,255,0.05)] flex flex-col">
                            {chatHistory.length === 0 && !result && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-70">
                                    <Sparkles className="w-14 h-14 mb-5 text-primary/60 animate-pulse" />
                                    <p className="text-base font-semibold mb-1">Assistant Ready</p>
                                    <p className="text-sm text-muted-foreground">Type a product request above to start generating.</p>
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
                                            ? "bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white rounded-tr-sm border border-primary/20"
                                            : "bg-muted/60 text-foreground/90 rounded-tl-sm border border-white/10 shadow-[0_0_15px_rgba(140,90,255,0.05)]"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && <AssistantTypingIndicator />}
                        </div>

                        {/* DIVIDER */}
                        <div className="border-t border-white/10 pb-4" />

                        {/* 3. OUTPUT RESULT (Bottom) */}
                        <div className="shrink-0 min-h-[300px] max-h-[45%] flex flex-col">
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

                                    <Tabs defaultValue="text" className="w-full flex-1 flex flex-col">
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

                                        <div className="relative flex-1 bg-[#09090b]">
                                            <TabsContent value="text" className="m-0 h-full">
                                                <Textarea
                                                    value={result.text}
                                                    readOnly
                                                    className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-300 focus-visible:ring-0"
                                                    style={{ fontFamily: '"Geist Mono", monospace' }}
                                                />
                                            </TabsContent>
                                            <TabsContent value="json" className="m-0 h-full">
                                                <pre className="h-full w-full overflow-auto p-4 text-[10px] font-mono text-emerald-400 leading-relaxed custom-scrollbar">
                                                    {result.json}
                                                </pre>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </motion.div>
                            ) : (
                                // Placeholder for visual balance
                                <div className="h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center">
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
