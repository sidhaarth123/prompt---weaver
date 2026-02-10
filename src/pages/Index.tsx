import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Code, History, Layers, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  { icon: Code, title: "Structured JSON Output", description: "Schema-validated prompts ready for Google AI Studio with zero manual formatting." },
  { icon: History, title: "Prompt History", description: "Every prompt saved and searchable. Re-edit, regenerate, or version any time." },
  { icon: Layers, title: "Presets & Templates", description: "Start from proven templates or save your own parameter combos for instant reuse." },
  { icon: Sparkles, title: "AI-Powered", description: "Gemini-powered engine optimizes your prompts for single-pass, high-quality generation." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(263_70%_58%/0.12),transparent_60%)]" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Zap className="h-3 w-3" /> AI-Powered Prompt Engineering
            </span>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Turn your ideas into{" "}
              <span className="gradient-text">AI Studio–ready prompts</span>{" "}
              in seconds
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Generate schema-validated JSON prompts for Google AI Studio image and video generation.
              Copy, save, and reuse — no manual formatting required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="glow-sm gap-2">
                <Link to="/generator">
                  Try Prompt Generator <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>

          {/* Demo preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur glow-md">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 text-left">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Input</div>
                  <div className="space-y-2">
                    <div className="rounded-md bg-secondary/50 px-3 py-2 text-sm"><span className="text-muted-foreground">Subject:</span> A golden retriever in a field of sunflowers</div>
                    <div className="rounded-md bg-secondary/50 px-3 py-2 text-sm"><span className="text-muted-foreground">Style:</span> Photorealistic</div>
                    <div className="rounded-md bg-secondary/50 px-3 py-2 text-sm"><span className="text-muted-foreground">Mood:</span> Warm &amp; Joyful</div>
                  </div>
                </div>
                <div className="space-y-3 text-left">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">JSON Output</div>
                  <pre className="rounded-md bg-surface p-3 text-xs leading-relaxed text-foreground/80 overflow-x-auto">
{`{
  "prompt": "A golden retriever...",
  "negative_prompt": "blur, noise",
  "aspect_ratio": "16:9",
  "style_preset": "photorealistic",
  "output_format": "png"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Built for serious prompt engineering</h2>
            <p className="mt-3 text-muted-foreground">Everything you need to craft production-quality AI prompts.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:glow-sm"
              >
                <f.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-card p-12 glow-md">
            <h2 className="text-3xl font-bold">Start generating prompts today</h2>
            <p className="mt-3 text-muted-foreground">Free tier includes 5 prompts per day. No credit card required.</p>
            <Button asChild size="lg" className="mt-6 glow-sm">
              <Link to="/auth?tab=signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
