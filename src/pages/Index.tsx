import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Layers,
  Rocket,
  ArrowRight,
  Twitter,
  Github,
  MessageSquare,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const STEPS = [
  {
    icon: Lightbulb,
    title: "Input Context",
    desc: "Start with your basic idea. Our context engine analyses your goals and suggests missing parameters or edge cases.",
    accent: "from-indigo-500/20 to-indigo-500/5",
    iconColor: "text-indigo-400",
    badge: "STEP 01",
  },
  {
    icon: Layers,
    title: "Apply Frameworks",
    desc: "Inject professional engineering patterns like Chain-of-Thought, Few-Shot, or Tree-of-Thought with a single click.",
    accent: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
    badge: "STEP 02",
  },
  {
    icon: Rocket,
    title: "Deploy & Scale",
    desc: "Version control your prompts and deploy them instantly via our secure API or export to any LLM playground.",
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    badge: "STEP 03",
  },
];

/* ────────── Inline code-editor demo ────────── */
function PromptDemo() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl shadow-black/60 overflow-hidden font-mono text-[11px] leading-relaxed">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5 bg-[#111118]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-white/25 tracking-wider text-[10px]">OPTIMAL PROMPT WEAVER AI PROMPT</span>
        <div className="flex gap-2 opacity-40">
          <span className="w-5 h-5 rounded bg-white/10" />
          <span className="w-5 h-5 rounded bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">
        {/* Left — raw input */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4 font-sans">Raw Context</p>
          <p className="text-white/50 text-[12px] font-sans leading-6">
            "Write a description for a new high-end mechanical keyboard called the 'vantax Pro'. It should sound professional but exciting. Mention the RGB, the hotswap switches, and the aluminum build."
          </p>
        </div>

        {/* Right — structured output */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4 font-sans">Structured Instructions</p>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-pink-400 shrink-0">▸ VOICE_BIAS</span>
              <span className="text-white/60">Professional Copywriter</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400 shrink-0">▸ FRAMEWORK</span>
              <span className="text-white/60">Feature-Benefit Builder</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 shrink-0">▸ <span className="line-through opacity-50">PLACEHOLDERS</span></span>
              <span className="text-emerald-400">✓ Vantax Pro</span>
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.07] pt-4 text-[11px]">
            <p className="text-white/30 mb-2">// Refined Instruction</p>
            <p className="text-white/70 leading-5">
              AI as a luxury tech copywriter. Craft a 256-word product narrative for the{" "}
              <span className="text-violet-400">Vantax Pro</span>.
            </p>
          </div>

          <div className="mt-3 text-[10px] space-y-1.5">
            <p className="text-white/25">// CONSTRAINTS</p>
            <p className="text-white/50">
              • Focus on the{" "}
              <span className="text-sky-400 underline decoration-dotted">aluminum space cluster RGP</span> tactility
            </p>
            <p className="text-white/50">
              • Explain{" "}
              <span className="text-sky-400 underline decoration-dotted">hotswap switches</span> for enthusiasts
            </p>
            <p className="text-white/50">
              • Tone: Sophisticated, innovative, exclusive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/image-generator", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#08080f] text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full" />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 flex flex-col items-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/[0.06] px-4 py-1.5">
              <span className="text-[11px] font-semibold text-indigo-300 tracking-[0.18em] uppercase">
                Now · Published v2 (v1.4)
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-3xl mx-auto">
              Weave the Perfect
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                Prompt Architecture
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              The professional-grade IDE for prompt engineering. Transform vague
              ideas into precise, high-fidelity instructions with built-in logic and
              context optimization.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/auth?tab=signup">
                <Button className="h-12 px-8 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.03] gap-2">
                  Start Weaving Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="h-12 px-8 text-sm font-medium rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/80 hover:text-white transition-all"
                >
                  View Templates
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Product Demo */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, type: "spring", stiffness: 45 }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <PromptDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── ENGINEERING EXCELLENCE ─────────────────────────── */}
      <section className="py-28 border-t border-white/[0.06]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Engineering Excellence
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              From raw thought to production-ready API call in three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Subtle gradient top */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${step.accent}`} />

                <div className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-widest ${step.iconColor} mb-6 opacity-60`}>
                  {step.badge}
                </div>

                <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${step.iconColor}`}>
                  <step.icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-[#08080f] to-purple-900/20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/60 to-black/60 backdrop-blur-xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center gap-0">
              {/* Left — text */}
              <div className="p-12 lg:p-16 space-y-6">
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
                  Ready to upgrade your
                  <br />
                  <span className="text-indigo-400">AI stack?</span>
                </h2>
                <p className="text-white/50 text-base leading-relaxed">
                  Join 10,000+ prompt engineers crafting the next generation of
                  AI-native applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/auth?tab=signup">
                    <Button className="h-11 px-7 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.03]">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button
                      variant="outline"
                      className="h-11 px-7 text-sm font-medium rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/70 hover:text-white transition-all"
                    >
                      Schedule a Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right — visual */}
              <div className="hidden md:flex items-center justify-center p-8 relative min-h-[320px]">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Glowing network nodes */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10 font-mono text-[11px] leading-relaxed bg-black/40 border border-white/[0.08] rounded-xl p-6 w-full max-w-sm">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3 font-sans">Prompt Matrix IDE</p>
                    <div className="space-y-2">
                      {["▸ analyzing context…", "▸ applying COT framework…", "▸ validating schema…", "✓ prompt_ready: true", "✓ tokens: 847 / 2048"].map((line, i) => (
                        <motion.p
                          key={line}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15 }}
                          className={`${line.startsWith("✓") ? "text-emerald-400" : "text-white/40"}`}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                    <div className="mt-4 h-1 bg-white/5 rounded-full">
                      <div className="h-full w-[72%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1.5 font-sans">Optimizing by Prompt Weaver</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 bg-[#06060c]">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white/70">PromptWeaver</span>
            <span className="text-white/20 text-xs">© 2024 Prompt Weaver Inc. All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              Twitter
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Discord
            </a>
            <Link
              to="/docs"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
