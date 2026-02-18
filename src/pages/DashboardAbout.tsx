import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Code,
    Image as ImageIcon,
    Video,
    LayoutTemplate,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { THEME, cn } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// --- CONSTANTS ---
const TABS = [
    { id: "overview", label: "Overview" },
    { id: "json", label: "JSON Prompts" },
    { id: "image", label: "Image Gen" },
    { id: "video", label: "Video Gen" },
    { id: "website", label: "Website Gen" },
];

const JSON_EXAMPLE = `{
  "prompt": "Studio product photo of a matte-black wireless earbuds case on white marble, softbox lighting, premium e-commerce look, sharp focus",
  "negativePrompt": "blurry, low-res, watermark, text, logo, extra objects, distorted",
  "aspectRatio": "4:5",
  "style": "studio",
  "quality": "high"
}`;

export default function DashboardAbout() {
    const [activeTab, setActiveTab] = useState("overview");

    // Scroll Logic
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
            rootMargin: "-20% 0px -60% 0px",
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
            const offset = 100; // Account for navbar + tabs
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
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            <div className="container mx-auto px-4 lg:px-6 pt-24 pb-20 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">About Prompt Weaver</h1>
                    <p className="text-muted-foreground text-lg">
                        The structural engine for your e-commerce AI workflows.
                    </p>
                </div>

                {/* Sticky Tabs */}
                <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 mb-12 -mx-4 px-4 lg:-mx-6 lg:px-6 py-2 overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-24">
                    {/* SECTION 1: OVERVIEW */}
                    <section id="overview" className="scroll-mt-32">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-foreground">What is Prompt Weaver?</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Prompt Weaver is designed specifically for e-commerce teams who need consistency from their AI tools.
                                        It eliminates the guesswork by generating structured, optimized prompts for your marketing workflows.
                                    </p>
                                    <p>
                                        Whether you are creating product ads, catalog listings, or landing pages, our engine ensures
                                        outputs are format-compliant and brand-aligned every time.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {[
                                        "Consistent outputs across campaigns",
                                        "Faster iteration cycles",
                                        "E-commerce structured schemas"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card className="p-6 bg-white/[0.02] border-white/10">
                                <div className="h-full flex flex-col justify-center">
                                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                                        <p className="text-sm font-medium text-primary mb-1">Our Mission</p>
                                        <p className="text-muted-foreground text-sm">To replace vague "chatting" with precise "engineering" in creative AI workflows.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>

                    {/* SECTION 2: JSON PROMPT */}
                    <section id="json" className="scroll-mt-32">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground">What is a JSON Prompt?</h2>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        A JSON prompt is a structured data format tailored for AI models. Unlike sentences which can be misinterpreted,
                                        JSON fields provide explicit instructions for every aspect of generation.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                            Reduces ambiguity in complex scenes
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                            Improves consistency of style and lighting
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                            Ensures strict adherence to aspect ratios
                                        </li>
                                    </ul>
                                    <div className="pt-2">
                                        <p className="text-sm font-medium text-blue-400">
                                            “Structured prompts = predictable results and fewer failed generations.”
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-50" />
                                    <div className="relative rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                                            <span className="text-xs font-mono text-muted-foreground">structure.json</span>
                                        </div>
                                        <div className="p-4 overflow-x-auto">
                                            <pre className="font-mono text-xs md:text-sm leading-relaxed text-blue-300/90">
                                                {JSON_EXAMPLE}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: IMAGE GEN */}
                    <section id="image" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row items-start gap-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 shrink-0">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-xl font-semibold">Image Generation Prompts</h3>
                                <p className="text-muted-foreground lg:max-w-2xl">
                                    Create studio-quality prompts for product photography, ad creatives, and marketplace images.
                                    Our engine ensures your lighting, style, direction, and aspect ratio remain locked across all generations.
                                </p>
                                <Link to="/image-generator" className="inline-block">
                                    <Button variant="secondary" className="gap-2">
                                        Generate Image Prompt <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: VIDEO GEN */}
                    <section id="video" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row items-start gap-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                                <Video className="w-8 h-8" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-xl font-semibold">Video Generation Prompts</h3>
                                <p className="text-muted-foreground lg:max-w-2xl">
                                    Script and structure prompts for product demos, UGC-style ads, and social reels.
                                    Define hooks, scenes, pacing, and camera movement specifically for video AI models.
                                </p>
                                <Link to="/video-generator" className="inline-block">
                                    <Button variant="secondary" className="gap-2">
                                        Generate Video Prompt <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5: WEBSITE GEN */}
                    <section id="website" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row items-start gap-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                                <LayoutTemplate className="w-8 h-8" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-xl font-semibold">Website Generation Prompts</h3>
                                <p className="text-muted-foreground lg:max-w-2xl">
                                    Generate structural prompts for high-converting landing pages, product funnels, and promotional sites.
                                    Ensure your copy tone and layout hierarchy are optimized for e-commerce conversion.
                                </p>
                                <Link to="/website-generator" className="inline-block">
                                    <Button variant="secondary" className="gap-2">
                                        Generate Website Prompt <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
