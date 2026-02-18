import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Zap,
  Code2,
  GitBranch,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";
import { PRICING_TIERS } from "@/config/pricing";

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to the main app (Image Generator)
    if (!loading && user) {
      navigate("/image-generator", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className={cn(THEME.section, "pt-32 pb-20 lg:pt-48 lg:pb-32")}>
        {/* Minimal Background Effects */}
        <div className={cn(THEME.glow, "top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/20 blur-[120px]")} />

        <div className={cn(THEME.container, "text-center")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 flex flex-col items-center"
          >
            {/* Professional Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">
                Professional Prompt Engineering
              </span>
            </div>

            {/* Confident Headline */}
            <h1 className={cn(THEME.h1, "max-w-4xl mx-auto")}>
              Structured Prompts for<br />
              <span className="text-indigo-400">Production AI Systems</span>
            </h1>

            {/* Clear Value Prop */}
            <p className={cn(THEME.p, "max-w-2xl mx-auto")}>
              Build, version, and deploy schema-validated prompts with<br className="hidden sm:block" />
              enterprise-grade precision and consistency.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/auth?tab=signup">
                <Button
                  className="h-12 px-8 text-base font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  className="h-12 px-8 text-base font-medium rounded-full border-white/10 bg-transparent hover:bg-white/5 hover:text-white transition-all"
                >
                  See Pricing
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <p className="text-sm text-white/40 pt-4 flex items-center justify-center gap-6 flex-wrap">
              <span>✓ No credit card required</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Cancel anytime</span>
            </p>
          </motion.div>

          {/* Hero Visual / Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="mx-auto mt-20 max-w-6xl"
          >
            <div className={cn(
              THEME.glassCard,
              "p-2 md:p-3 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl"
            )}>
              <div className="rounded-xl overflow-hidden bg-black/60 border border-white/5 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group shadow-2xl shadow-black/50">
                {/* Abstract UI representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50" />
                <div className="text-center space-y-4 relative z-10">
                  <Code2 className="w-16 h-16 text-white/20 mx-auto" />
                  <p className="text-white/30 font-mono text-sm">System Architecture Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-12 border-y border-white/[0.06] bg-black/20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-8">
            Trusted by AI teams at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-50 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-white/60">OpenAI</span>
            <span className="text-xl font-bold text-white/60">Google DeepMind</span>
            <span className="text-xl font-bold text-white/60">Anthropic</span>
            <span className="text-xl font-bold text-white/60">Mistral</span>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className={THEME.section}>
        <div className={THEME.container}>
          <div className="text-center mb-16">
            <h2 className={cn(THEME.h2, "mb-4")}>Enterprise-Grade Prompt Management</h2>
            <p className={cn(THEME.p, "max-w-2xl mx-auto")}>
              Built for teams that require consistency, scalability, and control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  THEME.glassCard,
                  "p-8 group hover:border-white/20 transition-colors"
                )}
              >
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-white/5", f.color)}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className={cn(THEME.h3, "mb-3")}>{f.title}</h3>
                <p className={THEME.p}>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className={cn(THEME.section, "bg-white/[0.02]")}>
        <div className={THEME.container}>
          <div className="text-center mb-16">
            <h2 className={THEME.h2}>Three Steps to Production</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl font-bold font-mono text-indigo-400 mb-6 z-10 shadow-xl">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className={cn(THEME.p, "max-w-[250px]")}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className={cn(THEME.section, "border-t border-white/5")}>
        <div className={THEME.container}>
          <div className="text-center mb-16">
            <h2 className={THEME.h2}>Simple Pricing</h2>
            <p className={THEME.p}>Start for free, scale with your team.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
            {PRICING_TIERS.map((plan, i) => (
              <div key={plan.name} className={cn(
                THEME.glassCard,
                "p-6 flex flex-col items-center text-center h-full",
                plan.highlighted ? "border-indigo-500/50 bg-indigo-500/[0.03] scale-105 z-10 shadow-xl shadow-indigo-500/10" : "hover:bg-white/5"
              )}>
                <h3 className="text-lg font-medium text-white/70 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-white mb-4">{plan.price}<span className="text-xs font-normal text-white/40">/mo</span></div>
                <ul className="space-y-3 mb-6 w-full flex-1">
                  {plan.features.slice(0, 3).map(f => (
                    <li key={f} className="text-xs text-white/60 flex items-center justify-center gap-2">
                      <Zap className="w-3 h-3 text-indigo-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" className="w-full">
                  <Button size="sm" className={cn("w-full rounded-full h-9 text-xs", plan.highlighted ? "bg-indigo-600 hover:bg-indigo-700" : "bg-white/10 hover:bg-white/20")}>
                    {plan.highlighted ? "Get Started" : "View Details"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className={cn(THEME.section, "bg-black/40")}>
        <div className={cn(THEME.container, "max-w-4xl")}>
          <h2 className={cn(THEME.h3, "text-center mb-12")}>Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Is it really free?</h4>
              <p className="text-sm text-white/50 leading-relaxed">Yes, our Starter plan is free forever. No credit card needed.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Can I use it for commercial work?</h4>
              <p className="text-sm text-white/50 leading-relaxed">Absolutely. You own 100% of the prompts you generate.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">What models are supported?</h4>
              <p className="text-sm text-white/50 leading-relaxed">We optimize for GPT-4, Claude 3, and Midjourney v6.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Do you have an API?</h4>
              <p className="text-sm text-white/50 leading-relaxed">Yes, API access is available on the Team plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20" />
        <div className={cn(THEME.container, "text-center relative z-10")}>
          <h2 className={cn(THEME.h2, "mb-6")}>Ready to weave magic?</h2>
          <Link to="/auth?tab=signup">
            <Button className="h-14 px-12 rounded-full text-lg font-bold bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10 transition-transform hover:-translate-y-1">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
