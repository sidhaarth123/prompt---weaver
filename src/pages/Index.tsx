import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Zap,
  Code2,
  ListRestart,
  CreditCard,
  ArrowRight,
  Sparkles,
  ChevronRight,
  MonitorPlay,
  Share2,
  Lock,
  GitBranch,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";

const FEATURES = [
  {
    icon: Code2,
    title: "Structured Prompt Architecture",
    description: "Schema-validated JSON output with parameter control, system instruction management, and API-ready formatting.",
    color: "text-blue-400",
  },
  {
    icon: GitBranch,
    title: "Version Control & History",
    description: "Track every iteration. Roll back changes. Maintain prompt libraries with full audit trails and change logs.",
    color: "text-purple-400",
  },
  {
    icon: Sparkles,
    title: "Context-Aware Input System",
    description: "Dynamic placeholders, reusable frameworks, and intelligent parameter injection for consistent outputs at scale.",
    color: "text-amber-400",
  },
  {
    icon: Zap,
    title: "Production Deployment Ready",
    description: "Export to Google AI Studio, OpenAI, Anthropic. Direct API integration with validated schemas and error handling.",
    color: "text-green-400",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Configure",
    desc: "Select your use case, style, and parameters.",
  },
  {
    num: "02",
    title: "Generate",
    desc: "AI weaves your inputs into a perfect prompt.",
  },
  {
    num: "03",
    title: "Deploy",
    desc: "Copy the structured JSON directly to your app.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Minimal Background Effects */}
        <div className={cn(THEME.glowMedium, "top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/40")} />

        <div className={cn(THEME.containerNarrow, "relative z-10 text-center")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Professional Badge */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white/90 tracking-wider uppercase">
                Professional Prompt Engineering
              </span>
            </div>

            {/* Confident Headline - No hype */}
            <h1 className={cn(THEME.headingXL, "mx-auto max-w-4xl text-white")}>
              Structured Prompts for<br />
              <span className="text-white/95">
                Production AI Systems
              </span>
            </h1>

            {/* Clear Value Prop */}
            <p className={cn(THEME.subheadingLG, "mx-auto max-w-2xl")}>
              Build, version, and deploy schema-validated prompts with<br className="hidden sm:block" />
              enterprise-grade precision and consistency.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
              <Link to="/auth?tab=signup">
                <Button
                  className={cn(
                    THEME.buttonLarge,
                    THEME.primaryGradient,
                    THEME.hoverLift,
                  )}
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  className={cn(THEME.buttonLarge, "border-white/10 bg-transparent hover:bg-white/[0.06]", THEME.hoverLift)}
                >
                  See Pricing
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <p className="text-sm text-white/50 pt-6 flex items-center justify-center gap-6 flex-wrap">
              <span>✓ No credit card required</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Cancel anytime</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Secure payments</span>
            </p>
          </motion.div>

          {/* Hero Visual / Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="mx-auto mt-24 max-w-6xl perspective-1000"
          >
            <div className={cn(
              THEME.glassCard,
              "p-2 md:p-3 bg-gradient-to-b from-white/[0.05] to-transparent"
            )}>
              <div className="rounded-xl overflow-hidden bg-background/40 border border-white/5 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group shadow-2xl shadow-black/50">
                {/* Fake UI Preview Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 opacity-80" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl p-8 lg:p-12 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  {/* Left: Inputs */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-3 w-3 rounded-full bg-red-500/20" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                      <div className="h-3 w-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="h-10 w-48 bg-white/5 rounded-lg border border-white/5 flex items-center px-4">
                      <div className="h-2 w-24 bg-white/20 rounded-full" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="h-12 w-full bg-white/5 rounded-lg border border-white/5 transition-colors group-hover:border-primary/20 flex items-center px-4">
                        <div className="h-2 w-3/4 bg-white/10 rounded-full animate-pulse" />
                      </div>
                      <div className="h-12 w-2/3 bg-white/5 rounded-lg border border-white/5 flex items-center px-4">
                        <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="pt-6">
                      <div className="h-12 w-40 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center">
                        <div className="h-2 w-20 bg-primary/60 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Code */}
                  <div className="hidden md:block rounded-xl bg-black/60 border border-white/10 p-6 font-mono text-sm text-blue-100/70 shadow-inner overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-50"><Code2 className="w-5 h-5 text-white/20" /></div>
                    <p className="text-purple-400 mb-2">{"{"}</p>
                    <div className="space-y-1 pl-4">
                      <p><span className="text-blue-400">"system_instruction"</span>: <span className="text-amber-300">"You are an expert prompt engineer..."</span>,</p>
                      <p><span className="text-blue-400">"parameters"</span>: <span className="text-green-400">{"{"}</span></p>
                      <p className="pl-4"><span className="text-blue-400">"temperature"</span>: <span className="text-orange-400">0.7</span>,</p>
                      <p className="pl-4"><span className="text-blue-400">"top_p"</span>: <span className="text-orange-400">0.9</span></p>
                      <p><span className="text-green-400">{"}"}</span>,</p>
                      <p><span className="text-blue-400">"response_mime_type"</span>: <span className="text-amber-300">"application/json"</span></p>
                    </div>
                    <p className="text-purple-400 mt-2">{"}"}</p>

                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SOCIAL PROOF + CREDIBILITY ---*/}
      <section className="py-14 border-y border-white/[0.06] bg-gradient-to-b from-black/10 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase mb-10">
            Trusted by AI teams at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {[
              { name: "OpenAI", sub: "Compatible" },
              { name: "Google AI", sub: "Studio Ready" },
              { name: "Anthropic", sub: "Optimized" },
              { name: "12,000+", sub: "Teams" },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-lg font-bold text-white/40">
                  {item.name}
                </span>
                <span className="text-xs text-white/30 font-medium">{item.sub}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (OUTCOME-FOCUSED) --- */}
      <section className={cn(THEME.sectionPaddingLG, "relative overflow-hidden")}>
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

        <div className={THEME.containerNarrow}>
          {/* Section Header - Professional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={cn(THEME.headingLG, "mb-5")}>
              Enterprise-Grade Prompt Management
            </h2>
            <p className={cn(THEME.subheadingMD, "max-w-2xl mx-auto")}>
              Built for teams that require consistency, scalability, and control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={cn(
                  THEME.featureCard,
                  "p-10 flex flex-col group relative overflow-hidden",
                  THEME.hoverLift
                )}
              >
                {/* Premium glow on hover */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />

                <div className={cn(
                  "relative z-10 h-16 w-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-lg",
                  "group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500",
                  f.color
                )}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="relative z-10 text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className={cn("relative z-10", THEME.bodyLG)}>
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUE SECTION: STRUCTURED OUTPUT = BETTER RESULTS --- */}
      <section className={cn(THEME.sectionPaddingLG, "border-t border-white/5 bg-gradient-to-b from-black/10 to-transparent relative overflow-hidden")}>
        {/* Background accent */}
        {/* Minimal background accent */}
        <div className={cn(THEME.glowSubtle, "top-0 right-1/4 w-[500px] h-[400px] bg-indigo-500/50")} />

        <div className={THEME.containerNarrow}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">The Difference</span>
              </div>
              <h2 className={cn(THEME.headingLG, "mb-6")}>
                Structured Output =<br /> Better Results
              </h2>
              <p className={cn(THEME.bodyLG, "mb-8")}>
                Random prompts produce random results. Professional creators need consistency.
                Our platform helps you build schema-validated, reusable prompt templates
                that deliver high-quality outputs—every single time.
              </p>
              <ul className="space-y-4">
                {[
                  "Export production-ready JSON for Google AI Studio",
                  "Version control for every iteration",
                  "Build prompt libraries for your team",
                  "Integrate seamlessly with APIs"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={cn(THEME.glassCardPremium, "p-8 relative group")}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-6 h-6 text-primary" />
                  <span className="font-mono text-sm text-primary font-bold">JSON Output</span>
                </div>
                <div className="font-mono text-xs text-blue-100/80 bg-black/60 p-6 rounded-xl border border-white/10 overflow-x-auto">
                  <div className="text-purple-400 mb-1">{"{"}</div>
                  <div className="pl-4 space-y-1">
                    <div><span className="text-blue-400">"system_instruction"</span>: <span className="text-amber-300">"Expert prompt..."</span>,</div>
                    <div><span className="text-blue-400">"parameters"</span>: <span className="text-green-400">{"{"}</span></div>
                    <div className="pl-4"><span className="text-blue-400">"temperature"</span>: <span className="text-orange-400">0.7</span>,</div>
                    <div className="pl-4"><span className="text-blue-400">"top_p"</span>: <span className="text-orange-400">0.9</span></div>
                    <div><span className="text-green-400">{"}"}</span></div>
                  </div>
                  <div className="text-purple-400 mt-1">{"}"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (STREAMLINED) --- */}
      <section className={cn(THEME.sectionPadding, "bg-gradient-to-b from-transparent to-black/20")}>
        <div className={THEME.containerNarrow}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className={cn(THEME.headingLG, "mb-6")}>Three Steps to Production</h2>
            <p className={cn(THEME.subheadingMD)}>From concept to deployment in under 60 seconds.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={cn(
                  "w-24 h-24 rounded-2xl bg-gradient-to-br from-card to-background border border-white/10",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center",
                  "text-3xl font-bold font-mono text-primary mb-8 z-10 relative",
                  "group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500",
                  "ring-1 ring-white/5 group-hover:ring-primary/40"
                )}>
                  {step.num}
                  <div className="absolute inset-0 bg-primary/30 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className={cn(THEME.bodyMD, "max-w-[260px] mx-auto")}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DESIGNED FOR SERIOUS CREATORS --- */}
      <section className={cn(THEME.sectionPaddingLG, "border-t border-white/5 relative overflow-hidden")}>
        <div className={cn(THEME.glowMedium, "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/50")} />

        <div className={THEME.containerNarrow}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={cn(THEME.headingLG, "mb-6")}>
              Built for Performance-Driven Teams
            </h2>
            <p className={cn(THEME.subheadingMD, "max-w-3xl mx-auto")}>
              When AI quality matters, professionals trust Prompt Weaver.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MonitorPlay, title: "For Creators", desc: "Generate consistent, high-converting visual content for social, ads, and campaigns." },
              { icon: Share2, title: "For Marketers", desc: "Build reusable prompt templates. Scale your content without sacrificing quality." },
              { icon: Lock, title: "For AI Builders", desc: "Production-ready JSON exports. Integrate with your apps and workflows instantly." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(THEME.elevatedCard, "p-8 text-center group", THEME.hoverLift)}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className={THEME.bodyMD}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className={cn(THEME.sectionPaddingXL, "relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none" />

        <div className={THEME.containerNarrow}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(THEME.glassCardPremium, "p-16 md:p-24 text-center relative overflow-hidden bg-gradient-to-br from-indigo-900/30 to-purple-900/30")}
          >
            {/* Premium glows */}
            <div className={cn(THEME.glowMedium, "top-0 right-0 w-80 h-80 bg-primary/50")} />

            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className={cn(THEME.headingLG, "text-white drop-shadow-2xl")}>
                Ready to Build World-Class<br /> AI Prompts?
              </h2>
              <p className={cn(THEME.subheadingMD, "max-w-2xl mx-auto")}>
                Join thousands of creators, marketers, and AI builders using Prompt Weaver<br />
                to produce better results—faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <Link to="/auth?tab=signup">
                  <Button className={cn(THEME.buttonLarge, THEME.primaryGradient, THEME.hoverLift, "shadow-xl shadow-primary/30")}>
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="ghost" className={cn(THEME.buttonLarge, "border-white/10 bg-transparent hover:bg-white/[0.06]", THEME.hoverLift)}>
                    See Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-white/60 pt-6">
                ✓ No credit card required · Free plan available · Upgrade anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
