import { motion } from "framer-motion";
import {
    Zap,
    Layers,
    ArrowRight,
    Code2,
    Target,
    Sparkles,
    ShoppingBag,
    Globe,
    Image as ImageIcon,
    Video,
    LayoutTemplate,
    MonitorPlay,
    CheckCircle2,
    MousePointer2,
    Cpu,
    ZapPulse,
    ShieldCheck,
    Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FEATURE_CARDS = [
    {
        title: "Consistent Outputs",
        desc: "Uniform style and lighting across every single execution.",
        icon: <Target className="w-5 h-5 text-[#2dd4bf]" />,
    },
    {
        title: "Faster Iteration",
        desc: "Stop fighting the AI, start creating with accuracy.",
        icon: <ZapPulse className="w-5 h-5 text-[#a855f7]" />,
    },
    {
        title: "E-commerce Ready",
        desc: "Optimized for conversion focused product assets.",
        icon: <ShoppingBag className="w-5 h-5 text-[#fb7185]" />,
    },
    {
        title: "Multi-Platform",
        desc: "Native outputs for Instagram, Amazon, and Shopify.",
        icon: <Cpu className="w-5 h-5 text-[#3b82f6]" />,
    }
];

const JSON_EXAMPLE = `{
  "prompt": "Studio product photo of a matte-black wireless earbuds case on white marble, softbox lighting, premium e-commerce look, sharp focus",
  "negativePrompt": "blurry, low-res, watermark, text, logo, extra objects, distorted",
  "aspectRatio": "4:5",
  "style": "Luxury-Studio",
  "quality": "high-fidelity"
}`;

export default function About() {
    return (
        <div className="min-h-screen bg-[#05060b] text-white selection:bg-cyan-500/20 font-sans">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* ── SECTION: HERO / WHY WE BUILT ── */}
                <section className="container mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                                <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">OUR MISSION & VISION</span>
                            </div>
                            <h1 className="text-[72px] font-black leading-[0.95] tracking-[-0.04em] mb-8">
                                Why we built <br />
                                <span className="text-white">Prompt <br /> Weaver.</span>
                            </h1>
                            <p className="text-xl text-white/50 leading-relaxed mb-6 font-medium">
                                E-commerce teams waste countless hours guessing the right words to get usable images from AI. Result? <span className="text-white">Inconsistent lighting, wrong aspect ratios, and disjointed brand styles.</span>
                            </p>
                            <p className="text-lg text-white/30 leading-relaxed font-medium">
                                Prompt Weaver solves this by enforcing structure. We don't just "generate prompts"—we <span className="text-cyan-400">architect them using e-commerce best practices</span>, ensuring every output matches your brand's luxury standards.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6">
                            {FEATURE_CARDS.map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-[#0d0f17] border border-white/5 shadow-2xl group hover:border-white/10 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight mb-2">{card.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{card.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SECTION: THE STRUCTURE OF PERFECTION ── */}
                <section className="py-32">
                    <div className="container mx-auto px-6 text-center mb-24">
                        <h2 className="text-[48px] font-black tracking-tight mb-4">The Structure of Perfection</h2>
                        <p className="text-lg text-white/40 italic">
                            "Vague sentences yield vague results. <span className="text-cyan-400 font-bold">Structured logic</span> yields perfection."
                        </p>
                    </div>

                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* JSON CODE BLOCK */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#080a10] shadow-3xl">
                                    <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                                        </div>
                                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">PRODUCT_PROMPT.JSON</span>
                                    </div>
                                    <div className="p-8 font-mono text-[13px] leading-relaxed overflow-x-auto text-[#a5b4fc]">
                                        <pre>{JSON_EXAMPLE}</pre>
                                    </div>
                                </div>
                            </div>

                            {/* EXPLANATION */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                        <Code2 className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-black">What is a JSON Prompt?</h3>
                                    <p className="text-lg text-white/40 leading-relaxed">
                                        A JSON prompt breaks your request into strict, machine-readable fields that AI models interpret without ambiguity.
                                    </p>
                                </div>

                                <ul className="space-y-6">
                                    {[
                                        { l: "Prompt:", d: "The core subject and aesthetic descriptors." },
                                        { l: "Negative Prompt:", d: "Strict guidelines on what to exclude." },
                                        { l: "Aspect Ratio:", d: "Locked formatting for all digital channels." },
                                        { l: "Style Tokens:", d: "Mathematical consistency for brand mood." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                            <p className="text-sm text-white/40 leading-relaxed">
                                                <span className="text-white font-bold">{item.l}</span> {item.d}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 italic">
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        "Structured prompts equal fewer failed generations and predictable, <span className="text-white font-bold">studio-grade outputs."</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SECTION: IMAGE GENERATION ── */}
                <section className="container mx-auto px-6 py-40 border-t border-white/5">
                    <div className="grid lg:grid-cols-[1fr,1.2fr] gap-20">
                        <div className="space-y-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center">
                                <ImageIcon className="w-7 h-7 text-[#06b6d4]" />
                            </div>
                            <h2 className="text-5xl font-black tracking-tight leading-tight">Image Generation</h2>
                            <p className="text-xl text-white/50 leading-relaxed">
                                Create studio-quality product shots, lifestyle scenes, and high-converting ad banners with surgical precision.
                            </p>
                            <Link to="/image-generator" className="inline-block">
                                <Button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black tracking-tight rounded-2xl hover:scale-105 transition-transform">
                                    Generate Image Prompt
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { t: "Consistent Lighting", d: "Studio, natural, or cinematic—kept uniform across all product lines.", i: <Sparkles className="w-5 h-5" /> },
                                { t: "Clean Backgrounds", d: "Pure white, lifestyle blur, or branded environments tailored to your look.", i: <Target className="w-5 h-5" /> },
                                { t: "Brand Look Preserved", d: "Maintaining your brand's exact skin-tones with color palette constraints.", i: <ShieldCheck className="w-5 h-5" /> },
                                { t: "Platform Framing", d: "Vertical optimized compositions designed for mobile-first social viewing.", i: <Layers className="w-5 h-5" /> }
                            ].map((box, i) => (
                                <div key={i} className="p-10 rounded-3xl bg-[#090b12] border border-white/5 flex flex-col items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                        {box.i}
                                    </div>
                                    <h4 className="text-lg font-black tracking-tight">{box.t}</h4>
                                    <p className="text-sm text-white/30 leading-relaxed">{box.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── SECTION: VIDEO GENERATION ── */}
                <section className="container mx-auto px-6 py-40 border-t border-white/5">
                    <div className="grid lg:grid-cols-[1.2fr,1fr] gap-20">
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { t: "Hooks & Pacing", d: "Detailed motion instructions for 3s, 10s, and 30s high-conversion clips.", i: <Zap className="w-5 h-5" /> },
                                { t: "Platform-Ready Framing", d: "Vertical-first cinematic compositions designed for mobile-first content.", i: <MonitorPlay className="w-5 h-5" /> },
                                { t: "Consistent Tone", desc: "Set the exact high-energy tone, luxury aesthetic, or viral scripting.", i: <Target className="w-5 h-5" /> },
                                { t: "Fewer Retries", d: "Get usable professional film clips on the first try with architectural instructions.", i: <Lock className="w-5 h-5" /> }
                            ].map((box, i) => (
                                <div key={i} className="p-10 rounded-3xl bg-[#090b12] border border-white/5 flex flex-col items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
                                        {box.i}
                                    </div>
                                    <h4 className="text-lg font-black tracking-tight">{box.t}</h4>
                                    <p className="text-sm text-white/30 leading-relaxed">{box.d || box.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8 lg:text-right flex flex-col lg:items-end">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Video className="w-7 h-7 text-purple-400" />
                            </div>
                            <h2 className="text-5xl font-black tracking-tight leading-tight">Video Generation</h2>
                            <p className="text-xl text-white/50 leading-relaxed">
                                Script and direct AI video tools for product demos, UGC-style ads, and engaging Reels.
                            </p>
                            <Link to="/video-generator" className="inline-block">
                                <Button className="h-14 px-8 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-black tracking-tight rounded-2xl hover:scale-105 transition-transform">
                                    Generate Video Prompt
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── SECTION: WEBSITE GENERATION ── */}
                <section className="container mx-auto px-6 py-40 border-t border-white/5">
                    <div className="grid lg:grid-cols-[1fr,1.2fr] gap-20">
                        <div className="space-y-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <LayoutTemplate className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-5xl font-black tracking-tight leading-tight">Website Generation</h2>
                            <p className="text-xl text-white/50 leading-relaxed">
                                Structure high-converting landing pages, product funnels, and promotional sites with modern UI/UX logic.
                            </p>
                            <Link to="/website-generator" className="inline-block">
                                <Button className="h-14 px-8 bg-gradient-to-r from-primary to-blue-500 text-white font-black tracking-tight rounded-2xl hover:scale-105 transition-transform">
                                    Generate Website Prompt
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { t: "Conversion Structure", d: "Hero, Features, Social Proof, CTA - perfectly optimized flow for maximum conversion.", i: <MousePointer2 className="w-5 h-5" /> },
                                { t: "Clear Sections", d: "Defined containers and spatial logic for clean, elite web layouts.", i: <Layers className="w-5 h-5" /> },
                                { t: "Brand-Consistent Copy", d: "Matches your brand voice for headlines, taglines, and body text.", i: <CheckCircle2 className="w-5 h-5" /> },
                                { t: "Rapid Publishing", d: "Go from idea point to functional wireframe prompt structure in seconds.", i: <ZapPulse className="w-5 h-5" /> }
                            ].map((box, i) => (
                                <div key={i} className="p-10 rounded-3xl bg-[#090b12] border border-white/5 flex flex-col items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                                        {box.i}
                                    </div>
                                    <h4 className="text-lg font-black tracking-tight">{box.t}</h4>
                                    <p className="text-sm text-white/30 leading-relaxed">{box.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            {/* ── FOOTER ── */}
            <footer className="pt-40 pb-20 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[14px] font-black tracking-[0.2em] text-white leading-tight">PROMPT</span>
                            <span className="text-[14px] font-black tracking-[0.2em] text-white/50 leading-tight">WEAVER</span>
                        </div>
                    </Link>

                    <p className="text-lg text-white/40 max-w-2xl mx-auto mb-4 font-medium italic">
                        "The world's first architectural prompt engine for luxury e-commerce teams."
                    </p>
                    <p className="text-[12px] font-black tracking-[0.2em] text-cyan-400 uppercase mb-12">
                        Designed for high-fidelity creators.
                    </p>

                    <div className="flex flex-wrap justify-center gap-10 mb-20 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Support Center</Link>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    </div>

                    <p className="text-[10px] font-bold text-white/10 tracking-[0.3em] uppercase">
                        © 2026 PROMPT WEAVER CREATIVE STUDIO. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
}
