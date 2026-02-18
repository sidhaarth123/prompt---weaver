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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    LayoutTemplate,
    Code2,
    Target,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Layers,
    Monitor,
    Lightbulb,
    ShoppingBag,
    TrendingUp
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import WebsiteAssistantWidget from "@/components/WebsiteAssistantWidget";

// --- Constants ---

const BUSINESS_MODELS = [
    "Single Product Brand",
    "Multi-Product Store",
    "Dropshipping",
    "Print on Demand",
    "Subscription Based",
    "Digital Product"
];

const PRICE_RANGES = ["Budget", "Mid-Range", "Premium", "Luxury"];

const BRAND_PERSONALITIES = [
    "Minimal & Clean",
    "Bold & Energetic",
    "Luxury & Premium",
    "Playful",
    "Corporate",
    "Futuristic"
];

const TECH_STACKS = [
    "Prompt Weaver (React + shadcn)",
    "Bolt.new",
    "Cursor (AI Editor)",
    "v0 (Vercel)",
    "Next.js (App Router)",
    "React + Vite",
];

const ECOM_PLATFORMS = [
    "Shopify",
    "WooCommerce",
    "Custom (Next.js)",
    "Webflow",
    "Framer",
    "Headless Commerce"
];

const PAYMENT_GATEWAYS = [
    "Stripe",
    "Razorpay",
    "PayPal",
    "Apple Pay",
    "Google Pay",
    "COD"
];

const CONVERSION_GOALS = [
    "Direct Purchase",
    "Add to Cart",
    "Email Capture",
    "Pre-Launch Waitlist",
    "Upsell Funnel",
    "Bundle Sales"
];

const TRAFFIC_SOURCES = [
    "Meta Ads",
    "TikTok Ads",
    "Google Ads",
    "Organic SEO",
    "Influencer Marketing",
    "Mixed Traffic"
];

const FUNNEL_TYPES = [
    "Single Page Funnel",
    "Multi-Step Funnel",
    "Traditional Store",
    "High-Converting Landing Page",
    "Sales Letter Style"
];

const SECTIONS = [
    "Hero Section",
    "Product Showcase Grid",
    "Featured Product Section",
    "Features Grid",
    "Trust Badges",
    "Pricing Table",
    "Comparison Table",
    "Bundle Offers Section",
    "Frequently Bought Together",
    "Customer Reviews Slider",
    "Instagram Feed",
    "Shipping & Returns Info",
    "Guarantee Section",
    "FAQ Accordion",
    "Contact Form",
    "Newsletter Signup",
    "Footer",
    "Sticky Add-to-Cart Bar",
    "Countdown Timer",
    "Team / About",
    "Blog Feed",
];

const PSYCHOLOGY_STYLES = [
    "Scarcity Focused",
    "Social Proof Heavy",
    "Storytelling Driven",
    "Data & Statistics",
    "Premium Brand Authority"
];

const URGENCY_STRATEGIES = [
    "Limited Stock",
    "Limited Time Offer",
    "Flash Sale",
    "New Launch",
    "Evergreen"
];

const UPSELL_STRATEGIES = [
    "Cart Upsell",
    "Post-Purchase Upsell",
    "Bundle Discount",
    "Subscription Offer",
    "None"
];

const TRUST_ELEMENTS = [
    "Money Back Guarantee",
    "Secure Payment Icons",
    "Customer Testimonials",
    "Influencer Reviews",
    "Certifications"
];

const STYLES = [
    "Premium & minimal",
    "Bold & brutalist",
    "Futuristic & dark",
    "Playful & colorful",
    "Corporate & clean",
];

