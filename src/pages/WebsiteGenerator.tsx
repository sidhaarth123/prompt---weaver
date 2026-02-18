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
    ArrowUp
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import AssistantTypingIndicator from "@/components/AssistantTypingIndicator";

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
    const [assistantInput, setAssistantInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

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

    // Auto-scroll chat
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, loading]);

    // Toggles
    const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
        setter(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
    };

    const handleAssistantSubmit = async () => {
        if (!assistantInput.trim() || loading) return;

        const input = assistantInput;
        setAssistantInput("");
        setLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: input }]);

        try {
            await askWebsiteAssistant(input);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Blueprint generated! I've filled in the details and created your prompt structure." }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an issue generating the layout. Please try again." }]);
        } finally {
            setLoading(false);
        }
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

                        <div className="h-px w-full bg-border/40" />

                        <div className="flex items-center justify-between pb-2">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Manual Blueprint Controls (Optional)</h3>
                            <span className="text-xs text-muted-foreground/60 italic">The assistant can auto-fill everything</span>
                        </div>

                        {/* ACTIONS - HIDDEN GENERATE BUTTON */}
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

                    {/* RIGHT: WEBSITE BLUEPRINT ASSISTANT PANEL */}
                    <div className="lg:sticky lg:top-24 h-[calc(100vh-120px)] min-h-[600px] flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">

                        {/* CHAT INTERFACE CARD */}
                        <div className="flex flex-col flex-1 min-h-[550px] rounded-[24px] border border-white/[0.08] bg-[#0F0F16]/65 backdrop-blur-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden relative group ring-1 ring-white/5 hover:ring-white/10 transition-all">

                            {/* 1. Header (Floating / Fixed Top) */}
                            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-white leading-none">Website Blueprint Assistant</h1>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium">E-commerce Conversion Architect</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-medium text-green-400/80">ONLINE</span>
                                </div>
                            </div>

                            {/* 2. Messages Area (Flex Grow, Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                                {chatHistory.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                                            <Sparkles className="w-8 h-8 text-primary/40" />
                                        </div>
                                        <div className="space-y-2 max-w-sm">
                                            <h3 className="text-lg font-medium text-white">Assistant ready.</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Describe your website vision above to generate a blueprint.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {chatHistory.map((msg, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={cn(
                                                    "flex w-full",
                                                    msg.role === "user" ? "justify-end" : "justify-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "max-w-[85%] rounded-[20px] p-5 text-sm leading-relaxed shadow-lg",
                                                        msg.role === "user"
                                                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-md"
                                                            : "bg-white/[0.07] border border-white/[0.08] text-slate-200 rounded-tl-md backdrop-blur-sm shadow-md"
                                                    )}
                                                >
                                                    {msg.content}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {loading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start w-full"
                                            >
                                                <div className="bg-white/[0.04] border border-white/[0.05] text-white px-6 py-4 rounded-[20px] rounded-tl-md backdrop-blur-sm flex items-center gap-3 shadow-lg">
                                                    <span className="text-xs font-medium text-muted-foreground">Architecting blueprint</span>
                                                    <div className="flex gap-1.5 pt-1">
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-[bounce_1s_infinite_0ms]" />
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-[bounce_1s_infinite_200ms]" />
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-[bounce_1s_infinite_400ms]" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                                <div ref={chatEndRef} className="h-4" />
                            </div>

                            {/* 3. Sticky Input Area (Bottom) */}
                            <div className="p-5 border-t border-white/[0.08] bg-black/20 backdrop-blur-xl z-20">
                                {/* Suggestion Chips */}
                                <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none mask-fade-right">
                                    {["DTC Brand Homepage", "High-converting Shopify store", "SaaS landing with pricing", "E-commerce funnel page", "Product-focused landing page"].map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setAssistantInput(chip)}
                                            className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-white hover:border-primary/40 transition-all flex-shrink-0"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Field */}
                                <div className="relative group/input">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[18px] opacity-0 group-focus-within/input:opacity-20 transition duration-500 blur-md transition-all"></div>
                                    <div className="relative flex items-end gap-2 bg-[#1A1A24] border border-white/10 rounded-[16px] p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-inner">
                                        <Textarea
                                            placeholder="Describe your website vision... e.g. Premium DTC skincare brand..."
                                            value={assistantInput}
                                            onChange={e => setAssistantInput(e.target.value)}
                                            className="w-full min-h-[56px] max-h-[120px] bg-transparent border-0 resize-none text-base p-3 focus-visible:ring-0 placeholder:text-muted-foreground/40 text-white leading-relaxed"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
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
                                                "mb-1 h-10 w-10 rounded-xl transition-all duration-300 shadow-lg",
                                                assistantInput.trim()
                                                    ? "bg-gradient-to-br from-blue-600 to-cyan-600 hover:scale-105 hover:shadow-blue-500/25 text-white"
                                                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            <ArrowUp className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Output Result (Below Chat) */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Code2 className="w-4 h-4" /> Generated Blueprint
                                </h2>
                                {result && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-white" onClick={() => copyToClipboard(result.text, false)}>
                                        <Copy className="w-3 h-3 mr-1.5" /> Copy Prompt
                                    </Button>
                                )}
                            </div>

                            <div className={cn(THEME.glassCard, "overflow-hidden border-primary/10 shadow-lg min-h-[250px] flex flex-col")}>
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

                                    <div className="relative flex-1 bg-black/40 min-h-[250px]">
                                        <TabsContent value="text" className="m-0 h-full">
                                            <Textarea
                                                value={result?.text || ""}
                                                readOnly
                                                placeholder="Your generated website blueprint prompt will appear here..."
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
            </main >
        </div >
    );
}
