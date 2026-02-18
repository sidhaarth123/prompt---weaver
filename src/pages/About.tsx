import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    MonitorPlay,
    LayoutTemplate,
    CheckCircle2,
    ArrowRight,
    Code,
    Zap,
    Image as ImageIcon,
    Video,
    Smartphone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";
import { Button } from "@/components/ui/button";

// --- CONSTANTS ---

const TABS = [
    { id: "about", label: "About" },
    { id: "json", label: "JSON Prompts" },
    { id: "image", label: "Image" },
    { id: "video", label: "Video" },
    { id: "website", label: "Website" },
];

const JSON_EXAMPLE = `{
  "prompt": "Studio product photo of a matte-black wireless earbuds case on white marble, softbox lighting, premium e-commerce look, sharp focus",
  "negativePrompt": "blurry, low-res, watermark, text, logo, extra objects, distorted",
  "aspectRatio": "4:5",
  "style": "studio",
  "quality": "high"
}`;

const TRUST_CHIPS = ["Product Ads", "Listings & Catalog", "Landing Pages"];

// --- COMPONENTS ---

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="text-center mb-16 space-y-4">
            <h2 className={THEME.h2}>{title}</h2>
            {subtitle && <p className={cn(THEME.p, "max-w-2xl mx-auto")}>{subtitle}</p>}
        </div>
    );
}

