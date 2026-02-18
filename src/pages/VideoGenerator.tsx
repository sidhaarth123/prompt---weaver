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
    ShoppingBag,
    TrendingUp
} from "lucide-react";
import VideoAssistantWidget from "@/components/VideoAssistantWidget";

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

// --- E-commerce Constants ---

const PRODUCT_CATEGORIES = ["Skincare", "Beauty", "Fashion", "Electronics", "Food & Beverage", "Home", "Fitness", "Kids", "Pets", "Other"];
const CAMPAIGN_OBJECTIVES = ["Drive Sales", "Increase Conversions", "Brand Awareness", "Retargeting", "Launch Campaign", "Limited Offer Push"];
const HOOK_STYLES = ["Problem-Solution", "Bold Claim", "Scroll Stopper", "Before / After", "Testimonial Hook", "Question Hook", "Shocking Fact"];
const CALL_TO_ACTIONS = ["Shop Now", "Buy Now", "Limited Time Offer", "Order Today", "Claim Discount", "Learn More"];
const URGENCY_STYLES = ["Limited Stock", "Flash Sale", "Today Only", "Seasonal Offer", "New Launch"];
const SOCIAL_PROOF_TYPES = ["Customer Reviews", "Star Ratings", "Influencer Testimonial", "UGC Style", "Before/After Proof"];
const AD_TONES = ["Aggressive Sales", "Premium Luxury", "Friendly UGC", "Educational", "High Energy", "Trustworthy / Clinical"];
const VIDEO_PACING = ["Fast Cut (1–2s per shot)", "Medium Pace", "Slow Cinematic"];
const VISUAL_FOCUS = ["Product Close-ups", "Lifestyle Focus", "Model Focus", "Feature Callouts", "Text Heavy Ad"];

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
    const [template, setTemplate] = useState("");

    // Audio toggles
    const [voiceover, setVoiceover] = useState(false);
    const [voiceTone, setVoiceTone] = useState("");
    const [music, setMusic] = useState(false);
    const [musicVibe, setMusicVibe] = useState("");

    const [negative, setNegative] = useState("");

    // --- E-commerce State ---
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [brandName, setBrandName] = useState("");
    const [targetCustomer, setTargetCustomer] = useState("");
    const [benefits, setBenefits] = useState("");
    const [offer, setOffer] = useState("");
    const [price, setPrice] = useState("");
    const [variants, setVariants] = useState("");

    const [objective, setObjective] = useState("");
    const [hookStyle, setHookStyle] = useState("");
    const [cta, setCta] = useState("");
    const [urgency, setUrgency] = useState("");
    const [socialProof, setSocialProof] = useState("");

    const [adTone, setAdTone] = useState("");
    const [pacing, setPacing] = useState("");
    const [focus, setFocus] = useState("");
    const [amazonCompliant, setAmazonCompliant] = useState(false);

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

        // Validation: Require either Scene Beats OR Product Name to proceed
        if ((!beats && !productName) || !platform || !style) {
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
            const response = await fetch("/api/video-prompt-assistant", {
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

            // Construct E-commerce Part of Prompt
            let ecomPrompt = "";
            let ecomNegative = "";

            if (productName) {
                ecomPrompt += `Video Ad for ${productName} by ${brandName || "Brand"}. Category: ${category}. `;
                if (objective) ecomPrompt += `Objective: ${objective}. `;
                if (benefits) ecomPrompt += `Key Selling Points: ${benefits}. `;
                if (variants) ecomPrompt += `Show variants: ${variants}. `;
                if (targetCustomer) ecomPrompt += `Target Audience: ${targetCustomer}. `;
                if (offer) ecomPrompt += `Offer: ${offer}. `;
                if (price) ecomPrompt += `Price Point: ${price}. `;

                ecomPrompt += `\nStructure: ${hookStyle} Hook. `;
                ecomPrompt += `Tone: ${adTone}. Pacing: ${pacing}. Visual Focus: ${focus}. `;
                ecomPrompt += `Core Elements: ${socialProof} features. Urgency: ${urgency}. `;
                ecomPrompt += `Primary CTA: "${cta}". `;

                if (amazonCompliant) {
                    ecomPrompt += "\nCRITICAL AMAZON COMPLIANCE: No exaggerated claims. No misleading warranty info. No fake reviews. Professional/Commercial standard. ";
                    ecomNegative += "fake reviews, blurry, misleading text, ";
                }
            }

            const finalPrompt = `${ecomPrompt}\nScript Beats:\n${beats}\n\nStyle: ${style}. Platform: ${platform}. Ratio: ${aspectRatio}. Duration: ${duration[0]}s.\nvisuals: ${visuals}\nOverlay Text: ${textOverlay}\nHook Text: ${hook}`;

            // Construct the detailed JSON spec
            const jsonSpec = {
                product: {
                    name: productName,
                    category,
                    brand: brandName,
                    target_customer: targetCustomer,
                    benefits,
                    offer_badge: offer,
                    price
                },
                campaign: {
                    objective,
                    placement: platform,
                    hook_style: hookStyle,
                    cta,
                    urgency,
                    social_proof: socialProof
                },
                production: {
                    ad_tone: adTone,
                    pacing,
                    visual_focus: focus,
                    duration: `~${duration[0]}s`,
                    aspect_ratio: aspectRatio,
                    style
                },
                script: {
                    hook_text: hook,
                    beats,
                    visual_notes: visuals,
                    audio: {
                        voiceover: voiceover,
                        music: music
                    }
                }
            };

            if (data.status === "succeeded" && data.result) {
                setResult({
                    text: finalPrompt,
                    json: JSON.stringify(jsonSpec, null, 2)
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
        setTemplate("");

        // Clear E-com
        setProductName("");
        setCategory("");
        setBrandName("");
        setTargetCustomer("");
        setBenefits("");
        setOffer("");
        setPrice("");
        setVariants("");
        setObjective("");
        setHookStyle("");
        setCta("");
        setUrgency("");
        setSocialProof("");
        setAdTone("");
        setPacing("");
        setFocus("");
        setAmazonCompliant(false);

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

    async function askVideoAssistant(message: string) {
        const form_state = {
            platform,
            video_style: style,
            aspect_ratio: aspectRatio,
            duration: duration[0],
            template: "", // not tracking template state explicitly
            hook,
            scene_beats: beats,
            visual_details: visuals,
            characters_props: characters,
            on_screen_text: textOverlay,
            voiceover,
            music_sfx: music,
            negative_constraints: negative,
            ecom: {
                product_name: productName,
                category,
                brand_name: brandName,
                target_customer: targetCustomer,
                benefits,
                offer,
                price,
                variants,
                campaign_objective: objective,
                hook_style: hookStyle,
                cta,
                urgency,
                social_proof: socialProof,
                ad_tone: adTone,
                pacing,
                visual_focus: focus,
                amazon_compliant: amazonCompliant
            }
        };


        const res = await fetch("http://localhost:5000/api/video-prompt-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, form_state }),
        });

        const json = await res.json();

        if (!json.ok) {
            toast({
                title: "Assistant Error",
                description: json.error || "Failed to generate video prompt.",
                variant: "destructive",
            });
            return;
        }

        const fill = json.data.fill || {};
        const output = json.data.output || {};

        // Helper for fuzzy matching options
        const matchOption = (val: string, options: string[]) => {
            if (!val) return "";
            const v = val.toLowerCase();
            // Try exact, then partial (either direction)
            return options.find(o => o.toLowerCase() === v) ||
                options.find(o => o.toLowerCase().includes(v) || v.includes(o.toLowerCase())) ||
                val;
        };

        // Apply Fill
        if (fill.platform) setPlatform(matchOption(fill.platform, PLATFORMS));
        if (fill.video_style) setStyle(matchOption(fill.video_style, STYLES));
        if (fill.aspect_ratio) setAspectRatio(fill.aspect_ratio); // already normalized by backend
        if (fill.duration) setDuration([Number(fill.duration)]);

        // Handle Template (Set state but don't apply logic to avoid overwriting assistant's specific details)
        const templateOptions = TEMPLATES.map(t => t.label);
        if (fill.template) setTemplate(matchOption(fill.template, templateOptions));

        if (fill.hook) setHook(fill.hook);
        if (fill.scene_beats) setBeats(fill.scene_beats);
        if (fill.visual_details) setVisuals(fill.visual_details);
        if (fill.characters_props) setCharacters(fill.characters_props);
        if (fill.on_screen_text) setTextOverlay(fill.on_screen_text);
        if (fill.negative_constraints) setNegative(fill.negative_constraints);

        if (typeof fill.voiceover === 'boolean') setVoiceover(fill.voiceover);
        if (typeof fill.music_sfx === 'boolean') setMusic(fill.music_sfx);

        // Apply E-com Fill
        if (fill.ecom) {
            const e = fill.ecom;
            if (e.product_name) setProductName(e.product_name);
            if (e.category) setCategory(matchOption(e.category, PRODUCT_CATEGORIES));
            if (e.brand_name) setBrandName(e.brand_name);
            if (e.target_customer) setTargetCustomer(e.target_customer);
            if (e.benefits) setBenefits(e.benefits);
            if (e.offer) setOffer(e.offer);
            if (e.price) setPrice(e.price);
            if (e.variants) setVariants(e.variants);

            if (e.campaign_objective) setObjective(matchOption(e.campaign_objective, CAMPAIGN_OBJECTIVES));
            if (e.hook_style) setHookStyle(matchOption(e.hook_style, HOOK_STYLES));
            if (e.cta) setCta(matchOption(e.cta, CALL_TO_ACTIONS));
            if (e.urgency) setUrgency(matchOption(e.urgency, URGENCY_STYLES));
            if (e.social_proof) setSocialProof(matchOption(e.social_proof, SOCIAL_PROOF_TYPES));

            if (e.ad_tone) setAdTone(matchOption(e.ad_tone, AD_TONES));
            if (e.pacing) setPacing(matchOption(e.pacing, VIDEO_PACING));
            if (e.visual_focus) setFocus(matchOption(e.visual_focus, VISUAL_FOCUS));

            if (typeof e.amazon_compliant === 'boolean') setAmazonCompliant(e.amazon_compliant);
        }

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
                                <Select value={template} onValueChange={(val) => {
                                    setTemplate(val);
                                    applyTemplate(val);
                                }}>
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

                        {/* NEW: E-COMMERCE PRODUCT BRIEF */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">E-commerce Product Brief</h3>
                                    <p className="text-xs text-muted-foreground">Detailed specs for product / offer.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Name</Label>
                                    <Input placeholder="e.g. Smart Watch Pro" value={productName} onChange={e => setProductName(e.target.value)} className="bg-background/40 border-white/10" />
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
                                    <Input placeholder="e.g. ApexGear" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Customer</Label>
                                    <Input placeholder="e.g. Runners, Tech Enthusiasts" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Key Benefits / USPs</Label>
                                <Textarea placeholder="e.g. waterproof, 7-day battery, sleep tracking..." value={benefits} onChange={e => setBenefits(e.target.value)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Offer (Opt)</Label>
                                    <Input placeholder="e.g. 50% OFF" value={offer} onChange={e => setOffer(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Price (Opt)</Label>
                                    <Input placeholder="e.g. $49" value={price} onChange={e => setPrice(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Variants (Opt)</Label>
                                    <Input placeholder="e.g. Black, Silver" value={variants} onChange={e => setVariants(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                        </section>

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

                            <div className="grid sm:grid-cols-2 gap-5 mb-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Campaign Objective</Label>
                                    <Select value={objective} onValueChange={setObjective}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CAMPAIGN_OBJECTIVES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hook Style</Label>
                                    <Select value={hookStyle} onValueChange={setHookStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{HOOK_STYLES.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
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
                                    <Input
                                        placeholder="e.g. Stop scrolling! You won't believe this..."
                                        value={hook}
                                        onChange={(e) => setHook(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Call To Action</Label>
                                        <Select value={cta} onValueChange={setCta}>
                                            <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>{CALL_TO_ACTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Urgency</Label>
                                        <Select value={urgency} onValueChange={setUrgency}>
                                            <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>{URGENCY_STYLES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Social Proof</Label>
                                        <Select value={socialProof} onValueChange={setSocialProof}>
                                            <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>{SOCIAL_PROOF_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
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

                        {/* NEW: PERFORMANCE OPTIMIZATION */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Performance & Conversion</h3>
                                    <p className="text-xs text-muted-foreground">Optimize for ads and retention.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Ad Tone</Label>
                                    <Select value={adTone} onValueChange={setAdTone}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{AD_TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Video Pacing</Label>
                                    <Select value={pacing} onValueChange={setPacing}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{VIDEO_PACING.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Focus</Label>
                                    <Select value={focus} onValueChange={setFocus}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{VISUAL_FOCUS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Amazon Compliant Mode</Label>
                                    <p className="text-xs text-muted-foreground">Remove exaggerated claims & fake reviews</p>
                                </div>
                                <Switch checked={amazonCompliant} onCheckedChange={setAmazonCompliant} />
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
            <VideoAssistantWidget onSend={askVideoAssistant} />
        </div>
    );
}