export default function WebsiteGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // --- State ---

    // Core Identity
    const [brandName, setBrandName] = useState("");
    const [productType, setProductType] = useState("");
    const [businessModel, setBusinessModel] = useState("");
    const [targetMarket, setTargetMarket] = useState(""); // Replaces targetAudience
    const [priceRange, setPriceRange] = useState("");
    const [usp, setUsp] = useState("");
    const [competitors, setCompetitors] = useState("");
    const [brandPersonality, setBrandPersonality] = useState("");

    // Tech & Style
    const [techStack, setTechStack] = useState("");
    const [style, setStyle] = useState("");
    const [ecomPlatform, setEcomPlatform] = useState("");
    const [paymentIntegrations, setPaymentIntegrations] = useState<string[]>([]);
    const [currency, setCurrency] = useState("");
    const [shippingRegions, setShippingRegions] = useState("");

    // Strategy
    const [conversionGoal, setConversionGoal] = useState("");
    const [trafficSource, setTrafficSource] = useState("");
    const [funnelType, setFunnelType] = useState("");

    // Structure
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    // Conversion Optimization
    const [psychologyStyle, setPsychologyStyle] = useState("");
    const [urgencyStrategy, setUrgencyStrategy] = useState("");
    const [upsellStrategy, setUpsellStrategy] = useState("");
    const [trustElements, setTrustElements] = useState<string[]>([]);

    // Toggles
    const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
    };

    const handleGenerate = async () => {
        if (!brandName || !businessModel || !conversionGoal) {
            toast({
                title: "Missing fields",
                description: "Please fill in Brand Name, Business Model, and Conversion Goal.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            // E-commerce Persona Prompt Construction
            const systemPrompt = `You are a world-class E-commerce Architect and Conversion Rate Optimization (CRO) Expert.
            Your goal is to design a high-converting, premium e-commerce website blueprint.
            
            PROJECT DETAILS:
            Brand Name: ${brandName}
            Business Model: ${businessModel}
            Product Type: ${productType}
            Target Market: ${targetMarket}
            Price Range: ${priceRange}
            USP: ${usp}
            Brand Personality: ${brandPersonality}
            
            TECH STACK:
            Platform: ${ecomPlatform} (built with ${techStack})
            Visual Style: ${style}
            Payment Gateways: ${paymentIntegrations.join(", ")}
            Currency: ${currency}
            
            STRATEGY:
            Primary Goal: ${conversionGoal}
            Funnel Type: ${funnelType}
            Traffic Source: ${trafficSource} (Optimize for this traffic)
            
            CONVERSION LABS:
            Psychology: ${psychologyStyle}
            Urgency Strategy: ${urgencyStrategy}
            Upsell Strategy: ${upsellStrategy}
            Trust Signals: ${trustElements.join(", ")}
            
            STRUCTURE:
            ${selectedSections.join("\n")}
            `;

            const response = await fetch("/api/website-prompt-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "website",
                    userText: systemPrompt, // Passing the full constructed context as userText for the backend handler
                    stylePreset: style,
                    platform: techStack,
                    targetAudience: targetMarket,
                    intent: conversionGoal,
                    extra: {
                        sections: selectedSections,
                        ecom: {
                            brand_name: brandName,
                            product_type: productType,
                            business_model: businessModel,
                            target_market: targetMarket,
                            price_range: priceRange,
                            usp,
                            competitors,
                            brand_personality: brandPersonality,
                            ecommerce_platform: ecomPlatform,
                            payment_integrations: paymentIntegrations,
                            currency,
                            shipping_regions: shippingRegions,
                            conversion_goal: conversionGoal,
                            traffic_source: trafficSource,
                            funnel_type: funnelType,
                            structure_sections: selectedSections,
                            psychology_style: psychologyStyle,
                            urgency_strategy: urgencyStrategy,
                            upsell_strategy: upsellStrategy,
                            trust_elements: trustElements
                        }
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Generation failed");
            }

            // Construct specific JSON spec for E-com
            const ecomJsonSpec = {
                brand: {
                    name: brandName,
                    type: productType,
                    model: businessModel,
                    personality: brandPersonality,
                    usp: usp,
                    target: targetMarket,
                    price: priceRange
                },
                business: {
                    currency,
                    shipping: shippingRegions,
                    payments: paymentIntegrations
                },
                tech: {
                    stack: techStack,
                    platform: ecomPlatform,
                    visual_style: style
                },
                strategy: {
                    goal: conversionGoal,
                    funnel: funnelType,
                    traffic: trafficSource
                },
                structure: selectedSections,
                conversion: {
                    psychology: psychologyStyle,
                    urgency: urgencyStrategy,
                    upsell: upsellStrategy,
                    trust: trustElements
                }
            };

            if (data.status === "succeeded" && data.result) {
                setResult({
                    text: data.result.humanReadable,
                    json: JSON.stringify(ecomJsonSpec, null, 2)
                });
                toast({ title: "Store blueprint generated!" });
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
        setBrandName("");
        setProductType("");
        setBusinessModel("");
        setTargetMarket("");
        setPriceRange("");
        setUsp("");
        setCompetitors("");
        setBrandPersonality("");

        setTechStack("");
        setStyle("");
        setEcomPlatform("");
        setPaymentIntegrations([]);
        setCurrency("");
        setShippingRegions("");

        setConversionGoal("");
        setTrafficSource("");
        setFunnelType("");

        setSelectedSections([]);

        setPsychologyStyle("");
        setUrgencyStrategy("");
        setUpsellStrategy("");
        setTrustElements([]);

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

    async function askWebsiteAssistant(message: string) {
        const form_state = {
            website: {
                ecom: {
                    brand_name: brandName,
                    product_type: productType,
                    business_model: businessModel,
                    target_market: targetMarket,
                    price_range: priceRange,
                    usp,
                    competitors,
                    brand_personality: brandPersonality,
                    ecommerce_platform: ecomPlatform,
                    tech_stack: techStack,
                    visual_style: style,
                    payment_integrations: paymentIntegrations,
                    currency,
                    shipping_regions: shippingRegions,
                    conversion_goal: conversionGoal,
                    traffic_source: trafficSource,
                    funnel_type: funnelType,
                    structure_sections: selectedSections,
                    psychology_style: psychologyStyle,
                    urgency_strategy: urgencyStrategy,
                    upsell_strategy: upsellStrategy,
                    trust_elements: trustElements
                }
            }
        };

        const res = await fetch("http://localhost:5000/api/website-prompt-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, form_state }),
        });

        const json = await res.json();

        if (!json.ok) {
            toast({
                title: "Assistant Error",
                description: json.error || "Failed to generate website blueprint.",
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
            return options.find(o => o.toLowerCase() === v) ||
                options.find(o => o.toLowerCase().includes(v) || v.includes(o.toLowerCase())) ||
                val;
        };

        // Helper for array fuzzy matching
        const matchArray = (vals: string[], options: string[]) => {
            if (!Array.isArray(vals)) return [];
            return vals.map(v => matchOption(v, options)).filter(Boolean);
        };

        const e = fill.ecom || {};

        if (e.brand_name) setBrandName(e.brand_name);
        if (e.product_type) setProductType(e.product_type);
        if (e.business_model) setBusinessModel(matchOption(e.business_model, BUSINESS_MODELS));
        if (e.target_market) setTargetMarket(e.target_market);
        if (e.price_range) setPriceRange(matchOption(e.price_range, PRICE_RANGES));
        if (e.usp) setUsp(e.usp);
        if (e.competitors) setCompetitors(e.competitors);
        if (e.brand_personality) setBrandPersonality(matchOption(e.brand_personality, BRAND_PERSONALITIES));

        if (e.ecommerce_platform) setEcomPlatform(matchOption(e.ecommerce_platform, ECOM_PLATFORMS));
        if (e.tech_stack) setTechStack(matchOption(e.tech_stack, TECH_STACKS));
        if (e.visual_style) setStyle(matchOption(e.visual_style, STYLES));
        if (e.payment_integrations) setPaymentIntegrations(matchArray(e.payment_integrations, PAYMENT_GATEWAYS));
        if (e.currency) setCurrency(e.currency);
        if (e.shipping_regions) setShippingRegions(e.shipping_regions);

        if (e.conversion_goal) setConversionGoal(matchOption(e.conversion_goal, CONVERSION_GOALS));
        if (e.traffic_source) setTrafficSource(matchOption(e.traffic_source, TRAFFIC_SOURCES));
        if (e.funnel_type) setFunnelType(matchOption(e.funnel_type, FUNNEL_TYPES));

        if (e.structure_sections) setSelectedSections(matchArray(e.structure_sections, SECTIONS));

        if (e.psychology_style) setPsychologyStyle(matchOption(e.psychology_style, PSYCHOLOGY_STYLES));
        if (e.urgency_strategy) setUrgencyStrategy(matchOption(e.urgency_strategy, URGENCY_STRATEGIES));
        if (e.upsell_strategy) setUpsellStrategy(matchOption(e.upsell_strategy, UPSELL_STRATEGIES));
        if (e.trust_elements) setTrustElements(matchArray(e.trust_elements, TRUST_ELEMENTS));

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
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
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
                                    Store Architect
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                <span className={THEME.gradientText}>E-commerce Blueprint Generator</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Design high-converting Shopify stores, funnels, and brand experiences with AI-guided architecture.
                            </p>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* SECTION 1: E-COMMERCE BRAND OVERVIEW */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Brand & Market</h3>
                                    <p className="text-xs text-muted-foreground">Define your business model and identity.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. Lumina Haus" value={brandName} onChange={e => setBrandName(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Type</Label>
                                    <Input placeholder="e.g. Modern Furniture" value={productType} onChange={e => setProductType(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Business Model</Label>
                                    <Select value={businessModel} onValueChange={setBusinessModel}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BUSINESS_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Price Range</Label>
                                    <Select value={priceRange} onValueChange={setPriceRange}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PRICE_RANGES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Market</Label>
                                    <Input placeholder="e.g. Remote WFH Professionals" value={targetMarket} onChange={e => setTargetMarket(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Personality</Label>
                                    <Select value={brandPersonality} onValueChange={setBrandPersonality}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BRAND_PERSONALITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Unique Selling Proposition (USP)</Label>
                                <Textarea placeholder="What makes your brand unique? e.g. Sustainable materials, lifetime warranty..." value={usp} onChange={e => setUsp(e.target.value)} className="bg-background/40 border-white/10 min-h-[60px]" />
                            </div>
                        </section>

                        {/* SECTION 2: TECH & STYLE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Tech & Ops</h3>
                                    <p className="text-xs text-muted-foreground">Platform, payments, and regional details.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">E-commerce Platform</Label>
                                    <Select value={ecomPlatform} onValueChange={setEcomPlatform}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select platform..." /></SelectTrigger>
                                        <SelectContent>{ECOM_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tech Stack (Implementation)</Label>
                                    <Select value={techStack} onValueChange={setTechStack}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select tech..." /></SelectTrigger>
                                        <SelectContent>{TECH_STACKS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Payment Integrations</Label>
                                <div className="flex flex-wrap gap-2">
                                    {PAYMENT_GATEWAYS.map((gateway) => (
                                        <button
                                            key={gateway}
                                            onClick={() => toggleSelection(gateway, paymentIntegrations, setPaymentIntegrations)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                                                paymentIntegrations.includes(gateway)
                                                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200"
                                                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            {gateway}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Store Currency</Label>
                                    <Input placeholder="e.g. USD, EUR" value={currency} onChange={e => setCurrency(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Shipping Regions</Label>
                                    <Input placeholder="e.g. Global, US Only" value={shippingRegions} onChange={e => setShippingRegions(e.target.value)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Style</Label>
                                <Select value={style} onValueChange={setStyle}>
                                    <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select style..." /></SelectTrigger>
                                    <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </section>

                        {/* SECTION 3: STRATEGY */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Funnel & Strategy</h3>
                                    <p className="text-xs text-muted-foreground">How will you acquire and convert traffic?</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Conversion Goal</Label>
                                    <Select value={conversionGoal} onValueChange={setConversionGoal}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CONVERSION_GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Traffic Source</Label>
                                    <Select value={trafficSource} onValueChange={setTrafficSource}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{TRAFFIC_SOURCES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Funnel Type</Label>
                                    <Select value={funnelType} onValueChange={setFunnelType}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{FUNNEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: CONVERSION OPTIMIZATION (NEW) */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Experience & CRO</h3>
                                    <p className="text-xs text-muted-foreground">Sales psychology and trust elements.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Psychology</Label>
                                    <Select value={psychologyStyle} onValueChange={setPsychologyStyle}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{PSYCHOLOGY_STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Urgency Strategy</Label>
                                    <Select value={urgencyStrategy} onValueChange={setUrgencyStrategy}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{URGENCY_STRATEGIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Upsell Strategy</Label>
                                    <Select value={upsellStrategy} onValueChange={setUpsellStrategy}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{UPSELL_STRATEGIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Trust & Credibility Elements</Label>
                                <div className="flex flex-wrap gap-2">
                                    {TRUST_ELEMENTS.map((trust) => (
                                        <button
                                            key={trust}
                                            onClick={() => toggleSelection(trust, trustElements, setTrustElements)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
                                                trustElements.includes(trust)
                                                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-200"
                                                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            {trust}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* SECTION 5: STRUCTURE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-5 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Site Structure</h3>
                                    <p className="text-xs text-muted-foreground">Select pages and sections to include.</p>
                                </div>
                            </div>

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
                                className={cn("flex-1 h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-[1.02]")}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Blueprint...
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb className="w-4 h-4 mr-2 fill-current" /> Generate Blueprint
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
                                            <LayoutTemplate className="h-10 w-10 text-primary/80" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Awaiting Blueprint</h3>
                                        <p className="text-sm text-muted-foreground max-w-[260px] mt-3 leading-relaxed">
                                            Define your business model and strategy to generate a professional e-commerce architecture.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </main>
            <WebsiteAssistantWidget onSend={askWebsiteAssistant} />
        </div>
    );
}
