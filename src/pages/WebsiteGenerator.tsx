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
    Globe,
    Copy,
    Check,
    RefreshCw,
    Trash2,
    Layers,
    Monitor,
    Lightbulb
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// --- Constants ---

const WEBSITE_TYPES = [
    "SaaS Platform",
    "E-commerce Store",
    "Portfolio / Personal",
    "Agency / Corporate",
    "Landing Page",
    "Blog / Content",
];

const STYLES = [
    "Premium & minimal",
    "Bold & brutalist",
    "Futuristic & dark",
    "Playful & colorful",
    "Corporate & clean",
];

const GOALS = [
    "Generate Leads",
    "Direct Sales",
    "User Signups",
    "Brand Awareness",
    "Information / Edu",
];

const TECH_STACKS = [
    "Prompt Weaver (React + shadcn)",
    "Bolt.new",
    "Cursor (AI Editor)",
    "v0 (Vercel)",
    "Next.js (App Router)",
    "React + Vite",
];

const SECTIONS = [
    "Hero Section",
    "Features Grid",
    "Pricing Table",
    "Testimonials",
    "FAQ Accordion",
    "Contact Form",
    "Footer",
    "Call to Action (CTA)",
    "Team / About",
    "Blog Feed",
];

export default function WebsiteGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; json: string } | null>(null);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);

    // Form State
    const [brandName, setBrandName] = useState("");
    const [type, setType] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [goal, setGoal] = useState("");
    const [style, setStyle] = useState("");
    const [techStack, setTechStack] = useState("");
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    const toggleSection = (section: string) => {
        setSelectedSections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section]
        );
    };

    const handleGenerate = async () => {
        if (!brandName || !type || !techStack) {
            toast({
                title: "Missing fields",
                description: "Please fill in Brand Name, Type, and Tech Stack.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "website",
                    userText: `${brandName} - ${type}`,
                    stylePreset: style,
                    platform: techStack,
                    targetAudience,
                    intent: goal,
                    extra: {
                        sections: selectedSections
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Generation failed");
            }

            if (data.status === "succeeded" && data.result) {
                setResult({
                    text: data.result.humanReadable,
                    json: JSON.stringify(data.result.jsonPrompt, null, 2)
                });
                toast({ title: "Website prompt generated!" });
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
        setType("");
        setTargetAudience("");
        setGoal("");
        setStyle("");
        setTechStack("");
        setSelectedSections([]);
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
                                    AI Architect
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">
                                <span className={THEME.gradientText}>Website Prompt Generator</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                                Define your vision, and we'll architect the perfect prompt for AI website builders like Prompt Weaver, Bolt, and v0.
                            </p>
                        </div>

                        <div className="h-px w-full bg-border/40" />

                        {/* SECTION 1: CORE IDENTITY */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Core Identity</h3>
                                    <p className="text-xs text-muted-foreground">Define what you are building.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Project Name</Label>
                                    <Input
                                        placeholder="e.g. Nexus Dashboard"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Website Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WEBSITE_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 2: TECH & STYLE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Tech & Style</h3>
                                    <p className="text-xs text-muted-foreground">Choose your stack and aesthetic.</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tech Stack</Label>
                                    <Select value={techStack} onValueChange={setTechStack}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Target platform..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TECH_STACKS.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visual Style</Label>
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
                        </section>

                        {/* SECTION 3: STRATEGY */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-6 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Strategy</h3>
                                    <p className="text-xs text-muted-foreground">Who is this for and why?</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Target Audience</Label>
                                    <Input
                                        placeholder="e.g. Freelance Designers"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="bg-background/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Primary Goal</Label>
                                    <Select value={goal} onValueChange={setGoal}>
                                        <SelectTrigger className="bg-background/40 border-white/10 focus:ring-primary/20 h-10">
                                            <SelectValue placeholder="Main objective..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GOALS.map((g) => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: STRUCTURE */}
                        <section className={cn(THEME.glassCard, "p-6 space-y-5 hover:border-primary/20 transition-colors duration-500")}>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Structure</h3>
                                    <p className="text-xs text-muted-foreground">Select sections to include.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {SECTIONS.map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => toggleSection(section)}
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
                                            Configure your project details on the left to generate a professional structural prompt.
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