export default function About() {
    const [activeTab, setActiveTab] = useState("about");

    // Scroll Logic for Active Tab
    useEffect(() => {
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: "-20% 0px -60% 0px", // Adjust to trigger when section is near top
            threshold: 0,
        });

        TABS.forEach((tab) => {
            const element = document.getElementById(tab.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // height of sticky nav + main nav
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className={cn(THEME.glow, "top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/20 blur-[120px]")} />

                <div className={cn(THEME.container, "text-center")}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
                            <Zap className="w-3 h-3 text-indigo-400" />
                            <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">
                                For E-commerce Teams
                            </span>
                        </div>

                        <h1 className={cn(THEME.h1, "max-w-5xl mx-auto")}>
                            Prompt Weaver: structured prompts for <br />
                            <span className="text-indigo-400">e-commerce creatives.</span>
                        </h1>

                        <p className={cn(THEME.p, "max-w-3xl mx-auto text-lg/relaxed")}>
                            Generate structured, optimized prompts for your AI marketing tools.
                            Produces consistent product shots, video scripts, and landing pages structure—saving you hours of rerolls.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Link to="/image-generator">
                                <Button className="h-12 px-8 text-base font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                                    Try the Prompt Generator
                                </Button>
                            </Link>
                            <button
                                onClick={() => scrollToSection("json")}
                                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-4 py-2"
                            >
                                What is a JSON Prompt? <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Trusted Chips */}
                        <div className="pt-8 flex flex-wrap items-center justify-center gap-3">
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-2">Trusted for:</span>
                            {TRUST_CHIPS.map((chip) => (
                                <div key={chip} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-indigo-200/80">
                                    {chip}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- STICKY SUB-NAV --- */}
            <div className="sticky top-16 lg:top-20 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 w-full overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-4 flex items-center justify-center min-w-max">
                    <div className="flex gap-1 p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-white/10 text-white shadow-sm"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SECTION 1: WHAT IS PROMPT WEAVER --- */}
            <section id="about" className={THEME.section}>
                <div className={THEME.container}>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className={THEME.h2}>Why we built Prompt Weaver.</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                E-commerce teams waste countless hours guessing the right words to get usable images from AI. Result? Inconsistent lighting, wrong aspect ratios, and disjointed brand styles.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Prompt Weaver solves this by enforcing structure. We don't just "generate prompts"—we architect them using e-commerce best practices, ensuring every output matches your brand's quality standards.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { title: "Consistent Outputs", desc: "Uniform style across all campaigns." },
                                { title: "Faster Iteration", desc: "Stop fighting the AI, start creating." },
                                { title: "E-commerce Ready", desc: "Optimized for product & ads." },
                                { title: "Platform Specific", desc: "Instagram, Amazon, eBay, Shopify." }
                            ].map((card, i) => (
                                <div key={i} className={cn(THEME.glassCard, "p-6")}>
                                    <h3 className="font-semibold text-white mb-2">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: JSON PROMPT --- */}
            <section id="json" className={cn(THEME.section, "bg-white/[0.02]")}>
                <div className={THEME.container}>
                    <SectionHeading
                        title="What is a JSON Prompt?"
                        subtitle="Vague sentences yield vague results. Structured logic yields perfection."
                    />

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 relative rounded-xl overflow-hidden shadow-2xl bg-[#0d0d0d] border border-white/10 group">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" className="h-8 text-xs bg-white/10 hover:bg-white/20">Copy JSON</Button>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">product_prompt.json</span>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <pre className="font-mono text-sm leading-relaxed text-indigo-300">
                                    {JSON_EXAMPLE}
                                </pre>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Code className="w-5 h-5 text-indigo-400" />
                                    The Structure of Perfection
                                </h3>
                                <p className="text-muted-foreground">
                                    A JSON prompt breaks your request into strict fields that AI models can interpret without ambiguity.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Prompt: The core subject description.",
                                    "Negative Prompt: What to strictly avoid (blur, distortion).",
                                    "Aspect Ratio: Locked formatting for social/web.",
                                    "Style & Quality: Consistency tokens for branding."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-sm text-indigo-200 font-medium">
                                    “Structured prompts = fewer failed generations and predictable results.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: IMAGE GENERATION --- */}
            <section id="image" className={THEME.section}>
                <div className={THEME.container}>
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <div className="lg:w-1/3 sticky top-32">
                            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Image Generation Prompts</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Create studio-quality product shots, lifestyle scenes, and high-converting ad banners.
                            </p>
                            <Link to="/image-generator">
                                <Button className="rounded-full bg-pink-600 hover:bg-pink-700 text-white">Generate Image Prompt</Button>
                            </Link>
                        </div>
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "Consistent Lighting", desc: "Studio, natural, or neon—kept uniform across SKUs." },
                                { title: "Clean Backgrounds", desc: "Pure white, lifestyle blur, or branded distinct environments." },
                                { title: "Brand Look Preserved", desc: "Maintaining your color palette and mood tokens." },
                                { title: "Correct Aspect Ratios", desc: "1:1 for Square, 9:16 for Stories, 4:5 for Feed." }
                            ].map((card, i) => (
                                <div key={i} className={cn(THEME.glassCard, "p-6 hover:border-pink-500/30 transition-colors")}>
                                    <CheckCircle2 className="w-6 h-6 text-pink-500 mb-4" />
                                    <h4 className="font-bold text-white mb-2">{card.title}</h4>
                                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: VIDEO GENERATION --- */}
            <section id="video" className={cn(THEME.section, "bg-white/[0.02]")}>
                <div className={THEME.container}>
                    <div className="flex flex-col lg:flex-row-reverse items-start gap-12">
                        <div className="lg:w-1/3 sticky top-32">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                                <Video className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Video Generation Prompts</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Script and direct AI video tools for product demos, UGC-style ads, and engaging Reels.
                            </p>
                            <Link to="/video-generator">
                                <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white">Generate Video Prompt</Button>
                            </Link>
                        </div>
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "Hooks & Pacing", desc: "Detailed timeline instructions for 3s, 10s, and 30s clips." },
                                { title: "Platform-Ready Framing", desc: "Vertical optimized compositions for mobile-first viewing." },
                                { title: "Consistent Tone", desc: "Set the mood: energetic, luxury, calm, or viral." },
                                { title: "Fewer Retries", desc: "Get usable motion clips on the first or second try." }
                            ].map((card, i) => (
                                <div key={i} className={cn(THEME.glassCard, "p-6 hover:border-purple-500/30 transition-colors")}>
                                    <CheckCircle2 className="w-6 h-6 text-purple-500 mb-4" />
                                    <h4 className="font-bold text-white mb-2">{card.title}</h4>
                                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: WEBSITE GENERATION --- */}
            <section id="website" className={THEME.section}>
                <div className={THEME.container}>
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <div className="lg:w-1/3 sticky top-32">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                                <LayoutTemplate className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Website Generation Prompts</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Structure high-converting landing pages, product funnels, and promotional sites.
                            </p>
                            <Link to="/website-generator">
                                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">Generate Website Prompt</Button>
                            </Link>
                        </div>
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                            {[
                                { title: "Conversion Structure", desc: "Hero, Features, Social Proof, CTA - perfectly ordered." },
                                { title: "Clear Sections", desc: "Defined containers for clean, modern web layouts." },
                                { title: "Brand-Consistent Copy", desc: "Matches your voice for headlines and body text." },
                                { title: "Faster Publishing", desc: "Go from idea to wireframe prompt in seconds." }
                            ].map((card, i) => (
                                <div key={i} className={cn(THEME.glassCard, "p-6 hover:border-blue-500/30 transition-colors")}>
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 mb-4" />
                                    <h4 className="font-bold text-white mb-2">{card.title}</h4>
                                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent" />
                <div className={cn(THEME.container, "text-center relative z-10")}>
                    <h2 className={cn(THEME.h1, "mb-6 text-5xl md:text-6xl")}>Stop guessing. <br /> Start generating.</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join the e-commerce teams creating better ads faster with Prompt Weaver.
                    </p>
                    <Link to="/auth?tab=signup">
                        <Button className="h-16 px-12 rounded-full text-xl font-bold bg-white text-black hover:bg-white/90 shadow-2xl shadow-indigo-500/20 transition-transform hover:-translate-y-1">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
