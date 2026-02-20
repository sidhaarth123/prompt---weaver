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
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    ShoppingBag,
    Target,
    Zap,
    AlertCircle,
    Bot,
    Monitor,
    LayoutTemplate,
    TrendingUp,
    RefreshCw
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { usePromptWeaverChat } from "@/hooks/usePromptWeaverChat";
import { PremiumChatbot } from "@/components/PremiumChatbot";
import { mapWebsiteResponseToState } from "@/mappers/websiteMapper";

// --- Constants ---
const BUSINESS_MODELS = ["Single Product Brand", "Multi-Product Store", "Dropshipping", "Subscription Based", "Digital Product"];
const BRANDS_PERSONALITY = ["Minimal & Clean", "Bold & Energetic", "Luxury & Premium", "Playful", "Corporate"];
const CONVERSION_GOALS = ["Direct Purchase", "Add to Cart", "Email Capture", "Pre-Launch Waitlist"];
const STYLES = ["Premium & minimal", "Bold & brutalist", "Futuristic & dark", "Playful & colorful", "Corporate & clean"];

export default function WebsiteGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [touchedByUser, setTouchedByUser] = useState<Record<string, boolean>>({});

    // Form State
    const [brandName, setBrandName] = useState("");
    const [productType, setProductType] = useState("");
    const [businessModel, setBusinessModel] = useState("");
    const [targetMarket, setTargetMarket] = useState("");
    const [brandPersonality, setBrandPersonality] = useState("");
    const [conversionGoal, setConversionGoal] = useState("");
    const [style, setStyle] = useState("");

    const setFieldManually = (field: string, value: any, setter: (val: any) => void) => {
        setter(value);
        setTouchedByUser(prev => ({ ...prev, [field]: true }));
    };

    const setFieldAuto = (field: string, value: any) => {
        if (touchedByUser[field]) return;
        const setters: Record<string, (val: any) => void> = {
            brandName: setBrandName,
            productType: setProductType,
            businessModel: setBusinessModel,
            targetMarket: setTargetMarket,
            brandPersonality: setBrandPersonality,
            conversionGoal: setConversionGoal,
            style: setStyle
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
        workflowType: 'website',
        onDataReceived: (res) => {
            if (res.final) {
                mapWebsiteResponseToState(res.final, {}, setFieldAuto);
            }
            if (res.prompt_package) {
                setResult({
                    text: res.prompt_package.prompt || "Website blueprint generated successfully.",
                    json: JSON.stringify(res.final, null, 2)
                });
            }
        }
    });

    const handleGenerate = async () => {
        if (!brandName || !conversionGoal || !businessModel) {
            toast({ title: "Missing fields", description: "Fill in Brand, Goal, and Model.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const finalBlueprint = `Website Blueprint for ${brandName}\nType: ${productType}\nModel: ${businessModel}\nGoal: ${conversionGoal}\nPersonality: ${brandPersonality}\nStyle: ${style}`;
            setResult({
                text: finalBlueprint,
                json: JSON.stringify({ brandName, productType, businessModel, conversionGoal, brandPersonality, style }, null, 2)
            });
            toast({ title: "Website blueprint generated!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <main className="container relative z-10 mx-auto px-4 pt-24 pb-20">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">
                    <div className="space-y-6">
                        <div className="mb-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-4 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Store Architect v2.0</span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">E-commerce Blueprint Generator</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">Design high-converting Shopify stores and funnels with AI.</p>
                        </div>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Brand & Market</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Name</Label>
                                    <Input placeholder="e.g. Lumina Haus" value={brandName} onChange={e => setFieldManually('brandName', e.target.value, setBrandName)} className="bg-background/40 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Product Type</Label>
                                    <Input placeholder="e.g. Furniture" value={productType} onChange={e => setFieldManually('productType', e.target.value, setProductType)} className="bg-background/40 border-white/10" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Business Model</Label>
                                    <Select value={businessModel} onValueChange={v => setFieldManually('businessModel', v, setBusinessModel)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BUSINESS_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Brand Personality</Label>
                                    <Select value={brandPersonality} onValueChange={v => setFieldManually('brandPersonality', v, setBrandPersonality)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{BRANDS_PERSONALITY.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        <section className={cn(THEME.glassCard, "p-6 space-y-6")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-lg">Funnel & Strategy</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Conversion Goal</Label>
                                    <Select value={conversionGoal} onValueChange={v => setFieldManually('conversionGoal', v, setConversionGoal)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{CONVERSION_GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Style</Label>
                                    <Select value={style} onValueChange={v => setFieldManually('style', v, setStyle)}>
                                        <SelectTrigger className="bg-background/40 border-white/10"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        <Button onClick={handleGenerate} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                            {loading ? <RefreshCw className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                            Generate Store Blueprint
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
                                "Modern luxury Shopify store",
                                "High-converting single-product funnel",
                                "Corporate SaaS marketing site",
                                "Playful toy brand experience"
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
