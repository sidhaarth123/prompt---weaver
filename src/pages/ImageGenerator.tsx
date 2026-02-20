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
    AlertCircle,
    Zap,
    Clock,
    Cpu,
    ChevronRight,
    Wand2,
    Share2,
    ThumbsUp,
    ThumbsDown,
    LayoutTemplate
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import AssistantTypingIndicator from "@/components/AssistantTypingIndicator";
import { callImagePromptWebhook } from "@/api/imagePromptWebhook";



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

    const [assistantInput, setAssistantInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [credits, setCredits] = useState<number | null>(null);
    const [errorType, setErrorType] = useState<'UNAUTHORIZED' | 'NO_CREDITS' | null>(null);

    const [touchedByUser, setTouchedByUser] = useState<Record<string, boolean>>({});

    const setField = (field: string, value: any, setter: (val: any) => void) => {
        setter(value);
        setTouchedByUser(prev => ({ ...prev, [field]: true }));
    };

    const [rules, setRules] = useState({
        noWatermark: false,
        noExtraText: false,
        noDistortedLogos: false,
        avoidClaims: false
    });

    const toggleRule = (key: keyof typeof rules) => {
        setRules(prev => ({ ...prev, [key]: !prev[key] }));
        setTouchedByUser(prev => ({ ...prev, [`rule_${key}`]: true }));
    };

    const resetAutofill = () => {
        setTouchedByUser({});
        toast({ title: "Autofill flags reset", description: "The assistant can now overwrite all fields again." });
    };

    const applyAutofill = (final: any) => {
        const updateIfUnlocked = (field: string, newValue: any, currentValue: any, setter: (val: any) => void) => {
            if (!touchedByUser[field] || !currentValue) {
                setter(newValue);
            }
        };

        if (final.context_format) {
            updateIfUnlocked('platform', final.context_format.platform, platform, setPlatform);
            updateIfUnlocked('aspectRatio', final.context_format.aspect_ratio, aspectRatio, setAspectRatio);
        }

        if (final.product_brief) {
            updateIfUnlocked('productName', final.product_brief.product_name, productName, setProductName);
            updateIfUnlocked('category', final.product_brief.category, category, setCategory);
            updateIfUnlocked('brandName', final.product_brief.brand_name, brandName, setBrandName);
            updateIfUnlocked('targetCustomer', final.product_brief.target_customer, targetCustomer, setTargetCustomer);
            updateIfUnlocked('benefits', final.product_brief.key_benefits_usp, benefits, setBenefits);
            updateIfUnlocked('offerBadge', final.product_brief.offer_badge, offerBadge, setOfferBadge);
            updateIfUnlocked('variants', final.product_brief.product_variants, variants, setVariants);
        }

        if (final.listing_ad_specs) {
            updateIfUnlocked('useCase', final.listing_ad_specs.use_case, useCase, setUseCase);
            updateIfUnlocked('shootType', final.listing_ad_specs.shoot_type, shootType, setShootType);
            updateIfUnlocked('amazonCompliant', final.listing_ad_specs.amazon_compliant_mode, amazonCompliant, setAmazonCompliant);
            updateIfUnlocked('textOverlay', final.listing_ad_specs.text_overlay, textOverlay, setTextOverlay);
            updateIfUnlocked('brandColors', final.listing_ad_specs.brand_colors, brandColors, setBrandColors);
            updateIfUnlocked('surface', final.listing_ad_specs.background_surface, surface, setSurface);
            updateIfUnlocked('props', final.listing_ad_specs.props, props, setProps);
            updateIfUnlocked('lightingMood', final.listing_ad_specs.lighting_mood, lightingMood, setLightingMood);
            updateIfUnlocked('framing', final.listing_ad_specs.camera_framing, framing, setFraming);
            updateIfUnlocked('compositionNotes', final.listing_ad_specs.composition_notes, compositionNotes, setCompositionNotes);
            updateIfUnlocked('headline', final.listing_ad_specs.headline_text, headline, setHeadline);
            updateIfUnlocked('cta', final.listing_ad_specs.cta_text, cta, setCta);


            const newRules = { ...rules };
            let rulesChanged = false;
            if (!touchedByUser.rule_noWatermark) { newRules.noWatermark = final.listing_ad_specs.no_watermark; rulesChanged = true; }
            if (!touchedByUser.rule_noExtraText) { newRules.noExtraText = final.listing_ad_specs.no_extra_text; rulesChanged = true; }
            if (!touchedByUser.rule_noDistortedLogos) { newRules.noDistortedLogos = final.listing_ad_specs.no_distorted_logos; rulesChanged = true; }
            if (!touchedByUser.rule_avoidClaims) { newRules.avoidClaims = final.listing_ad_specs.avoid_claims; rulesChanged = true; }
            if (rulesChanged) setRules(newRules);
        }

        if (final.subject_details) {
            updateIfUnlocked('subject', final.subject_details.subject_description, subject, setSubject);
            updateIfUnlocked('style', final.subject_details.art_style, style, setStyle);
            updateIfUnlocked('background', final.subject_details.background_scene, background, setBackground);
        }

        if (final.composition) {
            updateIfUnlocked('lighting', final.composition.lighting, lighting, setLighting);
            updateIfUnlocked('camera', final.composition.camera_angle, camera, setCamera);
            updateIfUnlocked('negative', final.composition.negative_prompt, negative, setNegative);
        }

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
        setLoading(true);
        setErrorType(null);

        try {
            const data = await callImagePromptWebhook(message);

            if (!data.success) {
                if (data.error === 'UNAUTHORIZED') {
                    setErrorType('UNAUTHORIZED');
                    toast({
                        title: "Session Expired",
                        description: "Please login again to continue.",
                        variant: "destructive",
                    });
                } else if (data.error === 'NO_CREDITS') {
                    setErrorType('NO_CREDITS');
                    toast({
                        title: "No Credits",
                        description: "You've run out of credits. Please upgrade to continue.",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Assistant Error",
                        description: data.message || "Failed to communicate with AI.",
                        variant: "destructive",
                    });
                }

                // Render error in bubble as requested
                setChatHistory(prev => [...prev, {
                    role: 'assistant',
                    content: `⚠️ Error: ${data.message || "Something went wrong. Please try again."}`
                }]);
                return;
            }

            if (data.remaining_credits !== undefined) {
                setCredits(data.remaining_credits);
            }

            // 1. Auto-fill fields from response.final
            if (data.final) {
                applyAutofill(data.final);
            }

            // 2. Handle Chat History & Questions
            let assistantResponse = "";
            if (!data.ready && data.questions && data.questions.length > 0) {
                assistantResponse = data.questions.join("\n");
            } else if (data.ready) {
                assistantResponse = "Excellent! I've prepared your premium prompt package. You can view it below.";

                if (data.prompt_package) {
                    setResult({
                        text: data.prompt_package.prompt,
                        json: JSON.stringify({
                            prompt: data.prompt_package.prompt,
                            negative_prompt: data.prompt_package.negative_prompt,
                            ...data.final
                        }, null, 2)
                    });
                }
            } else {
                assistantResponse = "Settings updated. What else would you like to add?";
            }

            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: assistantResponse
            }]);

        } catch (error: any) {
            console.error("Assistant Error:", error);
            toast({
                title: "Assistant Error",
                description: "Failed to communicate with AI. Try again.",
                variant: "destructive",
            });
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to my brain. Please try again in a moment."
            }]);
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
                        <div className="mb-2 relative">
                            {/* Trust Signal */}
                            <div className="absolute -top-12 left-0 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <div className="flex -space-x-1.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-4 h-4 rounded-full border border-[#09090b] bg-gray-${i * 100 + 400}`} style={{ backgroundColor: `hsl(260, ${i * 10}%, ${90 - i * 10}%)` }} />
                                        ))}
                                    </div>
                                    <span>Trusted by 1,000+ E-commerce creators</span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]">
                                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    Visual Engine v3.0
                                </span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/80 to-indigo-400 drop-shadow-sm">
                                    Image Prompt Generator
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-light">
                                Craft professional image prompts for <span className="text-white/80 font-medium">Midjourney</span>, <span className="text-white/80 font-medium">DALL-E 3</span>, and <span className="text-white/80 font-medium">Stable Diffusion</span> with a single click.
                            </p>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />

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
                                            setField('platform', value, setPlatform);
                                            // Automatically set aspect ratio based on platform
                                            const defaultAspectRatio = PLATFORM_ASPECT_MAP[value];
                                            if (defaultAspectRatio) {
                                                setField('aspectRatio', defaultAspectRatio, setAspectRatio);
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
                                                onClick={() => setField('aspectRatio', r.value, setAspectRatio)}
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
                                    <Input placeholder="e.g. Vitamin C Serum" value={productName} onChange={e => setField('productName', e.target.value, setProductName)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
                                    <Select value={category} onValueChange={val => setField('category', val, setCategory)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. GlowLabs" value={brandName} onChange={e => setField('brandName', e.target.value, setBrandName)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Customer</Label>
                                    <Input placeholder="e.g. Women 20-35" value={targetCustomer} onChange={e => setField('targetCustomer', e.target.value, setTargetCustomer)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Key Benefits / USP</Label>
                                <Textarea placeholder="e.g. brightens skin, reduces dark spots..." value={benefits} onChange={e => setField('benefits', e.target.value, setBenefits)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer Badge (Opt)</Label>
                                    <Input placeholder="e.g. NEW LAUNCH" value={offerBadge} onChange={e => setField('offerBadge', e.target.value, setOfferBadge)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Variants (Opt)</Label>
                                    <Input placeholder="e.g. 30ml, Rose" value={variants} onChange={e => setField('variants', e.target.value, setVariants)} className="bg-background/40 border-white/10" />
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
                                    <Select value={useCase} onValueChange={val => setField('useCase', val, setUseCase)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Shoot Type</Label>
                                    <Select value={shootType} onValueChange={val => setField('shootType', val, setShootType)}>
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
                                <Switch checked={amazonCompliant} onCheckedChange={val => setField('amazonCompliant', val, setAmazonCompliant)} />
                            </div>

                            {!amazonCompliant && (
                                <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Text Overlay</Label>
                                        <Switch checked={textOverlay} onCheckedChange={val => setField('textOverlay', val, setTextOverlay)} />
                                    </div>
                                    {textOverlay && (
                                        <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <Input placeholder="Headline Text" value={headline} onChange={e => setField('headline', e.target.value, setHeadline)} className="bg-background/40 border-white/10 h-9 text-xs" />
                                            <Input placeholder="CTA Text" value={cta} onChange={e => setField('cta', e.target.value, setCta)} className="bg-background/40 border-white/10 h-9 text-xs" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Colors</Label>
                                    <Input placeholder="e.g. #7C3AED, gold" value={brandColors} onChange={e => setField('brandColors', e.target.value, setBrandColors)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Background / Surface</Label>
                                    <Select value={surface} onValueChange={val => setField('surface', val, setSurface)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BACKGROUND_SURFACES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Props (Optional)</Label>
                                <Input placeholder="e.g. oranges, droppers, ice cubes" value={props} onChange={e => setField('props', e.target.value, setProps)} className="bg-background/40 border-white/10" />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Lighting Mood</Label>
                                    <Select value={lightingMood} onValueChange={val => setField('lightingMood', val, setLightingMood)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{LIGHTING_MOODS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Camera / Framing</Label>
                                    <Select value={framing} onValueChange={val => setField('framing', val, setFraming)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CAMERA_FRAMING.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Composition Notes</Label>
                                <Textarea placeholder="Specific notes on layout or focus..." value={compositionNotes} onChange={e => setField('compositionNotes', e.target.value, setCompositionNotes)} className="bg-background/40 border-white/10 min-h-[60px]" />
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
                                        onChange={(e) => setField('subject', e.target.value, setSubject)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[80px]"
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Art Style</Label>
                                        <Select value={style} onValueChange={val => setField('style', val, setStyle)}>
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
                                            onChange={(e) => setField('background', e.target.value, setBackground)}
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
                                    <Select value={lighting} onValueChange={val => setField('lighting', val, setLighting)}>
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
                                    <Select value={camera} onValueChange={val => setField('camera', val, setCamera)}>
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
                                    onChange={(e) => setField('negative', e.target.value, setNegative)}
                                    className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10"
                                />
                            </div>
                        </section>



                        {/* ACTIONS - REMOVED VISIBLE BUTTON, LOGIC REMAINS */}
                        {/* <div className="flex gap-4 pt-4 sticky bottom-6 z-20"> ... </div> */}

                    </div>

                    {/* RIGHT: AI ASSISTANT PANEL */}
                    <div className="flex flex-col space-y-5 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">

                        {/* 1. HEADER (Credits & Status) */}
                        <div className={cn(THEME.glassCard, "px-5 py-4 flex items-center justify-between border-primary/20 shadow-[0_4px_20px_-10px_rgba(124,58,237,0.2)]")}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                    <Wand2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-none">AI Architect</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-medium text-emerald-400">Online & Ready</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/30 transition-colors">
                                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                                    <span className="text-xs font-mono font-medium text-slate-300">
                                        <span className="text-white">{credits ?? '--'}</span>/50
                                    </span>
                                </div>
                                <div className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 hidden sm:block">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300">PRO</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Context Banner */}
                        {errorType === 'NO_CREDITS' && (
                            <div className="px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-medium text-amber-200">No credits remaining</span>
                                </div>
                                <Button size="sm" variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-7 px-3" onClick={() => window.open('/pricing', '_blank')}>
                                    Upgrade
                                </Button>
                            </div>
                        )}

                        {errorType === 'UNAUTHORIZED' && (
                            <div className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-medium text-red-200">Session expired. Please login again.</span>
                                </div>
                                <Button size="sm" variant="destructive" className="text-[10px] h-7 px-3" onClick={() => window.open('/login', '_blank')}>
                                    Login
                                </Button>
                            </div>
                        )}

                        {/* 2. CHAT & INPUT AREA */}
                        <div className="relative group/chat">
                            {/* Neon Glow underlay */}
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-purple-500/20 to-transparent rounded-2xl blur-xl opacity-50 group-hover/chat:opacity-75 transition duration-1000" />

                            <div className="relative bg-[#0F0F12]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">

                                {/* A. Suggestion Chips */}
                                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {["Amazon packshot", "Lifestyle skincare", "Minimal studio", "Neon luxury", "Bold product ad"].map((chip) => (
                                            <button
                                                key={chip}
                                                disabled={loading}
                                                onClick={() => {
                                                    setAssistantInput(chip);
                                                    // Trigger functionality on next tick to ensure state update
                                                    setTimeout(() => handleAssistantSubmit(), 0);
                                                }}
                                                className="group relative text-[10px] font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/40 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden disabled:opacity-50"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={resetAutofill} className="text-[9px] text-muted-foreground hover:text-primary underline px-2 shrink-0">
                                        Reset Autofill
                                    </button>
                                </div>


                                {/* B. Chat History */}
                                <div className="min-h-[280px] max-h-[400px] overflow-y-auto custom-scrollbar p-5 space-y-5 bg-[#0A0A0B]">
                                    {chatHistory.length === 0 && !result && (
                                        <div className="flex flex-col items-center justify-center text-center p-8 mt-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent border border-white/5 flex items-center justify-center mb-4 shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]">
                                                <Sparkles className="w-8 h-8 text-primary/40" />
                                            </div>
                                            <h4 className="text-sm font-medium text-white/80">How can I help you?</h4>
                                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                                Describe your product or upload an image to get started.
                                            </p>
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {chatHistory.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={cn(
                                                    "flex w-full",
                                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div className="flex flex-col gap-1 max-w-[85%]">
                                                    <div className={cn(
                                                        "px-5 py-3.5 text-sm shadow-lg backdrop-blur-md whitespace-pre-wrap leading-relaxed relative overflow-hidden",
                                                        msg.role === 'user'
                                                            ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-2xl rounded-tr-none border border-white/10"
                                                            : "bg-[#18181B] text-slate-300 rounded-2xl rounded-tl-none border border-white/5"
                                                    )}>
                                                        {/* Shimmer effect for user message */}
                                                        {msg.role === 'user' && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                                        )}
                                                        {msg.content}
                                                    </div>
                                                    <div className={cn("text-[9px] text-muted-foreground/40 flex items-center gap-1", msg.role === 'user' ? "justify-end pr-1" : "justify-start pl-1")}>
                                                        <Clock className="w-2.5 h-2.5" />
                                                        <span>Today</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {loading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                            <div className="bg-[#18181B] rounded-2xl rounded-tl-none px-4 py-3 border border-white/5 flex items-center gap-2 shadow-lg">
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* C. Input Area */}
                                <div className="p-3 bg-[#0F0F12] border-t border-white/5 relative z-20">
                                    <div className={cn(
                                        "relative rounded-xl border bg-black/40 transition-all duration-300 flex items-center p-1.5",
                                        "border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 focus-within:bg-black/60"
                                    )}>
                                        <Textarea
                                            placeholder="Imagine something amazing..."
                                            value={assistantInput}
                                            onChange={(e) => setAssistantInput(e.target.value)}
                                            className="min-h-[44px] w-full resize-none border-0 bg-transparent py-2.5 px-3 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/40"
                                            rows={1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAssistantSubmit();
                                                }
                                            }}
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleAssistantSubmit}
                                            disabled={loading || !assistantInput.trim()}
                                            className={cn(
                                                "h-9 w-9 shrink-0 rounded-lg transition-all duration-300",
                                                !assistantInput.trim()
                                                    ? "bg-white/5 text-muted-foreground"
                                                    : "bg-primary text-white shadow-[0_0_15px_-5px_#7c3aed] hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                    <div className="flex justify-center mt-2 pb-1">
                                        <div className="text-[10px] text-muted-foreground/40 flex items-center gap-1.5">
                                            <Cpu className="w-3 h-3" />
                                            <span>Powered by Gemini 1.5 Flash</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. GENERATE BUTTON (New) */}
                        <Button
                            onClick={handleGenerate}
                            className={cn(
                                "w-full h-12 rounded-xl text-base font-semibold shadow-2xl transition-all duration-500 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:brightness-110",
                                "border border-white/20 relative overflow-hidden group/gen"
                            )}
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/gen:translate-y-0 transition-transform duration-500" />
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Generating Premium Prompt...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 relative z-10">
                                    <Sparkles className="w-4 h-4 fill-white/20" /> Generate Final Prompt
                                </span>
                            )}
                        </Button>

                        <div className="border-t border-white/5 my-2" />

                        {/* 4. OUTPUT RESULT (Structured) */}
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="rounded-xl border border-primary/20 bg-[#09090b] shadow-2xl overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <LayoutTemplate className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold text-white tracking-widest uppercase">Output</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-white/10" onClick={() => copyToClipboard(result.text, false)}>
                                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-white/10" onClick={() => copyToClipboard(result.json, true)}>
                                                <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-white/5">
                                        {/* Extracted Fields Summary (Mocked via logic availability) */}
                                        <div className="px-5 py-4 bg-[#0F0F12]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                                                    <Check className="w-3 h-3" /> Extracted Fields
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {platform && <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">{platform}</span>}
                                                {aspectRatio && <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">{aspectRatio}</span>}
                                                {style && <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded truncate max-w-[120px]">{style}</span>}
                                            </div>
                                        </div>

                                        {/* Main Prompt */}
                                        <div className="p-5 font-mono text-xs leading-relaxed text-slate-300 relative group/prompt">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover/prompt:opacity-100 transition-opacity">
                                                <span className="text-[9px] text-muted-foreground bg-black/80 px-1.5 py-0.5 rounded">PROMPT</span>
                                            </div>
                                            {result.text}
                                        </div>

                                        {/* Negative Prompt */}
                                        <div className="p-4 bg-red-500/5">
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-red-400 uppercase">Negative Prompt</span>
                                            </div>
                                            <p className="text-[10px] text-red-200/60 font-mono leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
                                                {JSON.parse(result.json).negative_prompt || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-muted-foreground">Approx. 45 tokens</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 text-[10px] hover:text-primary hover:bg-primary/10"
                                            onClick={handleGenerate}
                                        >
                                            <RefreshCw className="w-3 h-3 mr-1.5" /> Regenerate
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-80 transition-opacity duration-500">
                                    <Layers className="w-8 h-8 text-muted-foreground/30 mb-3" />
                                    <p className="text-xs font-medium text-muted-foreground">Generated prompt will appear here</p>
                                </div>
                            )}
                        </AnimatePresence>

                    </div>

                </div>
            </main>
        </div>
    );
}
